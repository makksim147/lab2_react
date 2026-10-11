import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { login as apiLogin } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  if (user) return <Navigate to="/dashboard" replace />

  // Валидация формы перед отправкой
  function validate() {
    const errs = {}
    if (!email) errs.email = 'Email обязателен'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Некорректный email'
    if (!password) errs.password = 'Пароль обязателен'
    return errs
  }

  // Отправка формы логина
  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const userData = await apiLogin(email, password)
      setUser(userData)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <h1 className="page-title">Вход</h1>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label className="form__label">Email</label>
          <input
            className="form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@mail.ru"
          />
          {errors.email && <p className="form__error">{errors.email}</p>}
        </div>

        <div className="form__group">
          <label className="form__label">Пароль</label>
          <input
            className="form__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
          />
          {errors.password && <p className="form__error">{errors.password}</p>}
        </div>

        {serverError && <p className="form__error">{serverError}</p>}

        <button className="btn btn--add" type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>

        <p className="form__hint">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  )
}