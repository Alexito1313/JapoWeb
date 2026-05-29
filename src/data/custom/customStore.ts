/* ============================================================
   Contenido propio del usuario ("Míos"). Store reactivo sobre localStorage,
   mismo espíritu que ProgressRepository (intercambiable por backend en el futuro).
   Las entradas se convierten a Card (block 'MIOS') para entrar a los mazos y al
   detalle como una fuente más.
   ============================================================ */
import { useSyncExternalStore } from 'react'
import type { Card } from '../content'

export interface CustomEntry {
  id: string
  jp: string
  read: string
  mean: string
  kind: 'kanji' | 'vocab'
  /** tipo gramatical (vocab: verbo/sustantivo/…) o 'kanji'. */
  type: string
  /** ejemplos propios (kanji), una línea por ejemplo. */
  extras: string[]
  createdAt: number
}

const KEY = 'japoweb.custom'

function readStore(): CustomEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? (arr as CustomEntry[]) : []
  } catch {
    return []
  }
}

let snapshot: CustomEntry[] = readStore()
const listeners = new Set<() => void>()

function commit(next: CustomEntry[]) {
  snapshot = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* almacenamiento no disponible: el estado en memoria sigue válido */
  }
  listeners.forEach((l) => l())
}

function genId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    /* sin crypto */
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const customStore = {
  getSnapshot: (): CustomEntry[] => snapshot,
  subscribe: (l: () => void): (() => void) => {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
  add: (e: Omit<CustomEntry, 'id' | 'createdAt'>): void => {
    commit([{ ...e, id: genId(), createdAt: Date.now() }, ...snapshot])
  },
  remove: (id: string): void => {
    commit(snapshot.filter((x) => x.id !== id))
  },
}

/** Acceso reactivo a las entradas propias. */
export function useCustom(): { entries: CustomEntry[] } {
  const entries = useSyncExternalStore(customStore.subscribe, customStore.getSnapshot)
  return { entries }
}

/** ¿Esta entrada puede practicarse en el modo escritura? (kanji de 1 carácter) */
export function canWrite(e: { jp: string; kind: 'kanji' | 'vocab' }): boolean {
  return e.kind === 'kanji' && [...e.jp.trim()].length === 1
}

/** Convierte una entrada propia en Card (block 'MIOS') para mazos / detalle. */
export function customToCard(e: CustomEntry): Card {
  return {
    jp: e.jp,
    read: e.read,
    mean: e.mean,
    block: 'MIOS',
    type: e.kind === 'kanji' ? 'kanji' : e.type || 'vocab',
    cat: 'Míos · 自分',
    extras: e.extras ?? [],
  }
}
