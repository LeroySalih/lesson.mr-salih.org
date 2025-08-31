import './globals.css';
import type { Metadata } from 'next';
import Header from './header';
import {pool, testConnection} from "@/app/lib/db";
import { getCollections } from '@/actions/collections/get-collections';
import { getUnpackedSettings } from 'http2';
import { getUnitsForCourse } from '@/actions/units/get-units-for-course';
import { getCourses } from '@/actions/courses/getCourses';

export const metadata: Metadata = {
  title: 'Landing – MyBrand',
  description: 'A lovely Next.js + Tailwind landing page.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  //const collections = getCollections();
  const courseId = '50d1946e-f7d8-45ff-b076-98ad565060ba' // Yr1- Design and Technology;
  const {data:units, error: unitsError} = await getUnitsForCourse(courseId);
  const {data:courses, error: coursesError} = await getCourses();

  if (unitsError || coursesError){
    return <div>Error!{unitsError} {coursesError}</div>
  }
  
  //testConnection();
  return (
    <html lang="en">
      {/* Fallback header height variables (synced by Header on mount) */}
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <style>{`
        :root { --header-h: 64px; }
        @media (min-width: 768px) { :root { --header-h: 80px; } }
      `}</style>
      </head>
      <body className="antialiased text-neutral-800
        bg-graph-paper
      
      ">
        {courses && units && <Header courses={courses} units={units}/>}
        <main className="pt-[var(--header-h)] bg-graph-paper">
        {children}
        </main>
      </body>
    </html>
  );
}
