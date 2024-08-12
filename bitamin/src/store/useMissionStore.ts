import create from 'zustand';

interface Mission {
    id: number;
    missionName: string;
    missionDescription: string;
    missionLevel: number;
}

interface MissionState {
    mission: Mission | null;
    substitutionCount: number;
    lastSubstitutionDate: string;
    setMission: (mission: Mission) => void;
    increaseSubstitutionCount: () => void;
    resetSubstitutionCount: () => void;
    resetMissionIfNewDay: () => void;
}

const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const useMissionStore = create<MissionState>((set) => ({
    mission: JSON.parse(localStorage.getItem('mission') || 'null'),
    substitutionCount: parseInt(localStorage.getItem('substitutionCount') || '0', 10),
    lastSubstitutionDate: localStorage.getItem('lastSubstitutionDate') || getCurrentDate(),
    setMission: (mission) => {
        localStorage.setItem('mission', JSON.stringify(mission));
        set({ mission });
    },
    increaseSubstitutionCount: () => {
        const currentDate = getCurrentDate();
        set((state) => {
            const newCount = state.lastSubstitutionDate === currentDate
                ? state.substitutionCount + 1
                : 1;

            localStorage.setItem('substitutionCount', newCount.toString());
            localStorage.setItem('lastSubstitutionDate', currentDate);

            return {
                substitutionCount: newCount,
                lastSubstitutionDate: currentDate,
            };
        });
    },
    resetSubstitutionCount: () => {
        localStorage.removeItem('substitutionCount');
        localStorage.removeItem('lastSubstitutionDate');
        set({ substitutionCount: 0, lastSubstitutionDate: getCurrentDate() });
    },
    resetMissionIfNewDay: () => {
        const currentDate = getCurrentDate();
        if (localStorage.getItem('lastSubstitutionDate') !== currentDate) {
            localStorage.removeItem('mission');
            set({ mission: null, lastSubstitutionDate: currentDate, substitutionCount: 0 });
        }
    },
}));

export default useMissionStore;
