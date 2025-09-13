'use client';

import Image from 'next/image';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
    const sectionRef = useRef(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        const handleLoad = () => {
            if (sectionRef.current && !hasInitialized.current) {
                hasInitialized.current = true;
                const ctx = gsap.context(() => {
                    gsap.to(sectionRef.current, {
                        scale: 0.97,
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top", // Ubah start menjadi "top top"
                            end: "bottom top",
                            scrub: true,
                            refreshPriority: 0, // Beri prioritas lebih rendah
                        },
                        transformOrigin: "center top",
                        ease: "none",
                    });
                }, sectionRef);

                return () => ctx.revert();
            }
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => window.removeEventListener('load', handleLoad);

    }, []);

    const categories = [
        {
            title: 'Languages & Tools',
            skills: ['Python', 'SQL', 'C++', 'Java', 'TypeScript', 'JavaScript', 'Git', 'Postman', 'Docker', 'Firebase']
        },
        {
            title: 'Frameworks & Libraries',
            skills: ['React', 'Node.js', 'Express.js', 'Bootstrap', 'jQuery', 'TailwindCSS', 'Framer Motion', 'GSAP']
        },
        {
            title: 'Core CS Concepts',
            skills: ['DSA', 'DBMS', 'OOP', 'Operating Systems', 'System Design']
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="bg-[#121212] text-[#e8e8e8] w-full px-4 md:px-8 py-20 pb-50 space-y-20 rounded-b-4xl"
        >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="my-auto text-6xl lg:text-9xl font-bold leading-tight tracking-tight">
                    <div>WEB</div>
                    <div>DEVELOPER<span className="text-[#e8e8e8]">/</span></div>
                </div>

                <div className="flex flex-col gap-10">
                    <h2 className="md:text-6xl text-5xl font-semibold md:font-bold mb-4 md:text-left text-center">Skills</h2>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
                        {categories.map((category, categoryIndex) => (
                            <motion.div
                                key={category.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                            >
                                <h3 className="text-2xl font-bold mb-4 hidden md:block">{category.title}</h3>
                                <ul className="space-y-2 text-md">
                                    {category.skills.map((skill, skillIndex) => (
                                        <motion.li
                                            key={skill}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: (categoryIndex * 0.1) + (skillIndex * 0.05),
                                            }}
                                            className="relative group overflow-hidden"
                                        >
                                            <span className="block transition-transform duration-[0.4s] ease-[cubic-bezier(.51,.92,.24,1.15)] translate-y-0 group-hover:-translate-y-full">
                                                <span className="font-mono cursor-default">{skill}</span>
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="absolute top-0 left-0 w-full block transition-transform duration-[0.4s] ease-[cubic-bezier(.51,.92,.24,1.15)] translate-y-full group-hover:translate-y-0"
                                            >
                                                <span className="font-mono cursor-default">{skill}</span>
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="flex flex-col lg:flex-row gap-4 lg:gap-100 items-start">
                <div className="w-full max-w-md rounded-md overflow-hidden mx-auto md:mx-auto lg:mx-0">
                    <Image
                        src="/img/about.png"
                        alt="About Image"
                        width={800}
                        height={600}
                        className="rounded-md"
                    />
                </div>

                <div className="flex flex-col justify-end items-center">
                    <p className="text-3xl font-semibold mb-18 md:w-195">
                        I'm a software engineer driven by a passion for turning ideas into clean, intuitive digital experiences.
                    </p>
                    <div className="flex space-x-4 mb-6 md:w-136 self-start">
                        <p className="uppercase text-lg tracking-widest">(about me)</p>
                        <div className="text-lg leading-relaxed space-y-4 self-start">
                            <p>
                                I am a passionate Software Engineer with a knack for building full-stack web applications using modern technologies like Next.js and Tailwind CSS. My journey in tech began with a curiosity for solving real-world problems through innovative solutions, which evolved into a love for crafting user-centric digital experiences.
                            </p>
                            <p>
                                Beyond coding, I thrive in collaborative environments and enjoy tackling challenging problems with creative solutions. I aim to contribute to impactful projects that make a difference in users' lives.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
