import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as apiRegister } from '../api/api'

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Валидация полей регистрации
  function validate() {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = 'Имя обязательно'
    if (!form.email) errs.email = 'Email обязателен'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Некорректный email'
    if (!form.password) errs.password = 'Пароль обязателен'
    else if (form.password.length < 5) errs.password = 'Минимум 5 символов'
    return errs
  }

  // Отправка формы регистрации
  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      await apiRegister(form.full_name, form.email, form.password, form.phone)
      navigate('/login')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <h1 className="page-title">Регистрация</h1>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label className="form__label">ФИО</label>
          <input
            className="form__input"
            type="text"
            value={form.full_name}
            onChange={(e) => update('full_name', e.target.value)}
            placeholder="Иванов Иван Иванович"
          />
          {errors.full_name && <p className="form__error">{errors.full_name}</p>}
        </div>

        <div className="form__group">
          <label className="form__label">Email</label>
          <input
            className="form__input"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="example@mail.ru"
          />
          {errors.email && <p className="form__error">{errors.email}</p>}
        </div>

        <div className="form__group">
          <label className="form__label">Телефон</label>
          <input
            className="form__input"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+79001234567"
          />
        </div>

        <div className="form__group">
          <label className="form__label">Пароль</label>
          <input
            className="form__input"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="минимум 5 символов"
          />
          {errors.password && <p className="form__error">{errors.password}</p>}
        </div>

        {serverError && <p className="form__error">{serverError}</p>}

        <button className="btn btn--add" type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="form__hint">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  )
}