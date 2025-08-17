'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/**
 * We set a CSS variable --header-h so the rest of the page
 * can size itself exactly to the remaining viewport height.
 * Adjust the height classes (h-16 md:h-20) to your taste.
 */
export default function Header() {
  // If you need JS to keep the var in sync on resize (usually not needed),
  // you can measure here. For now we just mirror the Tailwind heights.
  useEffect(() => {
    const setVar = () => {
      const h = window.innerWidth >= 768 ? 80 : 64; // md:h-20 vs h-16
      document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    setVar();
    window.addEventListener('resize', setVar);
    return () => window.removeEventListener('resize', setVar);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 md:h-20 border-b border-neutral-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-full flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">MyBrand</Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#features" className="link hover:opacity-80">Design Process</a>
          <a href="#pricing" className="link hover:opacity-80">Materials</a>
          <a href="#faq" className="link hover:opacity-80">Manufacturing Processes</a>
          <a href="#faq" className="link hover:opacity-80">Projects</a>
        </nav>

        <a
          href="#cta"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}
