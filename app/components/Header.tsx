'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-blue-600 hover:underline cursor-pointer">
            MyAppLogo
          </span>
        </Link>

        <button className="md:hidden text-gray-700 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg
            className="w-6 y-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>

        {/* PC */}
        <nav className="hidden md:flex items-center space-x-4 md:space-x-6">
          <Link href="/">
            <span className="cursor-pointer px-3 py-1 hover:text-blue-600">
              Menu1
            </span>
          </Link>
          <Link href="/">
            <span className="cursor-pointer px-3 py-1 hover:text-blue-600">
              Menu2
            </span>
          </Link>
          <Link href="/">
            <span className="cursor-pointer px-3 py-1 hover:text-blue-600">
              Menu3
            </span>
          </Link>
        </nav>
      </div>

      {/* Smartphone */}
      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-300 text-gray-700 font-medium">
          <Link href="/">
            <span className="block py-2 hover:text-blue-600 cursor-pointer">
              Menu1
            </span>
          </Link>
          <Link href="/">
            <span className="block py-2 hover:text-blue-600 cursor-pointer">
              Menu2
            </span>
          </Link>
          <Link href="/">
            <span className="block py-2 hover:text-blue-600 cursor-pointer">
              Menu3
            </span>
          </Link>
        </nav>
      )}
    </header>
  )
}