import type { CSSProperties } from 'react'
import type { Variant } from '../theme/ThemeProvider'

/* ============================================================
   Escena decorativa (torii + Monte Fuji + sol/luna + cordillera + niebla).
   100% CSS, sin imágenes. Port de WashiBackdrop/FujiBackdrop del handoff.
   Contenedores .washi-bg / .fuji-bg (styles.css) + piezas .sc-* (scenes.css).
   Reutilizable en cualquier pantalla con posición relativa.
   ============================================================ */

const box: CSSProperties = {
  left: '50%',
  bottom: 16,
  transform: 'translateX(-50%)',
  position: 'absolute',
}

function Torii() {
  return (
    <div className="sc-torii">
      <div className="post l"></div>
      <div className="post r"></div>
      <div className="nuki"></div>
      <div className="gakuzuka"></div>
      <div className="shimaki"></div>
      <div className="kasagi"></div>
    </div>
  )
}

export function WashiBackdrop() {
  const FILL = 'linear-gradient(180deg, #4A4842 0%, #6b6760 100%)'
  const SOFT = 'linear-gradient(180deg, #5a564e 0%, #7d786d 100%)'
  return (
    <div className="washi-bg" aria-hidden="true">
      <div className="seal">墨</div>
      <div className="sc-sun" style={{ opacity: 0.4 }}></div>
      <div className="sc-backrange"></div>
      <div className="sc-backrange front"></div>
      <div
        style={{
          ...box,
          width: 300,
          height: 132,
          background: FILL,
          opacity: 0.72,
          zIndex: 2,
          clipPath:
            'polygon(0% 100%, 30% 44%, 42% 30%, 50% 22%, 58% 30%, 70% 44%, 100% 100%)',
        }}
      ></div>
      <div
        style={{
          ...box,
          width: 300,
          height: 132,
          background: '#F3EEE1',
          opacity: 0.95,
          zIndex: 3,
          clipPath:
            'polygon(50% 22%, 58% 30%, 63% 36%, 59% 41%, 54% 38%, 50% 44%, 46% 38%, 41% 41%, 37% 36%, 42% 30%)',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 16,
          height: 72,
          background: SOFT,
          opacity: 0.5,
          zIndex: 4,
          clipPath:
            'polygon(0% 100%, 9% 80%, 20% 66%, 32% 78%, 45% 62%, 55% 60%, 67% 74%, 79% 64%, 90% 78%, 100% 72%, 100% 100%)',
        }}
      ></div>
      <div className="sc-mist"></div>
      <Torii />
    </div>
  )
}

export function FujiBackdrop() {
  const FUJI = 'linear-gradient(180deg, #1d3a55 0%, #294a6e 100%)'
  const SOFT = 'linear-gradient(180deg, #16304c 0%, #20405f 100%)'
  const BACK1 = 'linear-gradient(180deg, #14283f 0%, #1b3a54 100%)'
  const BACK2 = 'linear-gradient(180deg, #102236 0%, #172f49 100%)'
  return (
    <div className="fuji-bg" aria-hidden="true">
      <div
        style={{
          left: '50%',
          bottom: 70,
          transform: 'translateX(-50%)',
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 44% 40%, #f2e6bd 0%, #d8b969 60%, #c2a050 100%)',
          opacity: 0.7,
          zIndex: 1,
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 16,
          height: 84,
          background: BACK1,
          opacity: 0.5,
          zIndex: 1,
          clipPath:
            'polygon(0% 100%, 5% 66%, 12% 80%, 21% 52%, 30% 72%, 40% 48%, 50% 70%, 60% 50%, 69% 74%, 79% 54%, 88% 72%, 95% 60%, 100% 70%, 100% 100%)',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 16,
          height: 58,
          background: BACK2,
          opacity: 0.45,
          zIndex: 1,
          clipPath:
            'polygon(0% 100%, 8% 72%, 18% 84%, 28% 64%, 38% 80%, 50% 60%, 60% 80%, 70% 66%, 82% 82%, 92% 70%, 100% 78%, 100% 100%)',
        }}
      ></div>
      <div
        style={{
          ...box,
          width: 300,
          height: 132,
          background: FUJI,
          opacity: 0.9,
          zIndex: 2,
          clipPath:
            'polygon(0% 100%, 30% 44%, 42% 30%, 50% 22%, 58% 30%, 70% 44%, 100% 100%)',
        }}
      ></div>
      <div
        style={{
          ...box,
          width: 300,
          height: 132,
          background: '#c5cfdb',
          opacity: 0.85,
          zIndex: 3,
          clipPath:
            'polygon(50% 22%, 58% 30%, 63% 36%, 59% 41%, 54% 38%, 50% 44%, 46% 38%, 41% 41%, 37% 36%, 42% 30%)',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 16,
          height: 72,
          background: SOFT,
          opacity: 0.6,
          zIndex: 4,
          clipPath:
            'polygon(0% 100%, 9% 80%, 20% 66%, 32% 78%, 45% 62%, 55% 60%, 67% 74%, 79% 64%, 90% 78%, 100% 72%, 100% 100%)',
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 70,
          zIndex: 5,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(14,30,51,0.55) 55%, rgba(14,30,51,0.82) 100%)',
        }}
      ></div>
      <Torii />
    </div>
  )
}

/** Elige la escena según el tema activo. */
export function Backdrop({ variant }: { variant: Variant }) {
  return variant === 'a' ? <WashiBackdrop /> : <FujiBackdrop />
}
