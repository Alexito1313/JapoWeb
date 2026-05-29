import type {
  CardProgress,
  ProgressRepository,
  ProgressSnapshot,
  Settings,
} from './types'
import { DAY_MS, dayKey, nextSRS } from './srs'

const KEY = 'japoweb.progress'
const VERSION = 1
const DEFAULT_SETTINGS: Settings = { cardsPerSession: 20, level: 'J3' }

function emptySnapshot(): ProgressSnapshot {
  return {
    version: VERSION,
    cards: {},
    streak: { current: 0, longest: 0, lastStudyDay: '', days: {} },
    settings: { ...DEFAULT_SETTINGS },
  }
}

/**
 * Implementación de ProgressRepository sobre localStorage.
 * Mantiene un snapshot inmutable en memoria (se reemplaza por uno nuevo en cada
 * mutación) para que useSyncExternalStore detecte el cambio por identidad.
 */
export class LocalProgressRepository implements ProgressRepository {
  private snapshot: ProgressSnapshot
  private listeners = new Set<() => void>()

  constructor() {
    this.snapshot = this.read()
  }

  getSnapshot = (): ProgressSnapshot => this.snapshot

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private read(): ProgressSnapshot {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return emptySnapshot()
      const parsed = JSON.parse(raw) as Partial<ProgressSnapshot>
      const base = emptySnapshot()
      return {
        ...base,
        ...parsed,
        streak: { ...base.streak, ...parsed.streak },
        settings: { ...base.settings, ...parsed.settings },
        cards: parsed.cards ?? {},
      }
    } catch {
      return emptySnapshot()
    }
  }

  private commit(next: ProgressSnapshot): void {
    this.snapshot = next
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* almacenamiento lleno o no disponible: el estado en memoria sigue válido */
    }
    this.listeners.forEach((l) => l())
  }

  recordAnswer(jp: string, correct: boolean): void {
    const now = Date.now()
    const prev = this.snapshot.cards[jp]
    const card: CardProgress = {
      jp,
      views: (prev?.views ?? 0) + 1,
      right: (prev?.right ?? 0) + (correct ? 1 : 0),
      wrong: (prev?.wrong ?? 0) + (correct ? 0 : 1),
      lastSeen: now,
      ...nextSRS(prev, correct, now),
    }

    const streak = { ...this.snapshot.streak, days: { ...this.snapshot.streak.days } }
    const today = dayKey(now)
    streak.days[today] = (streak.days[today] ?? 0) + 1
    if (streak.lastStudyDay !== today) {
      const yesterday = dayKey(now - DAY_MS)
      streak.current = streak.lastStudyDay === yesterday ? streak.current + 1 : 1
      streak.lastStudyDay = today
      streak.longest = Math.max(streak.longest, streak.current)
    }

    this.commit({
      ...this.snapshot,
      cards: { ...this.snapshot.cards, [jp]: card },
      streak,
    })
  }

  setSettings(patch: Partial<Settings>): void {
    this.commit({ ...this.snapshot, settings: { ...this.snapshot.settings, ...patch } })
  }

  exportJSON(): string {
    return JSON.stringify(this.snapshot, null, 2)
  }

  importJSON(json: string): boolean {
    try {
      const parsed = JSON.parse(json) as Partial<ProgressSnapshot>
      if (!parsed || typeof parsed !== 'object' || typeof parsed.cards !== 'object') return false
      const base = emptySnapshot()
      this.commit({
        ...base,
        ...parsed,
        streak: { ...base.streak, ...parsed.streak },
        settings: { ...base.settings, ...parsed.settings },
        cards: parsed.cards ?? {},
      })
      return true
    } catch {
      return false
    }
  }

  reset(): void {
    this.commit(emptySnapshot())
  }
}
