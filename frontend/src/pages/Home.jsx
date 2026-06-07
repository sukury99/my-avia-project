import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content fade-in">
          <p className="hero-subtitle">Премиальная авиация</p>
          <h1 className="hero-title">Частные самолёты<br />для особых моментов</h1>
          <p className="hero-desc">
            Выберите идеальный борт из нашего флота бизнес-джетов
            и забронируйте перелёт за несколько кликов.
          </p>
        </div>
      </section>

      <section className="fleet-chooser container">
        <h2 className="section-title">Выберите флот</h2>
        <p className="section-desc">12 бизнес-джетов на двух страницах каталога</p>

        <div className="fleet-chooser-grid">
          <Link to="/fleet/1" className="fleet-chooser-card fade-in">
            <div className="chooser-number">01</div>
            <h3>Лёгкие и средние джеты</h3>
            <p>Citation CJ3, Phenom 300E, HondaJet, Learjet 75, Pilatus PC-24, Gulfstream G280</p>
            <span className="chooser-link">Смотреть 6 самолётов →</span>
          </Link>

          <Link to="/fleet/2" className="fleet-chooser-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="chooser-number">02</div>
            <h3>Супер-средние и дальние</h3>
            <p>Challenger 350, Falcon 2000LXS, Praetor 600, Falcon 8X, Gulfstream G700, Citation X+</p>
            <span className="chooser-link">Смотреть 6 самолётов →</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
