"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BellIcon, UserCircleIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import SettingsPanel from './SettingsPanel';

export default function DashboardHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, loading } = useUser();
  const { signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-navy-900/80 backdrop-blur-sm z-40 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              LoveSurprise
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button 
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsNotificationsOpen(true)}
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <UserCircleIcon className="w-8 h-8" />
                <span className="text-sm font-medium">
                  {loading ? 'Carregando...' : user?.name || 'Usuário'}
                </span>
              </button>

              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-navy-900 rounded-lg shadow-lg py-1 border border-gray-700"
                >
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Logado como</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Cog6ToothIcon className="w-4 h-4" />
                      Configurações
                    </div>
                  </button>

                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
                  >
                    Sair
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </header>
  );
}