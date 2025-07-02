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

    const projects = [
        {
            id: 'proj-01',
            number: '01',
            title: 'Indo Dragonica Private Server Website',
            description:
                'IndoDragonica is an Indonesian community site for Dragonica Online, offering game guides, videos, and updates for local players.',
            thumbnail: '/img/project/idgn.png',
            demoLink: 'https://www.indodragonica.com/',
            viewText: 'VIEW PROJECT',
        },
        {
            id: 'proj-02',
            number: '02',
            title: 'Portfolio Website v1',
            description:
                'A portfolio website for Nanang Marvin, showcasing his skills and projects.',
            thumbnail: '/img/project/personalweb.jpg',
            demoLink: 'https://nanangmarvin-8ko8wl5tz-vinnns-projects.vercel.app/',
            viewText: 'VIEW PROJECT',
        },
        {
            id: 'proj-03',
            number: '03',
            title: 'QR Code Generator',
            description:
                'A QR code generator for generating and downloading QR codes for various purposes.',
            thumbnail: '/img/project/qrgenerator.jpg',
            demoLink: 'https://slashmk303.github.io/qr-code-generate-simple/',
            viewText: 'VIEW PROJECT',
        },
        {
            id: 'proj-04',
            number: '04',
            title: 'Genocide Egg(Game)',
            description:
                'a game project I made while studying in college.',
            thumbnail: '/img/project/genocideegg.png',
            demoLink: 'https://marvin195.itch.io/genocide-egg',
            viewText: 'VIEW PROJECT',
        },
    ];

    useEffect(() => {
        if (!sectionRef.current || !contentWrapperRef.current) return;

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
            y: `-${totalScroll}`,
            ease: 'none',
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full bg-[#121212] text-white h-screen md:h-full overflow-hidden">
            <div className="h-screen w-full flex flex-col md:flex-row">

                <div className="w-full md:w-[40%] px-6 md:px-8 py-10 md:py-20 flex flex-col justify-start">
                    <h2 className="text-4xl md:text-7xl font-extrabold mb-8 md:mb-12 leading-tight">SELECTED WORKS /</h2>
                    <p className="text-gray-400 mb-10 md:mb-16 text-base md:text-lg max-w-xl">
                        Crafted digital experiences that blend utility and aesthetics into something functional, memorable, and refined.
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
                            <div key={p.id} className="w-full h-screen flex items-center justify-center px-8 md:px-12">
                                <div className="w-full flex flex-col md:flex-row items-center justify-end gap-8">

                                    <div className="w-full h-[40vh] md:h-[85vh] bg-gray-700 relative overflow-hidden rounded-xl shadow-lg">
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


                                    <div className="w-full md:w-2/5 text-center md:text-left">
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
