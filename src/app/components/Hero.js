'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-[#e8e8e3] text-gray-800 px-8 py-16">

            <div className="w-full flex items-center justify-center text-center mb-16 md:mb-24">
                <motion.svg
                    viewBox="0 0 1430 200"
                    className="w-screen h-auto"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    <text
                        x="50%"
                        y="70%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="fill-gray-800"
                        fontSize="clamp(10rem, 10vw, 10.5rem)"
                        fontFamily="sans-serif"
                        fontWeight="750"
                    >
                        NANANG MARVIN
                    </text>
                </motion.svg>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="md:col-span-1 text-center md:text-left"
                >
                    <p className="text-lg md:text-4xl text-gray-800 leading-relaxed">
                        Open to job opportunities worldwide.
                        Passionate about building polished,
                        intuitive, and thoughtful digital
                        experiences that leave a mark.
                    </p>
                    <Link href="#contact">
                        <motion.button
                            className="mt-8 bg-gray-800 text-lg text-[#e8e8e3] uppercase font-bold px-6 py-3 rounded-full shadow-md hover:shadow-xl hover:cursor-pointer transition"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Contact
                        </motion.button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                    className="flex justify-center items-center"
                >
                    <Image
                        src="/img/hero.jpg"
                        alt="Nanang Marvin Portrait"
                        width={300}
                        height={300}
                        className="rounded-lg object-cover"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
                    className="md:col-span-1 text-center md:text-right"
                >
                    <p className="text-lg md:text-2xl font-semibold text-primary mb-2">
                        Currently Available
                    </p>
                    <p className="text-lg md:text-xl text-gray-800">
                        For Freelance Projects & Collaborations
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
