import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { SurpriseError } from '@/types/errors';
import { useUser } from '@/hooks/useUser';
import { generateId } from '@/utils/generateId';

interface SurpriseData {
  coupleName: string;
  startDate: string;
  message: string;
  youtubeLink?: string;
  plan: 'basic' | 'premium';
  photos: File[];
  status: 'draft' | 'active' | 'expired';
}

interface PhotoUploadResult {
  surprise_id: string;
  photo_url: string;
  order_index: number;
}

interface SurprisePhoto {
  id: string;
  surprise_id: string;
  photo_url: string;
  order_index: number;
}

interface Surprise {
  id: string;
  user_id: string;
  couple_name: string;
  start_date: string;
  message: string;
  youtube_link?: string;
  plan: 'basic' | 'premium';
  status: 'draft' | 'active' | 'expired';
  created_at: string;
  surprise_photos?: SurprisePhoto[];
}

interface UpdateSurpriseData {
  couple_name: string;
  start_date: string;
  message?: string;
  youtube_link?: string;
  photos?: File[];
  deletedPhotoIds?: string[];
  plan?: 'basic' | 'premium';
}

export function useSurprise() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const uploadPhoto = async (photo: File, surpriseId: string, index: number) => {
    try {
      // Validações de segurança
      if (!photo || !(photo instanceof File)) {
        throw new SurpriseError(
          `Arquivo inválido no índice ${index}`,
          'INVALID_FILE',
          { index }
        );
      }

      // Revalidar tipo
      const mimeType = photo.type?.toLowerCase();
      if (!mimeType || !['image/jpeg', 'image/png'].includes(mimeType)) {
        throw new SurpriseError(
          `Tipo de arquivo não suportado: ${mimeType || 'desconhecido'}`,
          'INVALID_MIME_TYPE',
          { index, mimeType }
        );
      }

      // Revalidar tamanho
      if (photo.size > 5 * 1024 * 1024) {
        throw new SurpriseError(
          'Arquivo muito grande',
          'FILE_TOO_LARGE',
          { index, size: photo.size }
        );
      }

      // Criar cópia do arquivo para upload
      const secureFile = new File([photo], photo.name, {
        type: photo.type,
        lastModified: photo.lastModified
      });

      // Gerar nome seguro para o arquivo
      const extension = mimeType === 'image/jpeg' ? 'jpg' : 'png';
      const fileName = `${surpriseId}/${Date.now()}-${index}.${extension}`;

      console.log(`Iniciando upload da foto ${index + 1}:`, {
        fileName,
        type: mimeType,
        size: photo.size
      });

      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Upload com retry
      let attempts = 0;
      const maxAttempts = 3;
      let lastError = null;
      
      while (attempts < maxAttempts) {
        try {
          // Primeiro, verificar se o usuário tem acesso à surpresa
          const { data: surprise, error: surpriseError } = await supabase
            .from('surprises')
            .select('user_id')
            .eq('id', surpriseId)
            .single();

          if (surpriseError || surprise.user_id !== user.id) {
            throw new Error('Sem permissão para fazer upload');
          }

          // Tentar upload
          const { data, error: uploadError } = await supabase.storage
            .from('surprise_photos')
            .upload(fileName, secureFile, {
              cacheControl: '3600',
              upsert: attempts > 0
            });

          if (uploadError) {
            console.warn(`Tentativa ${attempts + 1} falhou:`, uploadError);
            lastError = uploadError;
            attempts++;
            
            if (attempts === maxAttempts) {
              throw new Error(`Upload falhou após ${maxAttempts} tentativas: ${uploadError.message}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            continue;
          }

          // Upload bem sucedido
          const { data: { publicUrl } } = supabase.storage
            .from('surprise_photos')
            .getPublicUrl(fileName);

          console.log(`Foto ${index + 1} enviada com sucesso:`, publicUrl);

          return {
            surprise_id: surpriseId,
            photo_url: publicUrl,
            order_index: index
          };
        } catch (err) {
          lastError = err;
          attempts++;
          
          if (attempts === maxAttempts) {
            throw err;
          }
        }
      }

      throw lastError;
    } catch (err) {
      console.error(`Erro no upload da foto ${index}:`, err);
      throw err;
    }
  };

  const createSurprise = async (data: SurpriseData) => {
    try {
      setLoading(true);
      setError(null);

      // Verificar autenticação
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('Usuário não autenticado');
      }

      console.log('Iniciando upload de', data.photos?.length || 0, 'fotos');

      // Usar generateId em vez de crypto.randomUUID
      const surpriseId = generateId();

      // Upload das fotos primeiro (se houver)
      const photoUrls: string[] = [];
      if (data.photos && data.photos.length > 0) {
        const uploadPromises = data.photos.map(async (file, index) => {
          const fileName = `${surpriseId}/${Date.now()}-${index}.jpg`;
          console.log('Iniciando upload da foto', index + 1, ':', {
            fileName,
            type: file.type,
            size: file.size
          });

          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('surprise_photos')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const photoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/surprise_photos/${fileName}`;
          console.log(`Foto ${index + 1} enviada com sucesso:`, photoUrl);
          return { url: photoUrl, index };
        });

        const results = await Promise.all(uploadPromises);
        photoUrls.push(...results.map(r => r.url));
      }

      // Criar a surpresa no banco
      const { data: surprise, error: createError } = await supabase
        .from('surprises')
        .insert({
          id: surpriseId,
          user_id: user.id, // Usar o ID verificado
          couple_name: data.coupleName,
          start_date: data.startDate,
          message: data.message,
          youtube_link: data.youtubeLink,
          plan: data.plan,
          status: data.status
        })
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar surpresa:', createError);
        throw createError;
      }

      // Se houver fotos, criar as referências
      if (photoUrls.length > 0) {
        const photoRefs = photoUrls.map((url, index) => ({
          surprise_id: surpriseId,
          photo_url: url,
          order_index: index
        }));

        const { error: photosError } = await supabase
          .from('surprise_photos')
          .insert(photoRefs);

        if (photosError) throw photosError;
      }

      console.log('Surpresa criada com sucesso:', {
        id: surpriseId,
        photosUploaded: photoUrls.length
      });

      return surprise;
    } catch (err) {
      console.error('Erro detalhado ao criar surpresa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar surpresa');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSurpriseWithPhotos = async (id: string, includeAll: boolean = false): Promise<Surprise | null> => {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        setLoading(true);
        setError(null);

        // Verificar conexão com Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('Sem sessão ativa com Supabase');
        }

        // Query base
        let query = supabase
          .from('surprises')
          .select(`
            *,
            surprise_photos (
              id,
              photo_url,
              order_index
            )
          `)
          .eq('id', id)
          .single();

        // Adicionar filtro de status apenas se não for includeAll
        if (!includeAll) {
          query = query.eq('status', 'active');
        }

        const { data: surprise, error: surpriseError } = await query;

        if (surpriseError) throw surpriseError;
        if (!surprise) throw new Error('Surpresa não encontrada');

        // Ordenar fotos pelo order_index
        if (surprise.surprise_photos) {
          surprise.surprise_photos.sort((a, b) => a.order_index - b.order_index);
        }

        return surprise;
      } catch (err) {
        attempts++;
        console.error(`Tentativa ${attempts} falhou:`, err);

        if (attempts === maxAttempts) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar surpresa');
          return null;
        }

        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      } finally {
        setLoading(false);
      }
    }

    return null;
  };

  const updateSurpriseStatus = async (id: string, status: 'draft' | 'active' | 'expired') => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se o usuário tem acesso à surpresa
      const { data: surprise, error: surpriseError } = await supabase
        .from('surprises')
        .select('user_id')
        .eq('id', id)
        .single();

      if (surpriseError) throw surpriseError;
      if (!surprise) throw new Error('Surpresa não encontrada');
      if (surprise.user_id !== user.id) throw new Error('Sem permissão para atualizar esta surpresa');

      // Atualizar status
      const { error: updateError } = await supabase
        .from('surprises')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSurprise = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se o usuário tem acesso à surpresa
      const { data: surprise, error: surpriseError } = await supabase
        .from('surprises')
        .select('user_id')
        .eq('id', id)
        .single();

      if (surpriseError) throw surpriseError;
      if (!surprise) throw new Error('Surpresa não encontrada');
      if (surprise.user_id !== user.id) throw new Error('Sem permissão para excluir esta surpresa');

      // Primeiro excluir as fotos relacionadas
      const { error: photosError } = await supabase
        .from('surprise_photos')
        .delete()
        .eq('surprise_id', id);

      if (photosError) throw photosError;

      // Depois excluir a surpresa
      const { error: deleteError } = await supabase
        .from('surprises')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error('Erro ao excluir surpresa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir surpresa');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar se o usuário tem acesso à foto
      const { data: photo, error: photoError } = await supabase
        .from('surprise_photos')
        .select('surprise_id')
        .eq('id', photoId)
        .single();

      if (photoError) throw photoError;
      if (!photo) throw new Error('Foto não encontrada');

      // Excluir a foto
      const { error: deleteError } = await supabase
        .from('surprise_photos')
        .delete()
        .eq('id', photoId);

      if (deleteError) throw deleteError;

      return true;
    } catch (err) {
      console.error('Erro ao excluir foto:', err);
      return false;
    }
  };

  const updateSurprise = async (id: string, data: UpdateSurpriseData) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Verificar acesso e status
      const { data: surprise, error: surpriseError } = await supabase
        .from('surprises')
        .select('user_id, status')
        .eq('id', id)
        .single();

      if (surpriseError) throw surpriseError;
      if (!surprise) throw new Error('Surpresa não encontrada');
      if (surprise.user_id !== user.id) throw new Error('Sem permissão para editar esta surpresa');
      if (surprise.status === 'active') throw new Error('Não é possível editar uma surpresa ativa');

      // 1. Excluir fotos marcadas para exclusão
      if (data.deletedPhotoIds?.length) {
        for (const photoId of data.deletedPhotoIds) {
          await deletePhoto(photoId);
        }
      }

      // 2. Upload das novas fotos
      const newPhotos: PhotoUploadResult[] = [];
      if (data.photos?.length) {
        const uploadPromises = data.photos.map((photo, index) => 
          uploadPhoto(photo, id, index)
        );

        const results = await Promise.allSettled(uploadPromises);
        const successfulUploads = results
          .filter((result): result is PromiseFulfilledResult<PhotoUploadResult> => 
            result.status === 'fulfilled' && result.value.order_index !== undefined
          )
          .map(result => ({
            ...result.value,
            order_index: result.value.order_index || 0 // Fallback para 0 se undefined
          }));

        newPhotos.push(...successfulUploads);
      }

      // 3. Salvar referências das novas fotos
      if (newPhotos.length) {
        const { error: photosError } = await supabase
          .from('surprise_photos')
          .insert(newPhotos);

        if (photosError) throw photosError;
      }

      // 4. Atualizar dados básicos da surpresa
      const { error: updateError } = await supabase
        .from('surprises')
        .update({
          couple_name: data.couple_name,
          start_date: data.start_date,
          message: data.message,
          youtube_link: data.youtube_link,
          plan: data.plan
        })
        .eq('id', id);

      if (updateError) throw updateError;

      return {
        success: true,
        requiresPayment: data.plan === 'premium'
      };
    } catch (err) {
      console.error('Erro ao atualizar surpresa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar surpresa');
      return {
        success: false,
        requiresPayment: false
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    createSurprise,
    getSurpriseWithPhotos,
    updateSurpriseStatus,
    deleteSurprise,
    updateSurprise,
    deletePhoto,
    loading,
    error
  };
} 