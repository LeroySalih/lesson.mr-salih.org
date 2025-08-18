import './globals.css';
import type { Metadata } from 'next';
import Header from './header';
import {pool, testConnection} from "@/app/lib/db";
import { getCollections } from '@/actions/collections/get-collections';
import { getUnpackedSettings } from 'http2';
import { getUnitsForCourse } from '@/actions/units/get-units-for-course';

export const metadata: Metadata = {
  title: 'Landing – MyBrand',
  description: 'A lovely Next.js + Tailwind landing page.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  //const collections = getCollections();
  const courseId = '50d1946e-f7d8-45ff-b076-98ad565060ba' // Yr1- Design and Technology;
  const {data:units, error} = await getUnitsForCourse(courseId);

  console.log(units)


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
        <Header units={units}/>
        <main className="pt-[var(--header-h)] bg-graph-paper">
        {children}
        </main>
      </body>
    </html>
  );
}
