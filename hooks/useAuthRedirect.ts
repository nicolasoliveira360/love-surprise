import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

export function useAuthRedirect() {
  const router = useRouter();
  const { user } = useUser();

  const handleAuthRedirect = (returnUrl: string) => {
    if (user) {
      // Se já estiver logado, redireciona direto
      router.push(returnUrl);
    } else {
      // Se não estiver logado, redireciona para login com returnUrl
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
  };

  return { handleAuthRedirect };
} 