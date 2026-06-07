import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import './Booking.css'

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function Booking() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [airplane, setAirplane] = useState(null)
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.getAirplanes()
      .then((planes) => {
        const found = planes.find((p) => p.id === Number(id))
        if (!found) throw new Error('Самолёт не найден')
        setAirplane(found)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth')
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.createBooking(Number(id), date)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  if (loading || authLoading) return <div className="loading">Загрузка...</div>
  if (error && !airplane) return <div className="container" style={{ padding: 40 }}><p className="error-msg">{error}</p></div>

  if (success) {
    return (
      <div className="booking-page">
        <div className="booking-success fade-in">
          <div className="success-icon">✓</div>
          <h2>Бронирование оформлено!</h2>
          <p>Ваш перелёт на {airplane.name} запланирован на {new Date(date).toLocaleDateString('ru-RU')}</p>
          <div className="success-actions">
            <Link to="/my-bookings" className="btn btn-primary">Мои бронирования</Link>
            <Link to="/" className="btn btn-outline">На главную</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="container booking-layout fade-in">
        <div className="booking-preview">
          <img src={airplane.image} alt={airplane.name} />
          <div className="booking-preview-info">
            <h2>{airplane.name}</h2>
            <p className="booking-price">{formatPrice(airplane.price)} / час</p>
            <p className="booking-desc">{airplane.description}</p>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          <h2>Оформление бронирования</h2>
          <p className="booking-form-sub">Выберите дату вылета</p>

          <div className="form-group">
            <label>Дата вылета</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={minDate}
              required
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Оформление...' : 'Подтвердить бронирование'}
          </button>
        </form>
      </div>
    </div>
  )
}
