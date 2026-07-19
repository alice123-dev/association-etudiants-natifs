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
  uploadPhoto: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/profil/photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}