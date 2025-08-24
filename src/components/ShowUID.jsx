// src/components/ShowUID.jsx
import { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function ShowUID() {
  const [uid, setUid] = useState("");
  useEffect(() => onAuthStateChanged(auth, u => u && setUid(u.uid)), []);
  return (
    <div className="p-6 text-white">
      <button className="bg-brightOrange px-4 py-2 rounded"
              onClick={() => signInWithPopup(auth, provider)}>
        Entrar com Google
      </button>
      {uid && <p className="mt-4">UID: <code>{uid}</code></p>}
    </div>
  );
}
