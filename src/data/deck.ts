import type { Card, Content } from './content'

/** Selección de estudio que viaja desde Home a los modos (via router state). */
export interface Selection {
  content: 'kanji' | 'vocab' | 'both'
  blocks: string[]
}

/** Baraja (Fisher-Yates) con semilla opcional para reproducibilidad. */
export function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = [...arr]
  let s = seed >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Construye el mazo de estudio a partir de la selección (o todos los kanji por defecto). */
export function buildDeck(content: Content, selection?: Selection): Card[] {
  let pool: Card[]
  if (!selection) {
    pool = content.kanji
  } else {
    const want: Card[] = []
    if (selection.content !== 'vocab') want.push(...content.kanji)
    if (selection.content !== 'kanji') want.push(...content.vocab)
    pool = selection.blocks.length
      ? want.filter((c) => selection.blocks.includes(c.block))
      : want
  }
  return shuffle(pool)
}

/**
 * Mazo de repaso. Placeholder hasta la Fase 3 (SRS): primeros n kanji.
 * En producción se ordenará por nº de fallos del progreso real.
 */
export function reviewDeck(content: Content, n = 8): Card[] {
  return content.kanji.slice(0, n)
}
