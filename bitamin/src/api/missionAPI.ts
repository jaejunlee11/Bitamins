// src/api/phrasesApi.ts
import api from './axiosInstance'

export const getPhrases = async () => {
  try {
    const response = await api.get('/missions/phrases')
    return response.data
  } catch (error) {
    console.error('Error fetching the phrase:', error)
    throw error
  }
}

export const saveAudio = async (id: string, audioBlob: Blob) => {
  const formData = new FormData()
  formData.append('id', id)
  formData.append('audio', audioBlob, 'recording.mp3')

  try {
    const response = await api.post('/missions/phrases', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error saving the audio:', error)
    throw error
  }
}
