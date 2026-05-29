import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ONBOARDED_KEY } from './screens/OnboardingScreen'
import { TabBar } from './components/TabBar'

// Rutas de "sección" que muestran la tab bar inferior. Los modos de estudio y
// las vistas empujadas (detalle, stats, onboarding) NO la muestran.
const SECTION_PATHS = ['/', '/tablas', '/calendar', '/settings']

/** Layout raíz: contenido de la ruta + tab bar en secciones + gate de onboarding. */
export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()

  // Primera visita → onboarding (salvo que ya haya progreso guardado).
  useEffect(() => {
    const onboarded =
      localStorage.getItem(ONBOARDED_KEY) === '1' || !!localStorage.getItem('japoweb.progress')
    if (!onboarded && location.pathname === '/') navigate('/onboarding', { replace: true })
  }, [location.pathname, navigate])

  const showTabBar = SECTION_PATHS.includes(location.pathname)

  return (
    <div className={'app-root' + (showTabBar ? ' has-tabbar' : '')}>
      <Outlet />
      {showTabBar && <TabBar />}
    </div>
  )
}
