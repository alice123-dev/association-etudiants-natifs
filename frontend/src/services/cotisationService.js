import api from './api'

export const cotisationService = {
  getAll: async () => {
    const response = await api.get('/cotisations')
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/cotisations', data)
    return response.data
  },

  remove: async (id) => {
    await api.delete(`/cotisations/${id}`)
  },

  getImpayes: async (periode) => {
    const response = await api.get('/cotisations/impayes', { params: { periode } })
    return response.data
  },
}