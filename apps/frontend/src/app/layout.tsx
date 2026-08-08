import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SkillConnect.pk — Pakistan Local Services Marketplace',
  description:
    'Find verified electricians, plumbers, AC repair, tutors, and more across Karachi, Lahore, Islamabad, and all of Pakistan.',
  keywords: ['Pakistan services', 'local services', 'electricians', 'plumbers', 'book services'],
  openGraph: {
    title: 'SkillConnect.pk',
    description: 'Trusted local service marketplace for homes and businesses in Pakistan.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen antialiased`}>
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
