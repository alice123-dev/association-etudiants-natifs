import api from './api'

export const annonceService = {
  getAll: async () => {
    const response = await api.get('/annonces')
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/annonces', data)
    return response.data
  },

  remove: async (id) => {
    await api.delete(`/annonces/${id}`)
  },
}