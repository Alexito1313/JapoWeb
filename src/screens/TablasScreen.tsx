import { useTheme } from '../theme/ThemeProvider'
import { Backdrop } from '../components/Backdrop'

/**
 * Pestaña "Tablas" (repertorio / consulta). Placeholder de Fase A; en Fase C se
 * llena con sub-pestañas Hiragana / Katakana / Kanji / Míos.
 */
export function TablasScreen() {
  const { variant } = useTheme()
  return (
    <div className="home-frame">
      <Backdrop variant={variant} />
      <div className="home-content">
        <div className="stats-wrap">
          <div className="stats-eyebrow">Tablas · 表</div>
          <h1 className="stats-title">
            Repertorio.
            <span className="stats-sub">silabarios, kanji y los tuyos</span>
          </h1>
          <p style={{ color: 'var(--ink-3)', marginTop: 18, lineHeight: 1.7, fontSize: 14 }}>
            Aquí llegarán <b>Hiragana</b>, <b>Katakana</b>, el índice de <b>Kanji</b> y{' '}
            <b>Míos</b> (tu contenido). 準備中 · próximamente.
          </p>
        </div>
      </div>
    </div>
  )
}
