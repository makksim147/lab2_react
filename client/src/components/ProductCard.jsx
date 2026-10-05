import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  function handleAdd() {
    addToCart(product)
    navigate('/cart')
  }

  return (
    <div className="card">
      {product.image && (
        <img src={product.image} alt={product.name} className="card__image" />
      )}
      <div className="card__info">
        <h2 className="card__name">{product.name}</h2>
        {product.description && <p className="card__desc">{product.description}</p>}
        {product.duration && (
          <p className="card__duration">Длительность: {product.duration} мин</p>
        )}
        <p className="card__price">
          {Number(product.price).toLocaleString('ru-RU')} ₽
        </p>
      </div>
      <button className="btn btn--add" onClick={handleAdd}>
        В корзину
      </button>
    </div>
  )
}

export default ProductCard