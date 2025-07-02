'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [localTimeZone, setLocalTimeZone] = useState('');

    useEffect(() => {
        setLocalTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Pesan Anda telah terkirim! (Ini hanya simulasi, tidak ada backend)');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <section className='bg-[#e8e8e8]'>
            <div className="h-full text-center p-10 mx-8 rounded-2xl bg-gradient-to-b from-[#121212] to-[#414141]">
                <h2 className="text-4xl lg:text-9xl font-extrabold text-[#e8e8e8] mb-16 uppercase text-center">let's make<br /> it happen</h2>
                <form onSubmit={handleSubmit} className="bg-[#121212] max-w-xl p-8 rounded-xl shadow-lg border border-[#4d4d4d] stagger-item mx-auto">
                    <h3 className='text-4xl font-semibold mb-6 text-[#e8e8e8]'>Say Hello</h3>
                    <div className="mb-12 text-left">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder='Your Name'
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-[#e8e8e8] border border-[#4d4d4d] rounded-lg focus:ring-2 focus:ring-[#4d4d4d] focus:border-transparent outline-none transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-12 text-left">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder='Your Email'
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-[#e8e8e8] border border-[#4d4d4d] rounded-lg focus:ring-2 focus:ring-[#4d4d4d] focus:border-transparent outline-none transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="mb-12 text-left">
                        <textarea
                            id="message"
                            name="message"
                            placeholder='Your Message'
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            className="w-full px-4 py-3 text-[#e8e8e8] border border-[#4d4d4d] rounded-lg focus:ring-2 focus:ring-[#4d4d4d] focus:border-transparent outline-none resize-y transition-all duration-300"
                            required
                        ></textarea>
                    </div>
                    <motion.button
                        type="submit"
                        className="bg-[#e8e8e8] text-[#121212] px-8 py-4 rounded-xl text-lg font-semibold hover:cursor-pointer transition-all duration-300 w-full md:w-auto"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Send Message
                    </motion.button>
                </form>
            </div>
        </section>
    );
}
