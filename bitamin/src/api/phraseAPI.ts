import axiosInstance from './axiosInstance.ts';
import axios from 'axios';

export const getPhrases = async () => {
  try {
    const response = await axiosInstance.get('/missions/phrases');
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

export const getMemberPhraseByDate = async (date: string) => {
  try {
    const response = await axiosInstance.get('/missions/phrases/recorded', {
      params: {
        date: date,
      },
    });
    return response.data;
  } catch (error) {
      if (axios.isAxiosError(error)) {
          if (error instanceof Error && (error as any).response?.status !== 500) {
              console.error('Error fetching record:', error);
          }
      } else {
          console.error('Unexpected error:', error);
      }
    throw error;
  }
};
