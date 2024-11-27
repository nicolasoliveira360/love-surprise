"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();

  const getMenuItems = () => {
    if (user) {
      return [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/create', label: 'Criar Surpresa' }
      ];
    }
    return [
      { href: '/create', label: 'Criar Surpresa' },
      { href: '/auth/login', label: 'Login' },
      { href: '/auth/register', label: 'Cadastrar' }
    ];
  };

  const menuItems = getMenuItems();

  return (
    <header className="fixed top-0 left-0 right-0 bg-navy-900/80 backdrop-blur-sm z-40 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              LoveSurprise
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-300 hover:text-white transition-colors ${
                  item.href === '/create' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-neon-pink' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 md:hidden text-gray-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-900 border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-gray-300 hover:text-white transition-colors py-2 ${
                      item.href === '/create' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-neon-pink text-center' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}