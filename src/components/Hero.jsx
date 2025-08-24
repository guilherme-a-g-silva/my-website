import React from "react";
import portrait from "../assets/portrait-2-no-bg.png"

export default function Hero() {
    return (
        <div className="container flex flex-col bg-darkerGray mx-auto items-center justify-around px-12 py-24 space-y-15 md:flex-row md:space-x-20">
            <div className="flex flex-col space-y-2 text-center md:text-left">
                <h3 className="text-brightOrange text-xl">Hello, My Name Is</h3>
                <h1 className="text-white text-5xl">Guilherme Silva</h1>
                <p className="text-lightGray text-sm max-w-100">A passionate and dedicated junior web developer, driven by the ever-evolving world of technology and its limitless possibilities.</p>
            </div>
            <div className="flex items-end min-w-80 w-80 h-60 bg-gradient-to-br from-brightOrange to-darkerGray shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <img src={portrait} alt="Portrait" className="mb-0 w-auto h-80 drop-shadow-[0_12px_12px_rgba(0,0,0,0.1)]"/>
            </div>
        </div>
    )
}