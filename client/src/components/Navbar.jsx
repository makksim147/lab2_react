import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link nav-link--active' : 'nav-link'

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__logo">TechStore</NavLink>

      <div className="navbar__links">
        <NavLink to="/" end className={linkClass}>Каталог</NavLink>
        <NavLink to="/cart" className={linkClass}>
          Корзина
          {cart.length > 0 && (
            <span className="navbar__badge">
              {cart.reduce((s, i) => s + i.qty, 0)}
            </span>
          )}
        </NavLink>
        {user && (
          <NavLink to="/dashboard" className={linkClass}>Кабинет</NavLink>
        )}
      </div>

      <div className="navbar__right">
        {user ? (
          <>
            <span className="navbar__user">Привет, {user.full_name}</span>
            <button className="btn btn--small" onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>Войти</NavLink>
            <NavLink to="/register" className={linkClass}>Регистрация</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}