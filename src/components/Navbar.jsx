import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { cart } = useCart()

  return (
    <nav className="navbar">
      <div className="navbar__logo">TechStore</div>

      <div className="navbar__links">
        <NavLink
          to='/'
          className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
        >
          Каталог
        </NavLink>

        <NavLink
          to='/cart'
          className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
        >
          Корзина
          {cart.length > 0 && (
            <span className="navbar__badge">{cart.length}</span>
          )}
        </NavLink>

        <NavLink
          to='/login'
          className={({ isActive }) => isActive ? 'nav-link nav-link--active' : 'nav-link'}
        >
          Войти
        </NavLink>
      </div>

      <button className="theme-btn" onClick={toggleTheme}>
        {theme === 'dark' ? 'Светлая' : 'Тёмная'}
      </button>
    </nav>
  )
}

export default Navbar