// sync.cjs — CommonJS (corre bem mesmo com "type":"module" no package.json)
const { Octokit } = require("@octokit/rest");
const admin = require("firebase-admin");
const fs = require("fs");

// ENVs vindas do workflow
const GH_PAT = process.env.GH_PAT || "";               // opcional (scope: repo ou public_repo)
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID; // ex.: my-website-3bfb6
const FIREBASE_SA_PATH = process.env.FIREBASE_SA_PATH || "service-account.json";
const GITHUB_USER = process.env.GH_USERNAME;           // definido como Actions Variable (ex.: GH_USERNAME)

// ---- Firebase Admin SDK (regras são ignoradas pelo Admin SDK) ----
const serviceAccount = JSON.parse(fs.readFileSync(FIREBASE_SA_PATH, "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: FIREBASE_PROJECT_ID,
});
const db = admin.firestore();

// ---- GitHub REST client ----
const octokit = new Octokit(GH_PAT ? { auth: GH_PAT } : {});

// Helper: obter todos os repositórios do utilizador (até 3 páginas = 300 repos)
async function listAllRepos(username) {
  const perPage = 100;
  let page = 1;
  let all = [];
  while (page <= 3) {
    const { data } = await octokit.repos.listForUser({
      username,
      per_page: perPage,
      page,
      sort: "updated",
      direction: "desc",
      type: "owner",
    });
    all = all.concat(data);
    if (data.length < perPage) break;
    page++;
  }
  return all;
}

async function run() {
  if (!GITHUB_USER) throw new Error("Missing env GH_USERNAME");
  if (!FIREBASE_PROJECT_ID) throw new Error("Missing env FIREBASE_PROJECT_ID");

  const repos = await listAllRepos(GITHUB_USER);

  // Ignora forks e archived
  const useful = repos.filter(r => !r.fork && !r.archived);

  const batch = db.batch();
  let autoOrder = 1; // se ainda não tiveres 'order', dá uma ordem por defeito

  for (const r of useful) {
    const id = String(r.id); // usa o id do GitHub como docId
    const ref = db.collection("projects").doc(id);

    // Lê o doc existente para preservar valores que editares no painel admin
    const snap = await ref.get();
    const existing = snap.exists ? snap.data() : {};

    // Defaults: TRUE só na primeira vez (se o doc não existir ainda)
    const payload = {
      id,
      title: r.name || "",
      description: r.description || "",
      gitLink: r.html_url || "",
      liveLink: r.homepage || "",
      stars: r.stargazers_count || 0,
      updatedAt: r.pushed_at || r.updated_at || new Date().toISOString(),
      topics: Array.isArray(r.topics) ? r.topics : (existing.topics || []),

      // Campos controlados por ti no Console/Admin
      imageUrl: existing.imageUrl ?? "",
      order: existing.order ?? autoOrder++,

      // ⬇️ published/featured = true só na criação; se já existir, preserva
      published: existing.published ?? true,
      featured: existing.featured ?? true,
    };

    batch.set(ref, payload, { merge: true });
  }

  await batch.commit();
  console.log(`Synced ${useful.length} repos -> Firestore/projects`);
}

run().catch(err => {
  console.error("Erro no sync:", err);
  process.exit(1);
});
