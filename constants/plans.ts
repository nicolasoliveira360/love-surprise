export const PLANS = {
  basic: {
    name: 'Basic',
    type: 'basic' as const,
    price: 29.90,
    features: [
      'Até 3 fotos',
      'Contador personalizado',
      'Link compartilhável',
      'QR Code exclusivo',
      'Validade de 30 dias'
    ],
    limits: {
      maxPhotos: 3,
      hasYoutube: false,
      validityDays: 30
    }
  },
  premium: {
    name: 'Premium',
    type: 'premium' as const,
    price: 49.90,
    features: [
      'Até 7 fotos',
      'Música personalizada do YouTube',
      'Contador personalizado',
      'Link compartilhável',
      'QR Code exclusivo',
      'Validade permanente',
      'Temas exclusivos'
    ],
    limits: {
      maxPhotos: 7,
      hasYoutube: true,
      validityDays: null // permanente
    }
  }
}; 