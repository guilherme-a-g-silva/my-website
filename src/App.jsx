// App.jsx
import React from "react";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import ProjectsSection from "./components/ProjectsSection";
import ShowUID from "./components/ShowUID";
import AdminProjects from "./components/AdminProjects";   // <-- importa
import "./index.css";

export default function App() {
  const hash = typeof window !== "undefined" ? window.location.hash : "";
  const isUID = hash === "#uid";
  const adminView = hash === "#admin";

  if (isUID) return <ShowUID />;
  if (adminView) return <AdminProjects />;

  return (
    <>
      <Hero />
      <AboutMe />
      <ProjectsSection />
    </>
  );
}
