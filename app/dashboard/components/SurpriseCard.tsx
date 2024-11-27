"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  CalendarIcon, 
  ClockIcon, 
  EyeIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  HeartIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeDropperIcon,
  ShareIcon,
  EllipsisVerticalIcon,
  CreditCardIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { Fragment, useState } from 'react';

type SurpriseCardProps = {
  surprise: {
    id: string;
    couple_name: string;
    start_date: string;
    status: 'draft' | 'active' | 'pending_payment' | 'expired';
    plan: 'basic' | 'premium';
    created_at: string;
    views?: number;
    surprise_photos: { photo_url: string }[];
  };
  onShare: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function SurpriseCard({ surprise, onShare, onDelete }: SurpriseCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
      case 'pending_payment':
        return {
          icon: ExclamationCircleIcon,
          text: 'Aguardando Pagamento',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10'
        };
      case 'active':
        return {
          icon: CheckCircleIcon,
          text: 'Ativo',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10'
        };
      case 'expired':
        return {
          icon: ExclamationCircleIcon,
          text: 'Expirado',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10'
        };
      default:
        return {
          icon: ExclamationCircleIcon,
          text: 'Status Desconhecido',
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10'
        };
    }
  };

  const statusInfo = getStatusInfo(surprise.status);
  const StatusIcon = statusInfo.icon;

  const handlePreview = () => {
    router.push(`/s/${surprise.id}/preview`);
  };

  const handlePayment = () => {
    router.push(`/payment?surpriseId=${surprise.id}`);
  };

  const handleEdit = () => {
    router.push(`/edit/${surprise.id}`);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (surprise.status === 'active' && deleteConfirmText !== surprise.couple_name) {
      return;
    }
    onDelete(surprise.id);
    setIsDeleteModalOpen(false);
    setDeleteConfirmText('');
  };

  const MenuItem = ({ children, onClick, className, danger = false }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    danger?: boolean;
  }) => (
    <Menu.Item>
      {({ active }: { active: boolean }) => (
        <button
          onClick={onClick}
          className={`${
            active ? 'bg-white/5' : ''
          } flex items-center gap-2 w-full px-4 py-2 text-sm ${
            danger ? 'text-red-500 hover:text-red-400' : 'text-gray-300 hover:text-white'
          } transition-colors ${className}`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-navy-800 rounded-xl overflow-hidden border border-gray-700 hover:border-pink-500/50 transition-all group relative"
      >
        {/* Menu de Opções */}
        <Menu as="div" className="absolute top-3 right-3 z-20">
          <Menu.Button className="p-1 rounded-lg bg-black/50 hover:bg-black/70 transition-colors">
            <EllipsisVerticalIcon className="w-5 h-5 text-white" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-navy-900 rounded-lg shadow-lg py-1 border border-gray-700 z-10">
              {surprise.status !== 'active' && (
                <MenuItem onClick={handleEdit}>
                  <PencilSquareIcon className="w-4 h-4" />
                  Editar
                </MenuItem>
              )}

              {surprise.status === 'active' && (
                <MenuItem onClick={() => onShare(surprise.id)}>
                  <ShareIcon className="w-4 h-4" />
                  Compartilhar
                </MenuItem>
              )}

              <MenuItem onClick={handleDeleteClick} danger>
                <TrashIcon className="w-4 h-4" />
                Excluir
              </MenuItem>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Preview Image */}
        <div className="relative h-48">
          {surprise.surprise_photos?.[0] ? (
            <Image
              src={surprise.surprise_photos[0].photo_url}
              alt={surprise.couple_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-navy-900 flex items-center justify-center">
              <HeartIcon className="w-12 h-12 text-pink-500/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-800 to-transparent" />
          
          {/* Plan Badge */}
          {surprise.plan === 'premium' && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <SparklesIcon className="w-3 h-3" />
              Premium
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Nome e Status */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">{surprise.couple_name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.bgColor} ${statusInfo.color}`}>
              <StatusIcon className="w-3 h-3" />
              {statusInfo.text}
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-3 mb-4">
            {surprise.views !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <EyeIcon className="w-4 h-4" />
                  <span>Visualizações</span>
                </div>
                <span className="text-white">{surprise.views}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <ClockIcon className="w-4 h-4" />
                <span>Criado</span>
              </div>
              <span className="text-white">
                {formatDistanceToNow(new Date(surprise.created_at), { 
                  locale: ptBR,
                  addSuffix: true 
                })}
              </span>
            </div>
          </div>

          {/* Botão de Ação */}
          {['draft', 'pending_payment'].includes(surprise.status) ? (
            <button
              onClick={handlePayment}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2"
            >
              <CreditCardIcon className="w-4 h-4" />
              Finalizar Pagamento
            </button>
          ) : surprise.status === 'active' ? (
            <button
              onClick={() => onShare(surprise.id)}
              className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2"
            >
              <ShareIcon className="w-4 h-4" />
              Compartilhar
            </button>
          ) : null}
        </div>
      </motion.div>

      {/* Modal de Confirmação de Exclusão */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-navy-800 p-6 shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <Dialog.Title className="text-lg font-medium mb-1">
                        Excluir Surpresa
                      </Dialog.Title>
                      <p className="text-sm text-gray-400">
                        {surprise.status === 'active' 
                          ? 'Esta surpresa está ativa e já foi paga. Esta ação não pode ser desfeita.'
                          : 'Tem certeza que deseja excluir esta surpresa?'}
                      </p>
                    </div>
                  </div>

                  {surprise.status === 'active' && (
                    <div className="mb-6">
                      <label className="block text-sm text-gray-400 mb-2">
                        Digite &ldquo;{surprise.couple_name}&rdquo; para confirmar a exclusão:
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        className="w-full px-4 py-2 bg-navy-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                        placeholder={surprise.couple_name}
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 px-4 py-2 bg-navy-900 text-white rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={surprise.status === 'active' && deleteConfirmText !== surprise.couple_name}
                      className={`flex-1 px-4 py-2 bg-red-500 text-white rounded-lg transition-all ${
                        surprise.status === 'active' && deleteConfirmText !== surprise.couple_name
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-red-600'
                      }`}
                    >
                      Excluir
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}