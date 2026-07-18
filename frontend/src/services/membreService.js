import api from './api'

export const membreService = {
  getAll: async () => {
    const response = await api.get('/membres')
    return response.data
  },

  create: async (membreData) => {
    const response = await api.post('/membres', membreData)
    return response.data
  },

  remove: async (id) => {
    await api.delete(`/membres/${id}`)
  },
  resetPassword: async (id) => {
    const response = await api.post(`/membres/${id}/reset-password`)
    return response.data
  },
}