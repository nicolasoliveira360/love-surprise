import { NextResponse } from 'next/server';
import { createNotification } from '@/lib/notifications';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const event = await request.json();

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const surpriseId = session.metadata?.surpriseId;
      const userId = session.metadata?.userId;

      if (surpriseId && userId) {
        // Atualizar status da surpresa
        await supabase
          .from('surprises')
          .update({ status: 'active' })
          .eq('id', surpriseId);

        // Criar notificação de pagamento
        await createNotification({
          userId,
          surpriseId,
          type: 'paid',
          message: 'Pagamento confirmado! Sua surpresa está ativa.'
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Erro ao processar webhook' },
      { status: 400 }
    );
  }
} 