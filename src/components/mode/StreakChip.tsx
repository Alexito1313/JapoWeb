/** Disco de racha que aparece al encadenar aciertos (≥3). La animación se
 *  re-dispara cambiando la `key` desde el padre. */
export function StreakChip({ value }: { value: number }) {
  return (
    <div className="streak-chip">
      <div className="num-wrap">
        <span className="num">{value}</span>
      </div>
      <div className="lbl-wrap">
        <span className="lbl">racha</span>
        <span className="jp">連続</span>
      </div>
    </div>
  )
}
