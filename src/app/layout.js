import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nanang Marvin - Web Developer',
  description: 'Portfolio of Nanang Marvin, a Web Developer focused on building innovative digital products.',
  keywords: 'web developer, web designer, frontend, backend, UI/UX, Next.js, React, Node.js, Tailwind CSS',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}