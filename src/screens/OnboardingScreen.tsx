import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider'
import { Backdrop } from '../components/Backdrop'

const LEVELS = [
  { id: 'J1', sub: '1º', locked: true },
  { id: 'J2', sub: '2º', locked: true },
  { id: 'J3', sub: '3º', locked: false },
  { id: 'J4', sub: '4º', locked: true },
  { id: 'J5', sub: '5º', locked: true },
  { id: 'J6', sub: '6º', locked: true },
  { id: 'J7', sub: '7º', locked: true },
]

export const ONBOARDED_KEY = 'japoweb.onboarded'

export function OnboardingScreen() {
  const { variant, setPref } = useTheme()
  const navigate = useNavigate()

  const finish = () => {
    try {
      localStorage.setItem(ONBOARDED_KEY, '1')
    } catch {
      /* almacenamiento no disponible */
    }
    navigate('/')
  }

  return (
    <div className="home-frame">
      <Backdrop variant={variant} />
      <div className="home-content">
        <div className="onb-wrap">
          <div className="onb-mark">朱</div>
          <div className="onb-eyebrow">ようこそ · bienvenido/a</div>
          <h1 className="onb-title">
            Aprende japonés
            <br />a tu ritmo.
            <span className="onb-sub">kanji y vocabulario, un poco cada día</span>
          </h1>

          <div className="onb-section">
            <div className="onb-label">
              Tu nivel <span className="jp">級</span>
            </div>
            <div className="levels">
              {LEVELS.map((l) => {
                let cls = 'level'
                if (l.id === 'J3') cls += ' active'
                else if (l.locked) cls += ' locked'
                return (
                  <button key={l.id} className={cls} disabled={l.locked}>
                    <span className="l-id">{l.id}</span>
                    <span className="l-sub">{l.sub} año</span>
                  </button>
                )
              })}
            </div>
            <div className="onb-hint">De momento disponible J3. Pronto J1–J7.</div>
          </div>

          <div className="onb-section">
            <div className="onb-label">
              Apariencia <span className="jp">外観</span>
            </div>
            <div className="onb-theme">
              <button
                className={'onb-theme-opt' + (variant === 'a' ? ' on' : '')}
                onClick={() => setPref('light')}
              >
                <span className="ot-swatch claro"></span>
                <span className="ot-text">
                  <b>Claro</b>
                  <span>Washi · 和紙</span>
                </span>
              </button>
              <button
                className={'onb-theme-opt' + (variant === 'b' ? ' on' : '')}
                onClick={() => setPref('dark')}
              >
                <span className="ot-swatch oscuro"></span>
                <span className="ot-text">
                  <b>Oscuro</b>
                  <span>Yoru · 夜</span>
                </span>
              </button>
            </div>
          </div>

          <button className="onb-start" onClick={finish}>
            <span>Empezar a estudiar</span>
            <span className="onb-start-jp">始めましょう →</span>
          </button>
        </div>
      </div>
    </div>
  )
}
