const API_URL = import.meta.env.VITE_API_URL || 'http://31.129.106.22:8000/api'

function getToken() {
  return localStorage.getItem('token') || ''
}

function setToken(token) {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || data?.detail || 'Ошибка запроса')
  }

  return data
}

export const api = {
  register: async (username, password, email = '') => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    })
    setToken(data.token)
    return data
  },

  login: async (username, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    setToken(data.token)
    return data
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' })
    } finally {
      setToken('')
    }
  },

  me: () => request('/auth/me'),

  getAirplanes: (fleet) => {
    const query = fleet ? `?fleet=${fleet}` : ''
    return request(`/airplanes${query}`)
  },

  createBooking: (airplane_id, departure_date) =>
    request('/bookings', {
      method: 'POST',
      body: JSON.stringify({ airplane_id, departure_date }),
    }),

  getMyBookings: () => request('/bookings/my'),

  getAllBookings: () => request('/bookings/all'),

  updateBooking: (id, airplane_id, departure_date) =>
    request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ airplane_id, departure_date }),
    }),

  deleteBooking: (id) =>
    request(`/bookings/${id}`, { method: 'DELETE' }),
}
