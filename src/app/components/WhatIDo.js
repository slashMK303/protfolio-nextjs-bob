"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

export default function WhatIDo() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const serviceRef = useRef(null);
    const groupsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hide title & service on scroll to 2nd item
            gsap.to([titleRef.current, serviceRef.current], {
                y: -100,
                opacity: 0,
                scrollTrigger: {
                    trigger: groupsRef.current[1],
                    start: "top 10%",
                    end: "top 1%",
                    scrub: true,
                    // markers: true,
                },
            });

            // Pin group
            groupsRef.current.forEach((el, i) => {
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 30%",
                    end: "+=83%",
                    pin: true,
                    pinSpacing: false,
                    // markers: true,
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const skills = [
        {
            id: "01",
            title: "Full-Stack Development",
            desc:
                "From frontend interactions to backend APIs, I build complete web solutions. I work with modern stacks to deliver apps that are scalable, maintainable, and ready for real-world users.",
            stack: ["React, Node.js, Express.js", "REST APIs, Firebase, Docker", "Git, GitHub, Postman"],
        },
        {
            id: "02",
            title: "UI/UX & Frontend",
            desc:
                "Design is more than looks — it's about clarity and connection. I design and develop clean, responsive interfaces that feel intuitive across devices. My focus is on clarity, accessibility, and seamless user experiences.",
            stack: ["NextJs, TailwindCSS, GSAP", "Figma to Code"],
        },
        {
            id: "03",
            title: "Optimization",
            desc:
                "Beyond handling data, I'm driven by the challenge of turning complex raw inputs into reliable, usable systems. I enjoy designing pipelines that power insights and apply core CS principles to build for scale, speed, and stability.",
            stack: ["Data Structures & Algorithms", "DBMS, OOP, OS Fundamentals", "Data Pipelines, ETL, and Scalability"],
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen bg-[#121212] text-neutral-200 px-8 py-24 overflow-hidden"
        >

            <div className="grid md:grid-cols-1 gap-6 items-center justify-star md:justify-center">
                <h2
                    ref={titleRef}
                    className="text-7xl md:text-9xl md:font-extrabold font-bold"
                >
                    WHAT I DO /
                </h2>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-start md:items-center mt-6 md:mt-2">
                <div
                    ref={serviceRef}
                    className="text-neutral-200 text-sm leading-relaxed text-left"
                >
                    <span className="block text-xl text-neutral-200 mb-1">(SERVICES)</span>
                </div>
                <div className="text-neutral-200 text-sm leading-relaxed md:ml-4">
                    <span className="block text-xl text-neutral-200 mb-1">I specialize in building full-stack web applications <br /> that are fast, reliable, and user-friendly. With a <br /> solid foundation in both frontend and backend<br /> technologies, I help bring ideas to life whether<br /> it's for a business, a startup, or a product team.</span>
                </div>
            </div>


            <div className="mt-24 space-y-200 mb-100">
                {skills.map((skill, idx) => (
                    <div
                        key={skill.id}
                        ref={(el) => (groupsRef.current[idx] = el)}
                        className="grid md:grid-cols-3 gap-6 border-t border-neutral-700 bg-[#121212] h-auto"
                    >
                        <div className="text-4xl md:text-6xl font-bold text-neutral-200 mt-6">({skill.id})</div>
                        <div className="md:col-span-2 space-y-4 mt-6 md:ml-50">
                            <h3 className="text-4xl md:text-6xl font-bold mb-4">
                                {skill.title}
                            </h3>
                            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed w-100">
                                {skill.desc}
                            </p>
                            <ul className="mt-4 space-y-2">
                                {skill.stack.map((tech, techIdx) => (
                                    <li key={techIdx} className="text-lg md:text-xl font-bold text-neutral-200 border-t border-neutral-700 pt-2">
                                        <span className="text-neutral-500 mr-2">
                                            {techIdx + 1}
                                        </span>
                                        {tech}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
