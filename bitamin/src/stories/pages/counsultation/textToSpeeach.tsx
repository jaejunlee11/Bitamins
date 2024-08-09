import axios from 'axios'

const API_KEY = import.meta.env.VITE_GOOGLE_KEY // 실제 Google Cloud API 키로 교체하세요.

export interface SynthesizeOptions {
  text: string
  languageCode?: string
  ssmlGender?: 'MALE' | 'FEMALE' | 'NEUTRAL'
}

export const synthesizeText = async (
  options: SynthesizeOptions
): Promise<string> => {
  const { text, languageCode = 'en-US', ssmlGender = 'NEUTRAL' } = options

  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        input: { text },
        voice: { languageCode, ssmlGender },
        audioConfig: { audioEncoding: 'MP3' },
      }
    )

    // 반환된 오디오 데이터를 base64 문자열로 반환
    return response.data.audioContent
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data)
    } else {
      console.error('Error message:', error.message)
    }
    throw error
  }
}
