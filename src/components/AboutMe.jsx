import React from "react"
import portrait from "../assets/portrait-1-no-bg.png"
import { BiSolidRightArrow } from "react-icons/bi";

export default function AboutMe() {
    return(
        <div className="container mx-auto flex flex-col-reverse px-12 py-24 items-center justify-around space-y-20 md:flex-row md:space-x-20 md:space-y-0">
            <div className="flex items-end min-w-60 w-80 h-60 bg-gradient-to-b from-brightOrange to-darkerGray shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <img src={portrait} alt="Another Portrait" className="drop-shadow-[0_12px_12px_rgba(0,0,0,0.1)]"/>
            </div>
           
            <div className="flex flex-col space-y-5 text-left mb-20 text-white md:mb-0">
                <div className="flex items-center justify-start space-x-1 mb-0">
                    <span><BiSolidRightArrow className="text-brightOrange"/></span>
                    <p className="font-bold text-sm text-lightGray">About me</p>
                </div>
                <h3 className="font-bold text-2xl">Who am I</h3>
                <p className="max-w-130 text-lightGray">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt velit repellat, molestias odit ullam eius rerum a ratione obcaecati ad, possimus amet doloremque voluptatum facilis. Saepe cupiditate numquam aliquid optio.</p>
                <button className="bg-brightOrange px-6 py-1 max-w-fit rounded-sm font-bold">Download CV</button>
            </div>
        </div>
    )
}