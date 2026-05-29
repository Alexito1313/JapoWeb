import type { Card } from '../../data/content'
import type { Variant } from '../../theme/ThemeProvider'
import { Backdrop } from '../Backdrop'
import { Topbar } from '../Topbar'

export interface Answer {
  card: Card
  correct: boolean
}

interface Props {
  variant: Variant
  kind: 'study' | 'review' | 'test'
  stats: { right: number; wrong: number }
  maxStreak: number
  answered: Answer[]
  onHome: () => void
  onRestart: () => void
}

/** Resumen de fin de sesión, compartido por Flashcards, Repaso y Test. */
export function SessionSummary({
  variant,
  kind,
  stats,
  maxStreak,
  answered,
  onHome,
  onRestart,
}: Props) {
  const byCard: Record<string, { card: Card; right: number; wrong: number }> = {}
  answered.forEach((a) => {
    const k = a.card.jp
    if (!byCard[k]) byCard[k] = { card: a.card, right: 0, wrong: 0 }
    if (a.correct) byCard[k].right++
    else byCard[k].wrong++
  })
  const cards = Object.values(byCard)
  const failed = cards.filter((c) => c.wrong > 0).sort((a, b) => b.wrong - a.wrong)
  const aced = cards.filter((c) => c.wrong === 0).sort((a, b) => b.right - a.right)
  const totalAns = answered.length
  const pct = totalAns > 0 ? Math.round((stats.right / totalAns) * 100) : 0

  const eyebrow = kind === 'review' ? 'よくできました · 復習完了' : 'お疲れさま · 完了'
  const title =
    kind === 'review' ? 'Repaso terminado.' : kind === 'test' ? 'Test terminado.' : 'Sesión terminada.'
  const unit = kind === 'test' ? 'preguntas' : 'cartas'

  return (
    <div className="mode-frame proto">
      <Backdrop variant={variant} />
      <div className="mode-scroll">
        <Topbar />
        <div className="summary-wrap">
          <div className="summary-eyebrow">{eyebrow}</div>
          <h2 className="summary-title">
            {title}
            <span className="summary-sub">
              {totalAns} {unit} · {pct}% acierto
            </span>
          </h2>

          <div className="summary-big-stats">
            <div className="big-stat good">
              <span className="num">{stats.right}</span>
              <span className="lbl">acertadas</span>
            </div>
            <div className="big-stat-divider"></div>
            <div className="big-stat bad">
              <span className="num">{stats.wrong}</span>
              <span className="lbl">falladas</span>
            </div>
          </div>

          <div className="summary-stats-row">
            <div className="mini-stat">
              <span className="num">
                {pct}
                <small>%</small>
              </span>
              <span className="lbl">acierto</span>
            </div>
            <div className="mini-stat">
              <span className="num">{maxStreak}</span>
              <span className="lbl">racha máx</span>
            </div>
            <div className="mini-stat">
              <span className="num">{cards.length}</span>
              <span className="lbl">únicas</span>
            </div>
          </div>

          {failed.length > 0 && (
            <div className="summary-section">
              <div className="summary-section-h">
                <span className="strk bad"></span>
                Para repasar
                <span className="jp-side">復習</span>
                <span className="cnt">{failed.length}</span>
              </div>
              <div className="summary-list">
                {failed.map((c, i) => (
                  <div className="summary-row miss" key={i}>
                    <div className="row-jp">{c.card.jp}</div>
                    <div className="row-info">
                      <div className="row-mean">{c.card.mean}</div>
                      <div className="row-read">{c.card.read}</div>
                    </div>
                    <div className="row-mark bad">✗ {c.wrong}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aced.length > 0 && (
            <div className="summary-section">
              <div className="summary-section-h">
                <span className="strk good"></span>
                Bien dominadas
                <span className="jp-side">合格</span>
                <span className="cnt">{aced.length}</span>
              </div>
              <div className="summary-list">
                {aced.map((c, i) => (
                  <div className="summary-row know" key={i}>
                    <div className="row-jp">{c.card.jp}</div>
                    <div className="row-info">
                      <div className="row-mean">{c.card.mean}</div>
                      <div className="row-read">{c.card.read}</div>
                    </div>
                    <div className="row-mark good">✓ {c.right}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="summary-actions">
            <button className="summary-btn ghost" onClick={onHome}>
              Inicio
              <span className="jp-mini">ホーム</span>
            </button>
            <button className="summary-btn primary" onClick={onRestart}>
              Repetir
              <span className="jp-mini">もう一度</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
