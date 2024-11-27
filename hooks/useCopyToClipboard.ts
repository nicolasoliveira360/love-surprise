import { useState, useCallback } from 'react';

interface CopyToClipboardState {
  copied: boolean;
  error: Error | null;
}

export function useCopyToClipboard(duration = 2000): [boolean, (text: string) => Promise<void>] {
  const [state, setState] = useState<CopyToClipboardState>({
    copied: false,
    error: null,
  });

  const copy = useCallback(async (text: string) => {
    try {
      // Método 1: Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setState({ copied: true, error: null });
        setTimeout(() => setState({ copied: false, error: null }), duration);
        return;
      }

      // Método 2: execCommand com textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      
      // Tornar o textarea invisível mas funcional
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      textarea.setAttribute('readonly', '');
      
      document.body.appendChild(textarea);
      
      // Selecionar e copiar em dispositivos móveis
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        textarea.setSelectionRange(0, textarea.value.length);
      } else {
        textarea.select();
      }

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (!successful) throw new Error('Não foi possível copiar o texto');

      setState({ copied: true, error: null });
      setTimeout(() => setState({ copied: false, error: null }), duration);
    } catch (err) {
      setState({ copied: false, error: err instanceof Error ? err : new Error('Erro ao copiar') });
      console.error('Erro ao copiar:', err);
    }
  }, [duration]);

  return [state.copied, copy];
} 