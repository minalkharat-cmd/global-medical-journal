import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Medical Vanguard Journal', template: '%s | Medical Vanguard Journal' },
  description: 'Medical Vanguard is a peer-reviewed, open access journal publishing original research across all medical specialties.',
  keywords: 'medical journal, open access, peer review, medical research',
  authors: [{ name: 'Medical Vanguard Editorial Team' }],
  metadataBase: new URL('https://medical-vanguard.vercel.app'),
  openGraph: {
    siteName: 'Medical Vanguard Journal',
    type: 'website',
    locale: 'en_US',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
