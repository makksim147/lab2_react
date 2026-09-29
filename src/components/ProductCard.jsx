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
      <img src={product.image} alt={product.name} className="card__image" />
      <div className="card__info">
        <h2 className="card__name">{product.name}</h2>
        <p className="card__price">{product.price.toLocaleString()} руб.</p>
      </div>
      <button className="btn btn--add" onClick={handleAdd}>
        В корзину
      </button>
    </div>
  )
}

export default ProductCard