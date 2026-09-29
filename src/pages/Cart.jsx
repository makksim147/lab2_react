import { useCart } from '../context/CartContext'

function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart()

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1 className="page-title">Корзина пуста</h1>
        <p className="empty-cart__text">Добавьте товары из каталога</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">Корзина</h1>

      <div className="cart">
        {cart.map((item, index) => (
          <div className="cart__item" key={index}>
            <img src={item.image} alt={item.name} className="cart__image" />
            <div className="cart__info">
              <p className="cart__name">{item.name}</p>
              <p className="cart__price">{item.price.toLocaleString()} руб.</p>
            </div>
            <button
              className="btn btn--remove"
              onClick={() => removeFromCart(index)}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>

      <div className="cart__footer">
        <p className="cart__total">Итого: {total.toLocaleString()} руб.</p>
        <button className="btn btn--clear" onClick={clearCart}>
          Очистить корзину
        </button>
      </div>
    </div>
  )
}

export default Cart