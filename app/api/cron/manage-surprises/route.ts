import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables missing');
      return NextResponse.json({ 
        success: false, 
        error: 'Configuration error' 
      }, { status: 500 });
    }

    // 1. Excluir surpresas não pagas após 3 dias
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { error: deleteError } = await supabase
      .from('surprises')
      .delete()
      .eq('status', 'draft')
      .lt('created_at', threeDaysAgo.toISOString());

    if (deleteError) {
      console.error('Error deleting drafts:', deleteError);
      throw deleteError;
    }

    // 2. Expirar surpresas básicas após 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { error: expireError } = await supabase
      .from('surprises')
      .update({ status: 'expired' })
      .eq('plan', 'basic')
      .eq('status', 'active')
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (expireError) {
      console.error('Error expiring surprises:', expireError);
      throw expireError;
    }

    return NextResponse.json({ 
      success: true,
      message: 'Surpresas gerenciadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao gerenciar surpresas:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao gerenciar surpresas' 
    }, { status: 500 });
  }
} 