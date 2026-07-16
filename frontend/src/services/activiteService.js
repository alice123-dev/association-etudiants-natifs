import api from './api'

export const activiteService = {
  getAll: async () => {
    const response = await api.get('/activites')
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/activites', data)
    return response.data
  },

  update: async (id, data) => {
    const response = await api.put(`/activites/${id}`, data)
    return response.data
  },

  remove: async (id) => {
    await api.delete(`/activites/${id}`)
  },
}