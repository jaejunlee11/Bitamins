import axiosInstance from '../../../../새 폴더/경험치까지/src/api/axiosInstance.ts';

const BASE_URL = 'https://i11b105.p.ssafy.io/api';

export const fetchMissionsByDate = async (completeDate: string) => {
  try {
    const response = await axiosInstance.get('/missions/completed', {
      params: { date: completeDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching missions:', error);
    // @ts-ignore
    if (error.response) {
      // @ts-ignore
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// 해당 월의 미션이 기록된 날짜 목록 가져오기
export const fetchMissionDatesByMonth = async (date: string) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/missions/month`, {
        params: { date }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching mission dates:', error);
    throw error;
  }
};

// 미션 제출하기
export const submitMission = async (missionData: FormData) => {
  try {
    const response = await axiosInstance.post(
      '/missions',
      missionData,
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

// 오늘의 미션 조회
export const fetchTodayMission = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todays mission:', error);
    throw error;
  }
};

// 미션 교체하기
export const substituteMission = async (missionId: number) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/substitute`, {
      params: { missionId }
    });
    return response.data;
  } catch (error) {
    console.error('Error substituting mission:', error);
    throw error;
  }
};

// 오늘의 문구 가져오기
export const fetchAllPhrases = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/missions/phrases`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all phrases:', error);
    throw error;
  }
};

// 경험치
export const getExperience = async () => {
  try {
    const response = await axiosInstance.get('/missions/plant');
    return response.data;
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw error;
  }
};