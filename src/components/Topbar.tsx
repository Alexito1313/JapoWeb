import { useNavigate } from 'react-router-dom'

type Active = 'home' | 'stats' | 'settings'

/** Barra superior compartida: marca + navegación principal. */
export function Topbar({ active = 'home' }: { active?: Active }) {
  const navigate = useNavigate()
  return (
    <div className="topbar">
      <div
        className="brand"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <div className="brand-mark">朱</div>
        <div className="brand-text">
          <div className="brand-jp">日本語</div>
          <div className="brand-sub">estudio</div>
        </div>
      </div>
      <div className="topbar-nav">
        <button
          onClick={() => navigate('/')}
          className={active === 'home' ? 'active' : ''}
        >
          Inicio
        </button>
        <button
          onClick={() => navigate('/stats')}
          className={active === 'stats' ? 'active' : ''}
        >
          Stats
        </button>
        <button
          onClick={() => navigate('/settings')}
          className={active === 'settings' ? 'active' : ''}
        >
          Ajustes
        </button>
      </div>
    </div>
  )
}
