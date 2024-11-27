"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  PlusIcon, 
  QrCodeIcon, 
  ShareIcon, 
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';
import ShareModal from './components/ShareModal';
import SurpriseCard from './components/SurpriseCard';
import DashboardHeader from './components/DashboardHeader';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { useSurprise } from '@/hooks/useSurprise';

type Surprise = Tables['surprises']['Row'] & {
  surprise_photos: Tables['surprise_photos']['Row'][];
};

export default function Dashboard() {
  const [surprises, setSurprises] = useState<Surprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSurpriseId, setSelectedSurpriseId] = useState<string | null>(null);
  const { user } = useUser();
  const { deleteSurprise } = useSurprise();

  useEffect(() => {
    const fetchSurprises = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('surprises')
          .select(`
            *,
            surprise_photos (
              photo_url
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setSurprises(data || []);
      } catch (err) {
        console.error('Erro ao buscar surpresas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurprises();
  }, [user]);

  const handleShare = (surpriseId: string) => {
    setSelectedSurpriseId(surpriseId);
    setShareModalOpen(true);
  };

  const handleDelete = async (surpriseId: string) => {
    const success = await deleteSurprise(surpriseId);
    if (success) {
      setSurprises(prev => prev.filter(s => s.id !== surpriseId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando suas surpresas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardHeader />
      
      <div className="min-h-screen bg-navy-900 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header com botão de criar */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-white">Minhas Surpresas</h1>
              <Link href="/create">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all shadow-neon-pink"
                >
                  <PlusIcon className="w-5 h-5" />
                  Nova Surpresa
                </motion.button>
              </Link>
            </div>

            {surprises.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">Você ainda não criou nenhuma surpresa</p>
                <Link href="/create">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold"
                  >
                    Criar Primeira Surpresa
                  </motion.button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {surprises.map((surprise) => (
                  <SurpriseCard
                    key={surprise.id}
                    surprise={surprise}
                    onShare={handleShare}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        surpriseId={selectedSurpriseId}
      />
    </>
  );
}