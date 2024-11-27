export function generateId(): string {
  try {
    // Primeira tentativa: crypto.randomUUID()
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Segunda tentativa: crypto.getRandomValues
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      
      // Converter para string hexadecimal
      return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    }

    // Fallback: timestamp + random
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    const secondRandom = Math.random().toString(36).substring(2, 15);
    
    return `${timestamp}-${randomStr}-${secondRandom}`;
  } catch (err) {
    // Último recurso: garantir que sempre retorne um ID único
    console.warn('Fallback para geração de ID simples:', err);
    return `${Date.now()}-${Math.random().toString(36).substring(2)}-${Math.random().toString(36).substring(2)}`;
  }
} 