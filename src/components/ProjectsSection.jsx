import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { BiSolidRightArrow } from "react-icons/bi";
import projectImg from "../assets/projects.jpg"

export default function ProjectsSection() {

    const [projects, setProjects] = useState([])

    useEffect(() => {
    async function fetchProjects() {
        const q = await getDocs(collection(db, "projects"))
        const items = q.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
        }))
        setProjects(items)
    }

    fetchProjects()
    }, [])

    const featuredFilter = projects.filter((project) => project.featured === true)

    const displayFeatured = featuredFilter.map(project => {
        return (
            <div key={project.id} className="flex flex-col space-y-2 items-center justify-center p-5 text-white">
                <img src={project.imageUrl} alt="Project Image" className="w-30 h-30 object-cover rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] md:w-60 md:h-60"/>
                <div className="flex text-center items-center justify-center space-x-1 mb-0">
                    <span><BiSolidRightArrow className="text-brightOrange"/></span>
                    <h2 className="font-bold text-md">{project.title}</h2>
                </div>
            </div>
        )
    })

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
                {displayFeatured}
            </div>
        </div>
    )
}