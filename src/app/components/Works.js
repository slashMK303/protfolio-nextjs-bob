'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

export default function Works() {
    const sectionRef = useRef(null);
    const contentWrapperRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                if (!res.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await res.json();

                const formattedProjects = data.map((p, index) => ({
                    id: p.id,
                    number: (index + 1).toString().padStart(2, '0'),
                    title: p.title || '',
                    description: p.description || '',
                    thumbnail: p.thumbnail || '',
                    demoLink: p.demoLink || '#',
                    viewText: p.viewText || 'VIEW PROJECT',
                }));

                setProjects(formattedProjects);

                ScrollTrigger.refresh();

            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!sectionRef.current || !contentWrapperRef.current || projects.length < 2) return;

        const totalScroll = (projects.length - 1) * window.innerHeight;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: `+=${totalScroll}`,
                scrub: true,
                pin: true,
                snap: 1 / (projects.length - 1),
                onUpdate: (self) => {
                    setCurrentIndex(Math.round(self.progress * (projects.length - 1)));
                },
            },
        });

        tl.to(contentWrapperRef.current, {
            y: `-${totalScroll}px`,
            ease: 'none',
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, [projects]);

    if (loading) {
        return <div className="text-white text-center py-20">Loading...</div>;
    }

    if (projects.length === 0) {
        return <div className="text-white text-center py-20">No projects found.</div>;
    }

    return (
        <section ref={sectionRef} className="relative w-full bg-[#121212] text-white h-screen md:h-full overflow-hidden">
            <div className="h-screen w-full flex flex-col md:flex-row">

                <div className="w-full md:w-[40%] px-4 md:px-8 pt-5 h-40 lg:py-20 flex flex-col justify-start">
                    <h2 className="text-4xl md:text-6xl font-extrabold mb-8 md:mb-12 leading-tight">SELECTED WORKS /</h2>
                    <p className="text-gray-400 mb-10 md:mb-16 -mt-5 text-base md:text-lg max-w-xl">
                        Crafting digital experiences that seamlessly merge functionality and aesthetics, resulting in something both memorable and refined.
                    </p>
                    <div className="hidden md:block">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                className="text-[15vw] font-semibold text-gray-700 leading-none"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                {projects[currentIndex]?.number}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-full md:w-[60%] h-full overflow-hidden">
                    <div ref={contentWrapperRef}>
                        {projects.map((p) => (
                            <div key={p.id} className="w-full h-screen flex items-center justify-center px-4 md:px-8">
                                <div className="w-full flex flex-col lg:flex-row items-center justify-end gap-8">

                                    <div className="w-full h-[40vh] md:h-[50vh] lg:h-[85vh] bg-gray-700 relative overflow-hidden rounded-xl shadow-lg">
                                        <Image
                                            src={p.thumbnail}
                                            alt={p.title}
                                            fill
                                            className="object-cover object-center"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                        <Link href={p.demoLink} target="_blank" rel="noopener noreferrer">
                                            <motion.div
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <span className="text-white font-bold text-lg md:text-xl">VIEW</span>
                                            </motion.div>
                                        </Link>
                                    </div>


                                    <div className="w-full lg:w-2/5 text-center md:text-left">
                                        <p className="text-sm text-gray-400">Nanang Marvin</p>
                                        <h3 className="text-2xl md:text-4xl font-bold mb-3">{p.title}</h3>
                                        <p className="text-sm md:text-base text-gray-300 mb-6">{p.description}</p>
                                        <Link href={p.demoLink} target="_blank" rel="noopener noreferrer">
                                            <motion.button
                                                className="bg-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-600 hover:cursor-pointer text-sm md:text-base"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {p.viewText}
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );

}