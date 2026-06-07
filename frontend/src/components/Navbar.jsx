import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✈</span>
          <span className="logo-text">JetBook</span>
        </Link>

        <div className="navbar-links">
          <Link to="/fleet/1" className="nav-link">Флот 1</Link>
          <Link to="/fleet/2" className="nav-link">Флот 2</Link>
          {user && <Link to="/my-bookings" className="nav-link">Мои бронирования</Link>}
          {user?.is_staff && <Link to="/admin" className="nav-link">Админка</Link>}
        </div>

        <div className="navbar-actions">
          {!loading && (
            user ? (
              <>
                <span className="nav-user">{user.username}</span>
                <button className="btn btn-ghost" onClick={handleLogout}>Выйти</button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-primary">Войти</Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
