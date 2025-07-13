import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nanang Marvin Kurniawan',
  description: 'Portfolio of Nanang Marvin Kurniawan, a Web Developer focused on building innovative digital products.',
  keywords: 'web developer, web designer, frontend, backend, UI/UX, Next.js, React, Node.js, Tailwind CSS, full stack, Nanang Marvin Kurniawan, Nanang, Nanang Marvin',

  openGraph: {
    title: 'Nanang Marvin Kurniawan',
    description: 'Explore the portfolio of Nanang Marvin Kurniawan, a creative Web Developer with expertise in full-stack development.',
    url: 'https://nanangmarvin.my.id',
    siteName: 'Nanang Marvin Kurniawan',
    images: [
      {
        url: 'https://nanangmarvin.my.id/img/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Nanang Marvin Kurniawan',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Nanang Marvin Kurniawan',
    description: 'Portfolio of Nanang Marvin Kurniawan, Web Developer focused on building impactful digital experiences.',
    images: ['https://nanangmarvin.my.id/img/hero.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={metadata.keywords} />
      <meta property="og:title" content={metadata.openGraph.title} />
      <meta property="og:description" content={metadata.openGraph.description} />
      <meta property="og:url" content={metadata.openGraph.url} />
      <meta property="og:site_name" content={metadata.openGraph.siteName} />
      <meta property="og:type" content={metadata.openGraph.type} />
      <meta property="og:image" content={metadata.openGraph.images[0].url} />
      <meta property="og:image:width" content={metadata.openGraph.images[0].width} />
      <meta property="og:image:height" content={metadata.openGraph.images[0].height} />
      <meta name="twitter:card" content={metadata.twitter.card} />
      <meta name="twitter:title" content={metadata.twitter.title} />
      <meta name="twitter:description" content={metadata.twitter.description} />
      <meta name="twitter:image" content={metadata.twitter.images[0]} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}