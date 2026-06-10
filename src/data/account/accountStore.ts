/* ============================================================
   Cuenta de usuario — MAQUETA (sin backend todavía). Store reactivo sobre
   localStorage. Cuando se implemente el backend (Firebase/Supabase), basta con
   sustituir signIn/signOut por llamadas reales y sincronizar el progreso
   (ProgressRepository ya es intercambiable).
   ============================================================ */
import { useSyncExternalStore } from 'react'

export interface Account {
  email: string
}

const KEY = 'japoweb.account'

function readStore(): Account | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    // Valida la forma: un JSON corrupto/ajeno no debe colar un Account inválido.
    const parsed = JSON.parse(raw) as Record<string, unknown> | null
    return parsed && typeof parsed === 'object' && typeof parsed.email === 'string' && parsed.email
      ? { email: parsed.email }
      : null
  } catch {
    return null
  }
}

let snapshot: Account | null = readStore()
const listeners = new Set<() => void>()

// Sincronización entre pestañas (login/logout hecho en otra pestaña se refleja).
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === null) {
      snapshot = readStore()
      listeners.forEach((l) => l())
    }
  })
}

function commit(next: Account | null) {
  snapshot = next
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next))
    else localStorage.removeItem(KEY)
  } catch {
    /* almacenamiento no disponible */
  }
  listeners.forEach((l) => l())
}

export const accountStore = {
  getSnapshot: (): Account | null => snapshot,
  subscribe: (l: () => void): (() => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  /** MAQUETA: "inicia sesión" guardando el correo en local (sin servidor). */
  signIn: (email: string): void => commit({ email }),
  signOut: (): void => commit(null),
}

/** Acceso reactivo a la cuenta (null = invitado). */
export function useAccount(): Account | null {
  return useSyncExternalStore(accountStore.subscribe, accountStore.getSnapshot)
}
