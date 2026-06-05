import type {
  CardProgress,
  ProgressRepository,
  ProgressSnapshot,
  Settings,
  StreakState,
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

const finiteNum = (x: unknown, d = 0): number =>
  typeof x === 'number' && Number.isFinite(x) ? x : d

/** Normaliza el mapa de cartas (leído de localStorage o importado): descarta
 *  entradas que no sean objeto y coacciona los numéricos a valores finitos.
 *  Evita NaN propagándose a Stats/Detalle y crashes si `cards` viniera como
 *  null/array/malformado (typeof null/[] === 'object' burlaba la validación). */
function sanitizeCards(raw: unknown): Record<string, CardProgress> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, CardProgress> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== 'object') continue
    const c = v as Record<string, unknown>
    out[k] = {
      jp: typeof c.jp === 'string' ? c.jp : k,
      views: finiteNum(c.views),
      right: finiteNum(c.right),
      wrong: finiteNum(c.wrong),
      lastSeen: finiteNum(c.lastSeen),
      reps: finiteNum(c.reps),
      intervalDays: finiteNum(c.intervalDays),
      ease: finiteNum(c.ease, 2.5),
      due: finiteNum(c.due),
    }
  }
  return out
}

/** Normaliza la racha (días → conteos numéricos > 0; campos numéricos finitos). */
function sanitizeStreak(raw: unknown): StreakState {
  const days: Record<string, number> = {}
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const s = raw as Record<string, unknown>
    if (s.days && typeof s.days === 'object' && !Array.isArray(s.days)) {
      for (const [k, v] of Object.entries(s.days as Record<string, unknown>)) {
        const n = finiteNum(v)
        if (n > 0) days[k] = n
      }
    }
    return {
      current: finiteNum(s.current),
      longest: finiteNum(s.longest),
      lastStudyDay: typeof s.lastStudyDay === 'string' ? s.lastStudyDay : '',
      days,
    }
  }
  return { current: 0, longest: 0, lastStudyDay: '', days }
}

/**
 * Implementación de ProgressRepository sobre localStorage.
 * Mantiene un snapshot inmutable en memoria (se reemplaza por uno nuevo en cada
 * mutación) para que useSyncExternalStore detecte el cambio por identidad.
 */
export class LocalProgressRepository implements ProgressRepository {
  private snapshot: ProgressSnapshot
  private listeners = new Set<() => void>()
  private saveError = false

  constructor() {
    this.snapshot = this.read()
  }

  getSnapshot = (): ProgressSnapshot => this.snapshot

  hasSaveError = (): boolean => this.saveError

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
        streak: sanitizeStreak(parsed.streak),
        settings: { ...base.settings, ...parsed.settings },
        cards: sanitizeCards(parsed.cards),
      }
    } catch {
      return emptySnapshot()
    }
  }

  private commit(next: ProgressSnapshot): void {
    this.snapshot = next
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
      this.saveError = false
    } catch {
      // almacenamiento lleno o no disponible (cuota / Safari privado): el estado
      // en memoria sigue válido, pero marcamos el fallo para avisar al usuario.
      this.saveError = true
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
      // Validación estricta: `cards` debe ser un objeto plano (ni null ni array;
      // typeof de ambos es 'object' y antes colaban, dejando cards=null → crash,
      // o un array → progreso "fantasma" inconsistente).
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        typeof parsed.cards !== 'object' ||
        parsed.cards === null ||
        Array.isArray(parsed.cards)
      )
        return false
      const base = emptySnapshot()
      this.commit({
        ...base,
        cards: sanitizeCards(parsed.cards),
        streak: sanitizeStreak(parsed.streak),
        settings: { ...base.settings, ...parsed.settings },
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
