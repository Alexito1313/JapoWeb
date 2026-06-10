/* ============================================================
   Copia de seguridad combinada: progreso + contenido propio ("Míos").
   Antes el export solo llevaba el snapshot de progreso y, al restaurarlo en
   otro dispositivo, las cartas de Míos no existían allí → progreso huérfano.

   FORMATO PLANO a propósito: el snapshot va en el nivel superior (cards/streak/
   settings) y las claves nuevas (app/backupVersion/custom) van AL LADO. Así el
   archivo es compatible en AMBAS direcciones: las builds antiguas desplegadas
   (APK, PWA sin actualizar) lo importan con su importJSON de siempre (ignoran
   las claves extra) y esta build también lee los exports antiguos.
   ============================================================ */
import type { ProgressRepository } from './progress/types'
import { customStore } from './custom/customStore'

/** Límite del archivo a importar: un backup real ocupa unos pocos KB. */
const MAX_BACKUP_CHARS = 5 * 1024 * 1024

export function downloadJSON(filename: string, json: string): void {
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Serializa el backup completo (progreso en el nivel superior + Míos). */
export function buildBackup(repo: ProgressRepository): string {
  const progress = JSON.parse(repo.exportJSON()) as Record<string, unknown>
  const custom = customStore.getSnapshot()
  return JSON.stringify(
    {
      ...progress,
      app: 'sumigo',
      backupVersion: 1,
      // Se omite si está vacío: así restaurar un backup de un dispositivo sin
      // Míos no borra los Míos del dispositivo destino.
      ...(custom.length ? { custom } : {}),
    },
    null,
    2,
  )
}

/**
 * Restaura un backup (formato plano nuevo o export antiguo: ambos llevan el
 * snapshot en el nivel superior). Devuelve false si no es válido; el progreso
 * solo se reemplaza si valida, y los Míos solo si el backup trae entradas.
 */
export function importBackup(repo: ProgressRepository, json: string): boolean {
  if (typeof json !== 'string' || json.length > MAX_BACKUP_CHARS) return false
  try {
    const parsed = JSON.parse(json) as Record<string, unknown> | null
    if (!repo.importJSON(json)) return false
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.custom) && parsed.custom.length)
      customStore.replaceAll(parsed.custom)
    return true
  } catch {
    return false
  }
}
