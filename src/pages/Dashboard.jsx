import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const navigate = useNavigate()
  const { cart, total } = useCart()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Привет, {user.name}</h1>

      <div className="dashboard__stats">
        <div className="stat-card">
          <p className="stat-card__label">Товаров в корзине</p>
          <p className="stat-card__value">{cart.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Сумма заказа</p>
          <p className="stat-card__value">{total.toLocaleString()} руб.</p>
        </div>
      </div>

      <div className="dashboard__actions">
        <button className="btn btn--add" onClick={() => navigate('/')}>
          В каталог
        </button>
        <button className="btn btn--clear" onClick={() => navigate('/cart')}>
          В корзину
        </button>
        <button className="btn btn--clear" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </div>
  )
}

export default Dashboard