import api from '../../../../새 폴더/녹음 저장 완료/bitamin/src/api/axiosInstance.ts';
import axiosInstance from '../../../../새 폴더/녹음 저장 완료/bitamin/src/api/axiosInstance.ts';

export const getPhrases = async () => {
  try {
    const response = await api.get('/missions/phrases');
    return response.data;
  } catch (error) {
    console.error('Error fetching the phrase:', error);
    throw error;
  }
};

export const saveAudio = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      '/missions/phrases',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting mission:', error);
    throw error;
  }
};
