import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useContent } from './useContent'
import { buildDeck, reviewDeck, type Selection } from './deck'
import type { Card } from './content'

/**
 * Obtiene el mazo para un modo, usando la selección que llega por router state.
 *
 * El mazo se baraja UNA vez (con Date.now) y se guarda en estado, para que NO
 * se vuelva a barajar en cada re-render (al voltear, responder, etc.). Se
 * reconstruye solo si cambian el contenido, el modo o la selección.
 */
export function useDeck(mode: 'study' | 'review' = 'study'): {
  deck: Card[]
  loading: boolean
} {
  const { content, loading } = useContent()
  const location = useLocation()
  const selection = (location.state as { selection?: Selection } | null)?.selection
  const selKey = JSON.stringify(selection ?? null)

  const [deck, setDeck] = useState<Card[]>([])

  useEffect(() => {
    if (!content) return
    setDeck(mode === 'review' ? reviewDeck(content) : buildDeck(content, selection))
    // selection se serializa en selKey para comparar por valor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, mode, selKey])

  return { deck, loading }
}
