import { useEffect, useState } from "react";
import { auth, db, provider } from "../firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from "firebase/firestore";

const ADMIN_UIDS = ["SEU_UID_AQUI"]; // mesmo UID das regras

export default function AdminProjects() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    if (!user || !ADMIN_UIDS.includes(user.uid)) return;
    const q = query(collection(db, "projects"), orderBy("title"));
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  async function toggle(id, field, value) {
    await updateDoc(doc(db, "projects", id), { [field]: value });
  }

  if (!user)
    return (
      <div className="p-8 text-white">
        <button className="bg-brightOrange px-4 py-2 rounded" onClick={() => signInWithPopup(auth, provider)}>
          Entrar (Google)
        </button>
      </div>
    );

  if (!ADMIN_UIDS.includes(user.uid))
    return (
      <div className="p-8 text-white">
        <p>Sem permissões de admin.</p>
        <button className="mt-4 bg-gray-700 px-3 py-1 rounded" onClick={() => signOut(auth)}>Sair</button>
      </div>
    );

  return (
    <div className="p-8 text-white space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin · Projects</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm opacity-70">UID: {user.uid}</span>
          <button className="bg-gray-700 px-3 py-1 rounded" onClick={() => signOut(auth)}>Sair</button>
        </div>
      </div>

      <div className="grid gap-3">
        {projects.map(p => (
          <div key={p.id} className="bg-darkerGray rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-lightGray text-sm max-w-[48ch]">{p.description}</div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!p.published} onChange={e => toggle(p.id,"published",e.target.checked)} />
                <span>Published</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={!!p.featured} onChange={e => toggle(p.id,"featured",e.target.checked)} />
                <span>Featured</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
