// sync.js

/* eslint-disable */

const { Octokit } = require("@octokit/rest");
const admin = require("firebase-admin");
const fs = require("fs");

// Secrets/ENV
const GH_PAT = process.env.GH_PAT; // o token do GitHub
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_SA_PATH = process.env.FIREBASE_SA_PATH || "service-account.json";
const GITHUB_USER = process.env.GITHUB_USERNAME;

// Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync(FIREBASE_SA_PATH, "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: FIREBASE_PROJECT_ID,
});
const db = admin.firestore();

// GitHub API client
const octokit = new Octokit(GH_PAT ? { auth: GH_PAT } : {});

// Helper para ir buscar todos os repos
async function listAllRepos(username) {
  const perPage = 100;
  let page = 1;
  let all = [];
  while (true) {
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
  if (!GITHUB_USER) throw new Error("Falta env GITHUB_USERNAME");
  if (!FIREBASE_PROJECT_ID) throw new Error("Falta env FIREBASE_PROJECT_ID");

  const repos = await listAllRepos(GITHUB_USER);

  // podes filtrar aqui se quiseres excluir forks, archived, etc
  const useful = repos.filter(r => !r.fork && !r.archived);

  const batch = db.batch();

  for (const r of useful) {
    const id = String(r.id);
    const ref = db.collection("projects").doc(id);

    // Lê doc existente para preservar flags manuais
    const snap = await ref.get();
    const existing = snap.exists ? snap.data() : {};

    const payload = {
      id,
      title: r.name || "",
      description: r.description || "",
      gitLink: r.html_url || "",
      liveLink: r.homepage || "",
      stars: r.stargazers_count || 0,
      updatedAt: r.pushed_at || r.updated_at || new Date().toISOString(),
      topics: r.topics || existing.topics || [],
      // preserva valores que controlas no Console
      featured: existing.featured ?? false,
      published: existing.published ?? false, // começa oculto
      order: existing.order ?? 9999,
      imageUrl: existing.imageUrl ?? "",
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
