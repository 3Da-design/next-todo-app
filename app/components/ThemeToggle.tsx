'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label="Theme switching"
    >
      {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}