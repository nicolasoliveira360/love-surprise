import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY não encontrada no ambiente');
}

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia'
}) : null;

const PRICE_IDS = {
  basic: 'price_1QOLSnLZKQmEvMeaHasH8GaD',
  premium: 'price_1QOLTLLZKQmEvMeaZR35wS60'
};

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não configurado corretamente' },
        { status: 500 }
      );
    }

    const { surpriseId, plan, customerEmail, paymentMethodId } = await req.json();

    if (!surpriseId || !plan || !customerEmail || !paymentMethodId) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Criar ou obter customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        payment_method: paymentMethodId,
      });
    }

    // Criar pagamento
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan === 'premium' ? 4990 : 2990, // em centavos
      currency: 'brl',
      customer: customer.id,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        surpriseId,
        plan
      }
    });

    return NextResponse.json({ 
      sessionId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret 
    });
  } catch (err) {
    console.error('Erro ao processar pagamento:', err);
    
    // Melhor tratamento de erro
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao processar pagamento' },
      { status: 500 }
    );
  }
} 