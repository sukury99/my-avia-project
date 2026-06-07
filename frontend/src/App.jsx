import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Fleet from './pages/Fleet'
import Auth from './pages/Auth'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Admin from './pages/Admin'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fleet/:page" element={<Fleet />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}
