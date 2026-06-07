import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../context/AuthContext'
import './Admin.css'

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [airplanes, setAirplanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ airplane_id: '', departure_date: '' })
  const [actionLoading, setActionLoading] = useState(null)

  const loadData = () => {
    setLoading(true)
    Promise.all([api.getAllBookings(), api.getAirplanes()])
      .then(([bookingsData, airplanesData]) => {
        setBookings(bookingsData)
        setAirplanes(airplanesData)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate('/auth')
      else if (!user.is_staff) navigate('/')
    }
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (user?.is_staff) loadData()
  }, [user])

  const startEdit = (booking) => {
    setEditingId(booking.id)
    setEditForm({
      airplane_id: String(booking.airplane.id),
      departure_date: booking.departure_date,
    })
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ airplane_id: '', departure_date: '' })
  }

  const handleSave = async (id) => {
    setActionLoading(id)
    setError('')
    try {
      const updated = await api.updateBooking(
        id,
        Number(editForm.airplane_id),
        editForm.departure_date,
      )
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)))
      cancelEdit()
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить это бронирование?')) return
    setActionLoading(id)
    setError('')
    try {
      await api.deleteBooking(id)
      setBookings((prev) => prev.filter((b) => b.id !== id))
      if (editingId === id) cancelEdit()
    } catch (e) {
      setError(e.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (authLoading || loading) return <div className="loading">Загрузка...</div>

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">Панель администратора</h1>
          <p className="page-subtitle">Все бронирования в системе</p>
          <div className="admin-stats">
            <div className="stat-card">
              <span className="stat-value">{bookings.length}</span>
              <span className="stat-label">Всего бронирований</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{new Set(bookings.map((b) => b.user.id)).size}</span>
              <span className="stat-label">Уникальных клиентов</span>
            </div>
          </div>
        </div>

        {error && <p className="error-msg admin-error">{error}</p>}

        {bookings.length === 0 ? (
          <div className="empty-state fade-in">
            <p>Бронирований пока нет</p>
          </div>
        ) : (
          <div className="admin-table-wrap fade-in">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Клиент</th>
                  <th>Самолёт</th>
                  <th>Дата вылета</th>
                  <th>Цена/час</th>
                  <th>Создано</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className={editingId === booking.id ? 'row-editing' : ''}>
                    <td className="td-id">#{booking.id}</td>
                    <td>
                      <span className="client-name">{booking.user.username}</span>
                    </td>
                    <td>
                      {editingId === booking.id ? (
                        <select
                          className="admin-select"
                          value={editForm.airplane_id}
                          onChange={(e) => setEditForm({ ...editForm, airplane_id: e.target.value })}
                        >
                          {airplanes.map((plane) => (
                            <option key={plane.id} value={plane.id}>{plane.name}</option>
                          ))}
                        </select>
                      ) : (
                        <div className="plane-cell">
                          <img src={booking.airplane.image} alt="" className="plane-thumb" />
                          {booking.airplane.name}
                        </div>
                      )}
                    </td>
                    <td className="td-date">
                      {editingId === booking.id ? (
                        <input
                          type="date"
                          className="admin-input"
                          value={editForm.departure_date}
                          onChange={(e) => setEditForm({ ...editForm, departure_date: e.target.value })}
                        />
                      ) : (
                        new Date(booking.departure_date).toLocaleDateString('ru-RU')
                      )}
                    </td>
                    <td className="td-price">
                      {editingId === booking.id
                        ? formatPrice(airplanes.find((p) => p.id === Number(editForm.airplane_id))?.price || booking.airplane.price)
                        : formatPrice(booking.airplane.price)}
                    </td>
                    <td className="td-muted">
                      {new Date(booking.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td>
                      <div className="admin-actions">
                        {editingId === booking.id ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSave(booking.id)}
                              disabled={actionLoading === booking.id}
                            >
                              {actionLoading === booking.id ? '...' : 'Сохранить'}
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={cancelEdit}>
                              Отмена
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="btn btn-outline btn-sm" onClick={() => startEdit(booking)}>
                              Изменить
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(booking.id)}
                              disabled={actionLoading === booking.id}
                            >
                              Удалить
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
