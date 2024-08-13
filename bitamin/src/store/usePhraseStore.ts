import create from 'zustand';
import { getPhrases } from '@/api/phraseAPI';

interface PhraseState {
    phraseId: number | null;
    phraseContent: string;
    fetchPhrase: () => Promise<void>;
}

export const usePhraseStore = create<PhraseState>((set) => ({
    phraseId: null,
    phraseContent: '',

    fetchPhrase: async () => {
        const today = new Date().toISOString().split('T')[0];
        const savedDate = localStorage.getItem('phraseDate');
        const savedPhraseId = localStorage.getItem('phraseId');
        const savedPhraseContent = localStorage.getItem('phraseContent');

        if (savedDate === today && savedPhraseId && savedPhraseContent) {
            set({
                phraseId: Number(savedPhraseId),
                phraseContent: savedPhraseContent,
            });
        } else {
            try {
                const response = await getPhrases();
                if (response.success) {
                    set({
                        phraseId: response.data.id,
                        phraseContent: response.data.phraseContent,
                    });

                    localStorage.setItem('phraseDate', today);
                    localStorage.setItem('phraseId', response.data.id.toString());
                    localStorage.setItem('phraseContent', response.data.phraseContent);
                } else {
                    console.error('문구를 가져오는데 실패했습니다:', response.message);
                }
            } catch (error) {
                console.error('문구를 가져오는 중 오류 발생:', error);
            }
        }
    },
}));
