import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import type { ProgressRepository, ProgressSnapshot } from './types'
import { LocalProgressRepository } from './LocalProgressRepository'

const RepoContext = createContext<ProgressRepository | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Para migrar a backend B2B: cambiar aquí por otra implementación de ProgressRepository.
  const repo = useMemo<ProgressRepository>(() => new LocalProgressRepository(), [])
  return <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>
}

/** Acceso al repositorio SIN suscripción (para escribir, p.ej. recordAnswer). */
export function useProgressRepo(): ProgressRepository {
  const repo = useContext(RepoContext)
  if (!repo) throw new Error('useProgressRepo debe usarse dentro de <ProgressProvider>')
  return repo
}

/** Acceso reactivo: re-renderiza cuando cambia el progreso. */
export function useProgress(): { snapshot: ProgressSnapshot; repo: ProgressRepository } {
  const repo = useProgressRepo()
  const snapshot = useSyncExternalStore(repo.subscribe, repo.getSnapshot)
  return { snapshot, repo }
}
