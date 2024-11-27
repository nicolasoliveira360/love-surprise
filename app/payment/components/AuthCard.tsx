"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserIcon, CheckCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function AuthCard() {
  const { user, loading } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    // Após fazer logout, redirecionar para login mantendo o returnUrl
    router.push('/auth/login?returnUrl=/payment');
  };

  if (loading) {
    return (
      <motion.div
        className="bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-neon-pink"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Carregando...</h3>
            <p className="text-gray-400 text-sm">
              Verificando autenticação
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (user) {
    return (
      <motion.div
        className="bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-neon-pink"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Autenticado</h3>
              <p className="text-gray-400 text-sm">
                Logado como {user.name || user.email}
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleSignOut}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 bg-navy-900 text-pink-500 rounded-full text-sm font-medium hover:bg-pink-500/10 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Trocar conta
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-navy-800 rounded-2xl p-6 sm:p-8 shadow-neon-pink"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Autenticação Necessária</h3>
          <p className="text-gray-400 text-sm">
            Para finalizar sua surpresa, faça login ou crie uma conta
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/auth/login?returnUrl=/payment"
          className="flex-1"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink"
          >
            Fazer Login
          </motion.button>
        </Link>

        <Link 
          href="/auth/register?returnUrl=/payment"
          className="flex-1"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-navy-900 text-white rounded-full font-semibold border border-pink-500/30 hover:border-pink-500 transition-all"
          >
            Criar Conta
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
} 