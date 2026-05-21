import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  _hasHydrated: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
  setUser: (user: User) => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  _hasHydrated: false,
  setHasHydrated: (state) => set({ _hasHydrated: state }),
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token)
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
    }
    set({ user, token })
  },
  setUser: (user) => set({ user }),
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      document.cookie = 'token=; path=/; max-age=0'
    }
    set({ user: null, token: null })
  },
  isAuthenticated: () => true,
}))
