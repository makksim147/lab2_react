import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../api/api'

function Login() {
  const [email, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setError] = useState({})
  const [serveError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  if (user) {
    return <Navigate to='/dashboard' replace />
  }

  function validate() {
    const errs = {}
    if (!email) errs.email = 'Email обязательный'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Некорректный email"

    if (!password) errs.password = "Пароль обязатальный"
    else if (password < 8) errs.password = "Пароль должен быть больше 8 символов"

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setServerError('')

    const errs = validate()
    setError(errs)
    if (Object.keys(errs).length > 0) return

    setLoading(true)
    try {
      const userData = await apiLogin(email, password)
      setUser(userData)
      navigate('/dashboard')
    }
    catch (err) {
      setServerError(err.message)
    }
    finally {
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
            type="text"
            value={email}
            onChange={e => setLogin(e.target.value)}
            placeholder="example@gmail.com"
          />
          {errors.email && <p className='form_error'>{errors.email}</p>}
        </div>

        <div className="form__group">
          <label className="form__label">Пароль</label>
          <input
            className="form__input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
          {errors.password && <p className='form_error'>{errors.password}</p>}
        </div>

        {serveError && <p className='form_error'>{serveError}</p>}

        <button className="btn btn--add" type="submit" disabled={loading}>
          {loading ? 'Вход' : 'Войти'}
        </button>

        <p className="form__hint">
          Доступные аккаунты:<br />
          admin@gmail.com / admin123<br />
          user@gmail.com / user123
        </p>

        <p className="form__hint">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  )
}

export default Login