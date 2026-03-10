import { create } from 'zustand';

interface UserState {
  userId: string | null;
  name: string;
  email: string;
  setUserId: (id: string) => void;
  setUser: (name: string, email: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  name: '',
  email: '',
  setUserId: (id) => set({ userId: id }),
  setUser: (name, email) => set({ name, email }),
  logout: () => set({ userId: null, name: '', email: '' }),
}));
