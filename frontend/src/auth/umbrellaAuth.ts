import { useAuthStore } from '../stores/authStore';

// Mock umbrella URL for dev, in real app this would point to the SaltedHash umbrella auth service
// const UMBRELLA_URL = import.meta.env.VITE_UMBRELLA_URL || 'http://localhost:3000/auth';

export const exchangeTokenWithUmbrella = async (token: string): Promise<any> => {
  // In a real scenario, this exchanges an umbrella token for a local session
  // For MVP, we trust the token given by our local API or umbrella redirect
  const authStore = useAuthStore();

  // Here we would validate the token with Umbrella or verify signature locally
  // We'll just fetch user profile to verify
  try {
    const res = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      authStore.setAuth(data.user, token);
      return data;
    }
    throw new Error('Invalid token');
  } catch (error) {
    console.error('Umbrella auth failed', error);
    throw error;
  }
};

export const initiateUmbrellaLogin = () => {
  // Redirect to umbrella app
  // window.location.href = `${UMBRELLA_URL}/login?redirect=${encodeURIComponent(window.location.origin + '/auth/callback')}`;

  // For local MVP fallback, just use local login route
  window.location.href = '/login';
};
