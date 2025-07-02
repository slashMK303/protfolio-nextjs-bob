'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoveredIndexMobile, setHoveredIndexMobile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showHamburgerOnDesktop, setShowHamburgerOnDesktop] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentY = window.scrollY;
            setIsScrolled(currentY > 50);
            setShowNavbar(currentY < lastScrollY);
            lastScrollY = currentY;
        };

        window.addEventListener('scroll', handleScroll);

        ScrollTrigger.create({
            trigger: "#whatido",
            start: "top 5%",
            onEnter: () => {
                setShowHamburgerOnDesktop(true);
                gsap.fromTo(
                    '.hamburger-btn',
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.5, ease: 'bounce.out' }
                );
            },
            onLeaveBack: () => setShowHamburgerOnDesktop(false),
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#whatido' },
        { name: 'Works', href: '#works' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    const scrollToId = (id) => {
        const el = document.querySelector(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>

            {showHamburgerOnDesktop && (
                <motion.button
                    className="hamburger-btn fixed top-4 right-6 z-50 bg-[#e8e8e3] px-3 py-4 rounded-full flex flex-col items-center justify-center gap-1 hover:cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.span
                        animate={isOpen ? { rotate: 50, y: 5 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-black origin-center block"
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-6 h-0.5 bg-black block"
                        transition={{ duration: 0.3 }}
                    />
                    <motion.span
                        animate={isOpen ? { rotate: -50, y: -5 } : { rotate: 0, y: 0 }}
                        className="w-6 h-0.5 bg-black origin-center block"
                        transition={{ duration: 0.3 }}
                    />
                </motion.button>
            )}

            <motion.nav
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-dark py-4' : 'bg-transparent py-6'}`}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: showNavbar ? 0 : -100, opacity: showNavbar ? 1 : 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="w-full flex justify-between items-center px-8">
                    <span
                        onClick={() => scrollToId('#home')}
                        className={`text-xl font-bold text-gray-700 transition-opacity duration-300 cursor-pointer ${showHamburgerOnDesktop ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                        Web Developer
                    </span>

                    <div className={`hidden ${showHamburgerOnDesktop ? '' : 'lg:flex'} space-x-8`}>
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                className="relative group text-base font-medium text-gray-700 cursor-pointer"
                                onClick={() => scrollToId(link.href)}
                            >
                                <span className="relative block overflow-hidden h-[1.2em]">
                                    <motion.span
                                        animate={{ y: hoveredIndex === index ? "-100%" : "0%" }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="block"
                                    >
                                        {link.name}
                                    </motion.span>
                                    <motion.span
                                        animate={{ y: hoveredIndex === index ? "0%" : "100%" }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="block absolute top-0 left-0 w-full"
                                    >
                                        {link.name}
                                    </motion.span>
                                </span>
                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.nav>


            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center space-y-8 z-30"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                onHoverStart={() => setHoveredIndexMobile(index)}
                                onHoverEnd={() => setHoveredIndexMobile(null)}
                                onClick={() => {
                                    scrollToId(link.href);
                                    setIsOpen(false);
                                }}
                                className="relative text-3xl font-extrabold text-gray-200 cursor-pointer"
                            >
                                <span className="relative block overflow-hidden h-[1.2em]">
                                    <motion.span
                                        animate={{ y: hoveredIndexMobile === index ? "-100%" : "0%" }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="block"
                                    >
                                        {link.name}
                                    </motion.span>
                                    <motion.span
                                        animate={{ y: hoveredIndexMobile === index ? "0%" : "100%" }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="block absolute top-0 left-0 w-full"
                                    >
                                        {link.name}
                                    </motion.span>
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
