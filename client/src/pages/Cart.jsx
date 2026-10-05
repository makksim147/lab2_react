import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="cart">
        <h1 className="page-title">Корзина</h1>
        <p className="cart__empty">Корзина пуста</p>
        <button className="btn" onClick={() => navigate('/')}>
          Вернуться в каталог
        </button>
      </div>
    )
  }

  return (
    <div className="cart">
      <h1 className="page-title">Корзина</h1>

      <div className="cart__list">
        {cart.map(item => (
          <div key={item.id} className="cart__item">
              {item.image && (
              <img src={item.image} alt={item.name} className="cart__image" />
            )}
            <div className="cart__info">
              <h3 className="cart__name">{item.name}</h3>
              <p className="cart__meta">
                {Number(item.price).toLocaleString('ru-RU')} ₽ × {item.qty || 1}
              </p>
            </div>

            <div className="cart__actions">
              <p className="cart__subtotal">
                {(Number(item.price) * (item.qty || 1)).toLocaleString('ru-RU')} ₽
              </p>
              <button
                className="btn btn--remove"
                onClick={() => removeFromCart(item.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart__footer">
        <p className="cart__total">
          Итого: {Number(total).toLocaleString('ru-RU')} ₽
        </p>
        <button className="btn btn--clear" onClick={clearCart}>
          Очистить корзину
        </button>
      </div>
    </div>
  )
}