/** Fila superior de los modos: progreso (pétalos) + marcador de aciertos/fallos. */
export function ProgressMeta({
  index,
  total,
  right,
  wrong,
}: {
  index: number
  total: number
  right: number
  wrong: number
}) {
  return (
    <div className="proto-meta-row">
      <div className="proto-progress">
        <div className="proto-progress-label">
          <span className="idx">{String(index).padStart(2, '0')}</span>
          <span className="of">/ {total}</span>
        </div>
        <div className="proto-petals">
          {Array.from({ length: total }, (_, i) => {
            let cls = 'p'
            if (i < index - 1) cls += ' done'
            else if (i === index - 1) cls += ' curr'
            return <span key={i} className={cls}></span>
          })}
        </div>
      </div>
      <div className="proto-tally proto-tally-top">
        <span className="t-good">✓ {right}</span>
        <span className="t-bad">✗ {wrong}</span>
        <span className="t-pct">
          {Math.round((right / Math.max(1, right + wrong)) * 100)}%
        </span>
      </div>
    </div>
  )
}
