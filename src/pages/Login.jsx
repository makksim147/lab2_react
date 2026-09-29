import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user, loginUser } = useAuth()

  if (user) {
    return <Navigate to='/dashboard' replace />
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const success = loginUser(login, password)

    if (success) {
      navigate('/dashboard')
    } else {
      setError('Неверный логин или пароль')
    }
  }

  return (
    <div className="login">
      <h1 className="page-title">Вход</h1>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="form__group">
          <label className="form__label">Логин</label>
          <input
            className="form__input"
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="Введите логин"
          />
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
        </div>

        {error && <p className="form__error">{error}</p>}

        <button className="btn btn--add" type="submit">
          Войти
        </button>

        <p className="form__hint">
          Доступные аккаунты:<br />
          admin / admin123<br />
          user / user123
        </p>
      </form>
    </div>
  )
}

export default Login