import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { BiSolidRightArrow } from "react-icons/bi";
import projectImg from "../assets/projects.jpg"

export default function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const ref = collection(db, "projects")
        // Se as tuas regras exigem published == true, a query TEM de ter este where
        const q = query(
          ref,
          where("published", "==", true),
          where("featured", "==", true),   // só os destacados
          orderBy("order", "asc")          // opcional se tiveres o campo "order"
        )
        const snap = await getDocs(q)
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setProjects(items)
      } catch (err) {
        console.error("Erro ao carregar projetos:", err)
        setError("Não foi possível carregar os projetos.")
      }
    }
    fetchProjects()
  }, [])

  const displayFeatured = projects.map(project => (
    <div key={project.id} className="flex flex-col space-y-2 items-center justify-center p-5 text-white">
      <img
        src={project.imageUrl || projectImg}
        alt={project.title || "Project Image"}
        className="w-[120px] h-[120px] object-cover rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] md:w-[240px] md:h-[240px]"
      />
      <div className="flex text-center items-center justify-center space-x-1 mb-0">
        <span><BiSolidRightArrow className="text-brightOrange"/></span>
        <h2 className="font-bold text-md">{project.title || "Sem título"}</h2>
      </div>
    </div>
  ))

  return (
    <div className="container flex flex-col bg-darkerGray mx-auto items-center justify-around py-24 px-8">
      <div className="flex flex-col w-4/5 mx-auto items-center justify-around space-y-15 md:flex-row-reverse">
        <img src={projectImg} alt="Projects Image" className="bg-cover min-w-80 w-80 h-auto shadow-[0_0_20px_rgba(0,0,0,0.5)]" />
        <div className="flex flex-col items-start justify-start py-10 px-10 ">
          <div className="flex text-left items-center justify-center space-x-1 mb-0">
            <span><BiSolidRightArrow className="text-brightOrange"/></span>
            <p className="font-bold text-sm text-lightGray">Projects</p>
          </div>
          <h3 className="font-bold text-2xl text-white">What Have I Been Doing?</h3>
          <p className="max-w-130 text-lightGray mt-3">Featured Projects</p>
        </div>
      </div>

      <div className="flex flex-wrap">
        {error && <p className="text-red-400">{error}</p>}
        {!error && projects.length === 0 && (
          <p className="text-lightGray">Sem projetos para mostrar (marca published e featured).</p>
        )}
        {displayFeatured}
      </div>
    </div>
  )
}
