import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await register(username, password, email)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-header">
          <span className="auth-icon">✈</span>
          <h1>{isLogin ? 'Вход' : 'Регистрация'}</h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Войдите, чтобы бронировать самолёты'
              : 'Создайте аккаунт для бронирования'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          )}

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError('') }}>
            {isLogin ? ' Зарегистрироваться' : ' Войти'}
          </button>
        </p>
      </div>
    </div>
  )
}
