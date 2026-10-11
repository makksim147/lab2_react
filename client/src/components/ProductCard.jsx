import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleAdd() {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      await addToCart(product)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="card">
      <Link to={`/service/${product.id}`} className="card__link">
        {product.image && (
          <img src={product.image} alt={product.name} className="card__image" />
        )}
        <div className="card__info">
          <h2 className="card__name">{product.name}</h2>
          {product.category && (
            <span className="card__category">{product.category}</span>
          )}
          {product.description && (
            <p className="card__desc">{product.description}</p>
          )}
          {product.duration && (
            <p className="card__duration">Длительность: {product.duration} мин</p>
          )}
          <p className="card__price">
            {Number(product.price).toLocaleString('ru-RU')} ₽
          </p>
        </div>
      </Link>
      <button className="btn btn--add" onClick={handleAdd}>
        В корзину
      </button>
    </div>
  )
}