import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserOrders, updateProfile, changePassword } from '../api/api'

export default function Dashboard() {
  const { user, setUser, logout } = useAuth()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [profile, setProfile] = useState({
    full_name: user.full_name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
  })
  const [profileMsg, setProfileMsg] = useState('')

  const [passwords, setPasswords] = useState({ old: '', new: '' })
  const [passMsg, setPassMsg] = useState('')

  // Загрузка заказов пользователя
  useEffect(() => {
    getUserOrders(user.id)
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user.id])

  // Сохранение изменений профиля
  async function handleProfile(e) {
    e.preventDefault()
    setProfileMsg('')
    try {
      const updated = await updateProfile(user.id, profile)
      setUser({ ...user, ...updated })
      setProfileMsg('Профиль обновлён')
    } catch (err) {
      setProfileMsg(err.message)
    }
  }

  // Смена пароля пользователя
  async function handlePassword(e) {
    e.preventDefault()
    setPassMsg('')
    try {
      await changePassword(user.id, passwords.old, passwords.new)
      setPassMsg('Пароль изменён')
      setPasswords({ old: '', new: '' })
    } catch (err) {
      setPassMsg(err.message)
    }
  }

  return (
    <div className="dashboard">
      <h1 className="page-title">Личный кабинет</h1>

      <section className="dash-section">
        <h2>Мои заказы</h2>
        {loading && <p className="status">Загрузка...</p>}
        {error && <p className="form__error">{error}</p>}
        {!loading && orders.length === 0 && <p className="status">Заказов пока нет</p>}

        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card__head">
              <span>Заказ #{order.id}</span>
              <span className={`order-status order-status--${order.status}`}>
                {order.status}
              </span>
            </div>
            <p>Адрес: {order.address}</p>
            <p>Дата доставки: {new Date(order.delivery_date).toLocaleDateString('ru-RU')}</p>
            <p>Сумма: {Number(order.total).toLocaleString('ru-RU')} ₽</p>
            <ul className="order-card__items">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.service_name} × {item.qty} — {Number(item.price).toLocaleString('ru-RU')} ₽
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="dash-section">
        <h2>Профиль</h2>
        <form className="login__form" onSubmit={handleProfile}>
          <div className="form__group">
            <label className="form__label">ФИО</label>
            <input
              className="form__input"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </div>
          <div className="form__group">
            <label className="form__label">Email</label>
            <input
              className="form__input"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="form__group">
            <label className="form__label">Телефон</label>
            <input
              className="form__input"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="form__group">
            <label className="form__label">Адрес по умолчанию</label>
            <input
              className="form__input"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
          {profileMsg && <p className="form__hint">{profileMsg}</p>}
          <button className="btn btn--add" type="submit">Сохранить</button>
        </form>
      </section>

      <section className="dash-section">
        <h2>Смена пароля</h2>
        <form className="login__form" onSubmit={handlePassword}>
          <div className="form__group">
            <label className="form__label">Старый пароль</label>
            <input
              className="form__input"
              type="password"
              value={passwords.old}
              onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
            />
          </div>
          <div className="form__group">
            <label className="form__label">Новый пароль</label>
            <input
              className="form__input"
              type="password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
          </div>
          {passMsg && <p className="form__hint">{passMsg}</p>}
          <button className="btn btn--add" type="submit">Сменить пароль</button>
        </form>
      </section>

      <button className="btn btn--clear" onClick={logout}>Выйти</button>
    </div>
  )
}