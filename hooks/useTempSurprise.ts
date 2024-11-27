import { useEffect, useState } from 'react';
import { useSurpriseStore, TempSurpriseData } from '@/store/useSurpriseStore';
import { fileStorage } from '@/services/fileStorage';

export function useTempSurprise() {
  const { tempData, setTempData, clearTempData } = useSurpriseStore();
  const [isInitialized, setIsInitialized] = useState(false);

  const saveTempSurprise = async (data: Omit<TempSurpriseData, 'photos'> & { photos: File[] }) => {
    try {
      // Se não houver fotos, salvar diretamente
      if (!data.photos.length) {
        setTempData({
          ...data,
          photos: []
        });
        return;
      }

      // Salvar arquivos no IndexedDB
      const fileIds = await Promise.all(
        data.photos.map(async (file) => {
          const id = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          await fileStorage.saveFile(id, file);
          return id;
        })
      );

      // Salvar dados no store
      setTempData({
        ...data,
        photos: fileIds
      });

      console.log('Dados temporários salvos com', fileIds.length, 'arquivos');
    } catch (err) {
      console.error('Erro ao salvar dados temporários:', err);
      throw err; // Propagar erro para tratamento no componente
    }
  };

  const clearTempSurprise = async () => {
    try {
      // Limpar URLs de preview
      if (tempData?.previewUrls) {
        tempData.previewUrls.forEach(url => {
          try {
            URL.revokeObjectURL(url);
          } catch (err) {
            console.warn('Erro ao revogar URL:', err);
          }
        });
      }

      // Limpar arquivos do IndexedDB
      await fileStorage.clearAll();

      // Limpar store
      clearTempData();
    } catch (err) {
      console.error('Erro ao limpar dados temporários:', err);
    }
  };

  // Restaurar arquivos ao inicializar
  useEffect(() => {
    const restoreFiles = async () => {
      if (tempData?.photos && !isInitialized) {
        try {
          const files = await Promise.all(
            tempData.photos.map(id => fileStorage.getFile(id))
          );

          const validFiles = files.filter(Boolean) as File[];
          const previewUrls = validFiles.map(file => URL.createObjectURL(file));

          setTempData({
            ...tempData,
            previewUrls
          });
        } catch (err) {
          console.error('Erro ao restaurar arquivos:', err);
        } finally {
          setIsInitialized(true);
        }
      }
    };

    restoreFiles();
  }, [tempData, isInitialized]);

  return {
    tempSurprise: tempData ? {
      ...tempData,
      photos: [] // Os arquivos são carregados sob demanda
    } : null,
    saveTempSurprise,
    clearTempSurprise,
    isInitialized
  };
} 