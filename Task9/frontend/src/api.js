import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const booksAPI = {
  getAll: (search = '') => api.get(`/books${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getOne: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
}

export const membersAPI = {
  getAll: (search = '') => api.get(`/members${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getOne: (id) => api.get(`/members/${id}`),
  create: (data) => api.post('/members', data),
  update: (id, data) => api.put(`/members/${id}`, data),
  delete: (id) => api.delete(`/members/${id}`),
}

export const issuesAPI = {
  getAll: () => api.get('/issues'),
  issue: (data) => api.post('/issues', data),
  return: (id) => api.post(`/issues/${id}/return`),
}

export const statsAPI = {
  get: () => api.get('/stats'),
}

export default api
