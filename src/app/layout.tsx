import './globals.css';
import type { Metadata } from 'next';
import Header from './header';
import {pool, testConnection} from "@/app/lib/db";

export const metadata: Metadata = {
  title: 'Landing – MyBrand',
  description: 'A lovely Next.js + Tailwind landing page.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  //testConnection();
  return (
    <html lang="en">
      {/* Fallback header height variables (synced by Header on mount) */}
      <head>
        <style>{`
        :root { --header-h: 64px; }
        @media (min-width: 768px) { :root { --header-h: 80px; } }
      `}</style>
      </head>
      <body className="antialiased text-neutral-800
        bg-graph-paper
      
      ">
        <Header />
        <main className="pt-[var(--header-h)] bg-graph-paper">
        {children}
        </main>
      </body>
    </html>
  );
}
