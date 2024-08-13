import create from 'zustand';
import { getMission, substituteMission } from '@/api/missionAPI';

interface MissionData {
    id: number;
    missionName: string;
    missionDescription: string;
    missionLevel: number;
}

interface MissionState {
    mission: MissionData | null;
    substituteCount: number;
    fetchMission: () => Promise<void>;
    handleSubstituteMission: () => Promise<void>;
}

export const useMissionStore = create<MissionState>((set) => ({
    mission: null,
    substituteCount: 0,

    fetchMission: async () => {
        const today = new Date().toISOString().split('T')[0];
        const savedDate = localStorage.getItem('missionDate');
        const savedMission = localStorage.getItem('missionData');
        const savedSubstituteCount = localStorage.getItem('substituteCount');

        if (savedDate === today && savedMission) {
            set({
                mission: JSON.parse(savedMission),
                substituteCount: savedSubstituteCount ? parseInt(savedSubstituteCount, 10) : 0,
            });
        } else {
            try {
                const response = await getMission();
                if (response.success) {
                    set({ mission: response.data, substituteCount: 0 });

                    localStorage.setItem('missionDate', today);
                    localStorage.setItem('missionData', JSON.stringify(response.data));
                    localStorage.setItem('substituteCount', '0');
                } else {
                    console.error('미션을 가져오는데 실패했습니다:', response.message);
                }
            } catch (error) {
                console.error('미션을 가져오는 중 오류 발생:', error);
            }
        }
    },

    handleSubstituteMission: async () => {
        const { mission, substituteCount } = useMissionStore.getState();
        if (!mission || substituteCount >= 5) return;

        try {
            const response = await substituteMission(mission.id);
            if (response.success) {
                set((state) => ({
                    mission: response.data,
                    substituteCount: state.substituteCount + 1,
                }));

                localStorage.setItem('missionData', JSON.stringify(response.data));
                localStorage.setItem('substituteCount', (substituteCount + 1).toString());
            } else {
                console.error('미션 교체에 실패했습니다:', response.message);
            }
        } catch (error) {
            console.error('미션 교체 중 오류 발생:', error);
        }
    }
}));
