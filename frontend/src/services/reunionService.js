import api from './api'

export const reunionService = {
  getAll: async () => {
    const response = await api.get('/reunions')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/reunions/${id}`)
    return response.data
  },

  create: async (data) => {
    const response = await api.post('/reunions', data)
    return response.data
  },

  updatePresence: async (participantId, present) => {
    await api.patch(`/reunions/participants/${participantId}/presence`, { present })
  },

  remove: async (id) => {
    await api.delete(`/reunions/${id}`)
  },
}