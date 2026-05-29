import type { Card } from '../../data/content'
import type { Variant } from '../../theme/ThemeProvider'
import { Backdrop } from '../Backdrop'
import { StudyHeader } from '../StudyHeader'

export interface Answer {
  card: Card
  correct: boolean
}

interface Props {
  variant: Variant
  kind: 'study' | 'review' | 'test' | 'write'
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

  const eyebrow =
    kind === 'review'
      ? 'よくできました · 復習完了'
      : kind === 'write'
        ? 'よくできました · 書き取り完了'
        : 'お疲れさま · 完了'
  const title =
    kind === 'review'
      ? 'Repaso terminado.'
      : kind === 'test'
        ? 'Test terminado.'
        : kind === 'write'
          ? 'Escritura terminada.'
          : 'Sesión terminada.'
  const unit = kind === 'test' ? 'preguntas' : kind === 'write' ? 'kanji' : 'cartas'
  const accLbl = kind === 'write' ? 'bien' : 'acierto'
  const goodLbl = kind === 'write' ? 'bien' : 'acertadas'
  const badLbl = kind === 'write' ? 'a mejorar' : 'falladas'
  const failHead = kind === 'write' ? 'Practicar más' : 'Para repasar'
  const aceHead = kind === 'write' ? 'Bien escritas' : 'Bien dominadas'

  return (
    <div className="mode-frame proto">
      <Backdrop variant={variant} />
      <div className="mode-scroll">
        <StudyHeader title="Resumen" subtitle="まとめ" onBack={onHome} />
        <div className="summary-wrap">
          <div className="summary-eyebrow">{eyebrow}</div>
          <h2 className="summary-title">
            {title}
            <span className="summary-sub">
              {totalAns} {unit} · {pct}% {accLbl}
            </span>
          </h2>

          <div className="summary-big-stats">
            <div className="big-stat good">
              <span className="num">{stats.right}</span>
              <span className="lbl">{goodLbl}</span>
            </div>
            <div className="big-stat-divider"></div>
            <div className="big-stat bad">
              <span className="num">{stats.wrong}</span>
              <span className="lbl">{badLbl}</span>
            </div>
          </div>

          {kind !== 'write' && (
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
          )}

          {failed.length > 0 && (
            <div className="summary-section">
              <div className="summary-section-h">
                <span className="strk bad"></span>
                {failHead}
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
                {aceHead}
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
