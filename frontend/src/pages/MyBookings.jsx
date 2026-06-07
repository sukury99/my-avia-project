import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import './MyBookings.css'

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function MyBookings() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth')
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user) {
      api.getMyBookings()
        .then(setBookings)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (authLoading || loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">Мои бронирования</h1>
        <p className="page-subtitle">История ваших перелётов</p>

        {error && <p className="error-msg">{error}</p>}

        {bookings.length === 0 ? (
          <div className="empty-state fade-in">
            <span className="empty-icon">✈</span>
            <h3>Бронирований пока нет</h3>
            <p>Выберите самолёт из нашего флота и оформите первый перелёт</p>
            <Link to="/" className="btn btn-primary">Перейти к флоту</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, i) => (
              <div className="booking-item fade-in" key={booking.id} style={{ animationDelay: `${i * 0.08}s` }}>
                <img src={booking.airplane.image} alt={booking.airplane.name} className="booking-item-img" />
                <div className="booking-item-info">
                  <h3>{booking.airplane.name}</h3>
                  <p className="booking-item-date">
                    Дата вылета: <strong>{new Date(booking.departure_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                  </p>
                  <p className="booking-item-price">{formatPrice(booking.airplane.price)} / час</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
