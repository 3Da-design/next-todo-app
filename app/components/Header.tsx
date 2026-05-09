'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="bg-white dark:bg-black shadow-md">
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
        <nav className="hidden md:flex items-center space-x-4 md:space-x-6 text-gray-700 dark:text-white">
          {status === 'loading' ? (
            <span className="ml-4">Loading...</span>
          ) : session ? (
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: '/'});
              }}
              className="hover: underline cursor-pointer"
            >
                Logout
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="hover: underline cursor-pointer"
              >
                  Register
              </Link>
              <Link
                href="/auth/signin"
                className="hover: underline cursor-pointer"
              >
                  Sign In
              </Link>
            </>
          )}
          <Link
            href="/contact"
            className="hover: underline cursor-pointer"
          >
              Contact
          </Link>
          <ThemeToggle />
        </nav>
      </div>

      {/* Smartphone */}
      {menuOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-2 border-t border-gray-300 text-gray-700 dark:text-white font-medium">
          {status === 'loading' ? (
            <span className="ml-4">Loading...</span>
          ) : session ? (
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: '/'});
              }}
              className="block py-2 hover: underline cursor-pointer"
            >
                Logout
            </Link>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="block py-2 hover: underline cursor-pointer"
              >
                  Register
              </Link>
              <Link
                href="/auth/signin"
                className="block py-2 hover: underline cursor-pointer"
              >
                  Sign In
              </Link>
            </>
          )}
          <Link
            href="/contact"
            className="hover: underline cursor-pointer"
          >
              Contact
          </Link>
          <ThemeToggle />
        </nav>
      )}
    </header>
  )
}