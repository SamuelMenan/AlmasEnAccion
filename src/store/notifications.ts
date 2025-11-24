import { create } from 'zustand'
import api from '@/lib/api'

export type NotificationItem = { id: string; title: string; message: string; link?: string; createdAt: string; read?: boolean; priority?: boolean }

type Store = {
  items: NotificationItem[]
  unread: number
  fetch: () => Promise<void>
  markRead: (id: string) => Promise<void>
  connect: () => void
  markAllRead: () => Promise<void>
}

export const useNotifications = create<Store>((set) => ({
  items: [],
  unread: 0,
  fetch: async () => {
    const [listRes, countRes] = await Promise.all([
      api.get('/notifications'),
      api.get('/notifications/unread/count'),
    ])
    set({ items: listRes.data, unread: countRes.data })
  },
  markRead: async (id: string) => {
    await api.post(`/notifications/${id}/read`)
    set((s) => ({ items: s.items.map(i => i.id === id ? { ...i, read: true } : i), unread: Math.max(0, s.unread - 1) }))
  },
  markAllRead: async () => {
    const state = useNotifications.getState()
    const unreadIds = state.items.filter(i => !i.read).map(i => i.id)
    await Promise.all(unreadIds.map(id => api.post(`/notifications/${id}/read`)))
    set((s) => ({ items: s.items.map(i => ({ ...i, read: true })), unread: 0 }))
  },
  connect: () => {
    // Fallback a polling autenticado para evitar problemas de Authorization con SSE
    const poll = async () => {
      try { await (useNotifications.getState().fetch()) } catch {}
    }
    poll()
    const id = setInterval(poll, 15000)
    // Dev: si SSE está habilitado con cookies, se puede reemplazar por EventSource
    // window.addEventListener('beforeunload', () => clearInterval(id))
  }
}))
