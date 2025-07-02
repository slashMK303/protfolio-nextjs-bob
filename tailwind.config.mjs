/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/app/**/*.{js,jsx}", // Perhatikan path src/app
        "./src/components/**/*.{js,jsx}", // Perhatikan path src/components
    ],
    theme: {
        extend: {
            colors: {
                primary: '#6B46C1', // Biru keunguan / Ungu muda untuk highlight
                dark: '#2D3748', // Abu-abu tua / Hitam untuk teks
                background: '#FFFFFF', // Putih untuk background
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Menggunakan Inter sebagai font utama
            },
            minHeight: {
                'screen-minus-nav': 'calc(100vh - 80px)',
            }
        },
    },
    plugins: [],
};

export default config;