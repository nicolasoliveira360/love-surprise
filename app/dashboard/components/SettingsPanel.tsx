"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { XMarkIcon, KeyIcon, UserIcon, AtSymbolIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Carregar dados do usuário quando o painel abrir
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Atualizar nome
      if (formData.name !== user?.name) {
        const { error } = await supabase
          .from('users')
          .update({ name: formData.name })
          .eq('id', user?.id);
          
        if (error) throw error;
        toast.success('Nome atualizado com sucesso!');
      }

      // Atualizar email
      if (formData.email !== user?.email) {
        const { error } = await supabase.auth.updateUser({
          email: formData.email
        });
        if (error) throw error;
        toast.success('Email atualizado! Verifique sua caixa de entrada.');
      }

      // Atualizar senha
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('As senhas não coincidem');
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: formData.newPassword
        });

        if (error) throw error;
        toast.success('Senha atualizada com sucesso!');
        
        // Limpar campos de senha
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
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
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium">
                    Configurações
                  </Dialog.Title>
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 rounded-full hover:bg-navy-700 transition-colors"
                      >
                        <PencilIcon className="w-5 h-5 text-pink-500" />
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-navy-700 transition-colors"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Campos de senha - só aparecem no modo edição */}
                  {isEditing && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Nova Senha
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            value={formData.newPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Digite a nova senha"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Confirmar Nova Senha
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="block w-full pl-10 pr-3 py-2 bg-navy-900 border border-gray-700 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Confirme a nova senha"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Botões */}
                  {isEditing && (
                    <div className="flex gap-4">
                      <motion.button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Restaurar dados originais
                          if (user) {
                            setFormData(prev => ({
                              ...prev,
                              name: user.name || '',
                              email: user.email || '',
                              newPassword: '',
                              confirmPassword: ''
                            }));
                          }
                        }}
                        className="flex-1 py-3 bg-navy-900 text-white rounded-full font-semibold border border-gray-700 hover:border-pink-500 transition-all"
                      >
                        Cancelar
                      </motion.button>
                      
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-neon-pink disabled:opacity-50"
                      >
                        {loading ? 'Salvando...' : 'Salvar'}
                      </motion.button>
                    </div>
                  )}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}