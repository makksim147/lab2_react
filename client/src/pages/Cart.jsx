import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../api/api'

export default function Cart() {
  const { cart, total, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [address, setAddress] = useState(user?.address || '')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <div className="cart">
        <h1 className="page-title">Корзина</h1>
        <p className="cart__empty">Войдите, чтобы увидеть корзину</p>
        <button className="btn" onClick={() => navigate('/login')}>Войти</button>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="cart">
        <h1 className="page-title">Корзина</h1>
        <p className="cart__empty">Корзина пуста</p>
        <button className="btn" onClick={() => navigate('/')}>В каталог</button>
      </div>
    )
  }

  // Оформление заказа с валидацией
  async function handleOrder(e) {
    e.preventDefault()
    setError('')

    if (!address.trim()) {
      setError('Адрес обязателен')
      return
    }
    if (!deliveryDate) {
      setError('Дата доставки обязательна')
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (new Date(deliveryDate) < today) {
      setError('Дата не может быть в прошлом')
      return
    }

    setLoading(true)
    try {
      await createOrder(user.id, address, deliveryDate)
      await clearCart()
      alert('Заказ оформлен!')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="cart">
      <h1 className="page-title">Корзина</h1>

      <div className="cart__list">
        {cart.map((item) => (
          <div key={item.id} className="cart__item">
            {item.image && (
              <img src={item.image} alt={item.name} className="cart__image" />
            )}
            <div className="cart__info">
              <h3 className="cart__name">{item.name}</h3>
              <p className="cart__meta">
                {Number(item.price).toLocaleString('ru-RU')} ₽ × {item.qty}
              </p>
            </div>
            <div className="cart__actions">
              <p className="cart__subtotal">
                {(Number(item.price) * item.qty).toLocaleString('ru-RU')} ₽
              </p>
              <button className="btn btn--remove" onClick={() => removeFromCart(item.id)}>
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart__total-block">
        <p className="cart__total">
          Итого: {Number(total).toLocaleString('ru-RU')} ₽
        </p>
        <button className="btn btn--clear" onClick={clearCart}>
          Очистить
        </button>
      </div>

      <form className="order-form" onSubmit={handleOrder}>
        <h2>Оформление заказа</h2>

        <div className="form__group">
          <label className="form__label">Адрес доставки</label>
          <input
            className="form__input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="г. Москва, ул. Ленина, д. 1"
          />
        </div>

        <div className="form__group">
          <label className="form__label">Дата доставки</label>
          <input
            className="form__input"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {error && <p className="form__error">{error}</p>}

        <button className="btn btn--add" type="submit" disabled={loading}>
          {loading ? 'Оформление...' : 'Оформить заказ'}
        </button>
      </form>
    </div>
  )
}