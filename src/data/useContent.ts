import { useEffect, useState } from 'react'
import { loadContent, type Content } from './content'

/** Carga el contenido una vez (cacheado en content.ts) y expone estado de carga. */
export function useContent() {
  const [content, setContent] = useState<Content | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let alive = true
    loadContent()
      .then((c) => alive && setContent(c))
      .catch((e) => alive && setError(e instanceof Error ? e : new Error(String(e))))
    return () => {
      alive = false
    }
  }, [])

  return { content, error, loading: !content && !error }
}
