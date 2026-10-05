import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  function validate() {
    const errs = {}
    if (!email) errs.email = 'Email обязателен'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Некорректный email'

    if (!password) errs.password = 'Пароль обязателен'
    else if (password.length < 5) errs.password = 'Минимум 5 символов'

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка регистрации')

      // После успешной регистрации — на логин
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
          <label className="form__label">Email</label>
          <input
            className="form__input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@mail.ru"
          />
          {errors.email && <p className="form__error">{errors.email}</p>}
        </div>

        <div className="form__group">
          <label className="form__label">Пароль</label>
          <input
            className="form__input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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