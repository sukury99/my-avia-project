import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import './Fleet.css'

const FLEET_INFO = {
  1: {
    title: 'Лёгкие и средние джеты',
    subtitle: 'Идеально для региональных и средних маршрутов',
  },
  2: {
    title: 'Супер-средние и дальние джеты',
    subtitle: 'Максимальный комфорт для длинных перелётов',
  },
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}

export default function Fleet() {
  const { page } = useParams()
  const fleetPage = Number(page)
  const info = FLEET_INFO[fleetPage] || FLEET_INFO[1]

  const [airplanes, setAirplanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.getAirplanes(fleetPage)
      .then(setAirplanes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [fleetPage])

  return (
    <div className="fleet-page">
      <section className="fleet-hero">
        <div className="container fleet-hero-content fade-in">
          <p className="fleet-hero-label">Флот — страница {fleetPage}</p>
          <h1 className="fleet-hero-title">{info.title}</h1>
          <p className="fleet-hero-desc">{info.subtitle}</p>
          <div className="fleet-tabs">
            <Link to="/fleet/1" className={`fleet-tab ${fleetPage === 1 ? 'active' : ''}`}>
              Страница 1
            </Link>
            <Link to="/fleet/2" className={`fleet-tab ${fleetPage === 2 ? 'active' : ''}`}>
              Страница 2
            </Link>
          </div>
        </div>
      </section>

      <section className="container fleet-section">
        {loading && <div className="loading">Загрузка флота...</div>}
        {error && <p className="error-msg">{error}</p>}

        <div className="airplane-grid">
          {airplanes.map((plane, i) => (
            <div className="airplane-card fade-in" key={plane.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="airplane-image-wrap">
                <img src={plane.image} alt={plane.name} className="airplane-image" />
                <div className="airplane-price-badge">{formatPrice(plane.price)}/час</div>
              </div>
              <div className="airplane-info">
                <h3 className="airplane-name">{plane.name}</h3>
                <p className="airplane-desc">{plane.description}</p>
                <Link to={`/booking/${plane.id}`} className="btn btn-primary airplane-btn">
                  Забронировать
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
