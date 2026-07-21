import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

// Attach JWT to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- Auth ---
export const verifyWallet = (address, signature, message) =>
  api.post('/auth/verify', { address, signature, message })

// --- Tasks ---
export const getTasks    = ()           => api.get('/tasks')
export const createTask  = (data)       => api.post('/tasks', data)
export const updateTask  = (id, data)   => api.patch(`/tasks/${id}`, data)
export const deleteTask  = (id)         => api.delete(`/tasks/${id}`)

// --- Habits ---
export const getHabits       = ()     => api.get('/habits')
export const createHabit     = (data) => api.post('/habits', data)
export const toggleHabit     = (id)   => api.post(`/habits/${id}/toggle`)
export const deleteHabit     = (id)   => api.delete(`/habits/${id}`)

// --- Goals ---
export const getGoals    = ()         => api.get('/goals')
export const createGoal  = (data)     => api.post('/goals', data)
export const updateGoal  = (id, data) => api.patch(`/goals/${id}`, data)
export const deleteGoal  = (id)       => api.delete(`/goals/${id}`)

// --- Reflections ---
export const getReflections   = ()     => api.get('/reflections')
export const saveReflection   = (data) => api.post('/reflections', data)
