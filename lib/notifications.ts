import { supabase } from '@/lib/supabase';

type NotificationType = 'created' | 'paid' | 'viewed';

interface CreateNotificationParams {
  userId: string;
  surpriseId: string;
  type: NotificationType;
  message: string;
}

export async function createNotification({
  userId,
  surpriseId,
  type,
  message
}: CreateNotificationParams) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        surprise_id: surpriseId,
        type,
        message
      });

    if (error) throw error;
  } catch (err) {
    console.error('Erro ao criar notificação:', err);
  }
} 