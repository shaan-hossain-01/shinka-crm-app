import api from './api';
import type { User } from '@shinka/shared';

export const authApi = {
  signIn: async (email: string, password: string) => {
    const { data } = await api.post('/auth/signin', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  signOut: async () => {
    await api.get('/auth/signout');
    localStorage.removeItem('token');
  },

  signUp: async (name: string, email: string, password: string) => {
    const { data } = await api.post('/api/users', { name, email, password });
    return data;
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const { data } = await api.get('/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    } catch (error) {
      return null;
    }
  },
};
