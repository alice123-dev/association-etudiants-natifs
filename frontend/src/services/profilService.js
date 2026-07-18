import api from './api'

export const profilService = {
  getProfil: async () => {
    const response = await api.get('/profil')
    return response.data
  },

  updateProfil: async (data) => {
    const response = await api.put('/profil', data)
    return response.data
  },

  changePassword: async (data) => {
    await api.put('/profil/mot-de-passe', data)
  },
}