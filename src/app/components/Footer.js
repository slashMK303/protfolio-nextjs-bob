"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const [localTime, setLocalTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
                timeZoneName: "short",
            };
            const formattedTime = now.toLocaleTimeString("id-ID", options);
            setLocalTime(formattedTime);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    const scrollToId = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <footer className="bg-[#e8e8e8] text-black text-sm pt-20 pb-10 md:pt-50 px-6 w-full">
            <div className="mx-auto grid grid-cols-2 gap-8 pb-6">
                <div>
                    <h3 className="md:text-xl text-lg font-semibold mb-2 border-b border-gray-300 inline-block w-full">Menu</h3>
                    <ul className="mt-2 space-y-1">
                        <li><button onClick={() => scrollToId("home")} className="hover:underline hover:cursor-pointer">Home</button></li>
                        <li><button onClick={() => scrollToId("services")} className="hover:underline hover:cursor-pointer">Services</button></li>
                        <li><button onClick={() => scrollToId("works")} className="hover:underline hover:cursor-pointer">Works</button></li>
                        <li><button onClick={() => scrollToId("about")} className="hover:underline hover:cursor-pointer">About</button></li>
                        <li><button onClick={() => scrollToId("contact")} className="hover:underline hover:cursor-pointer">Contact</button></li>
                    </ul>
                </div>

                <div>
                    <h3 className="md:text-xl text-lg font-semibold mb-2 border-b border-gray-300 inline-block w-full">Socials</h3>
                    <ul className="mt-2 space-y-1">
                        <li><a href="https://www.linkedin.com/in/nanang-marvin-kurniawan-343a762a9/" target="_blank" className="hover:underline">Linkedin</a></li>
                        <li><a href="https://instagram.com" target="_blank" className="hover:underline">Instagram</a></li>
                        <li><a href="https://github.com/slashMK303" target="_blank" className="hover:underline">Github</a></li>
                    </ul>
                </div>
            </div>

            <div className="justify-end md:justify-center">
                <div className="mt-6 text-right md:text-center">
                    <p className="font-semibold">LOCAL TIME</p>
                    <p>{localTime}</p>
                </div>
            </div>
        </footer>
    );
}
