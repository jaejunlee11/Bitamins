import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import styles from '../../../styles/mission/quest2.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../styles/mission/custom-datepicker.css';
import { fetchMissionsByDate, fetchRecordedPhrasesByDate, fetchMissionDatesByMonth } from '@/api/missionAPI';
import MissionForm from './MissionForm'; // 새 컴포넌트 import

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
registerLocale('ko', ko);
setDefaultLocale('ko');

const Calendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [missionData, setMissionData] = useState<any>(null);
    const [recordedPhrasesData, setRecordedPhrasesData] = useState<any>(null);
    const [missionDates, setMissionDates] = useState<Date[]>([]);
    const [todayMissionExists, setTodayMissionExists] = useState<boolean>(true);

    const fetchMissionDates = async (date: Date) => {
        const formattedDate = format(date, 'yyyyMM');
        try {
            const data = await fetchMissionDatesByMonth(formattedDate);
            const dates = data.map((dateString: string) => new Date(dateString));
            setMissionDates(dates);
            const today = new Date().toISOString().split('T')[0];
            setTodayMissionExists(dates.some((missionDate: { toISOString: () => string; }) => missionDate.toISOString().split('T')[0] === today));
        } catch (error) {
            console.error('Error fetching mission dates:', error);
        }
    };

    useEffect(() => {
        const today = new Date();
        fetchMissionDates(today);
    }, []);

    const handleDateChange = async (date: Date | null) => {
        if (date) {
            setSelectedDate(date);
            const formattedDate = format(date, 'yyyyMMdd');
            console.log(formattedDate);

            try {
                const missionData = await fetchMissionsByDate(formattedDate);
                setMissionData(missionData);
                console.log(missionData);

                const recordedPhrasesData = await fetchRecordedPhrasesByDate(formattedDate);
                setRecordedPhrasesData(recordedPhrasesData);
                console.log(recordedPhrasesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleMonthChange = (date: Date) => {
        fetchMissionDates(date);
    };

    const renderCustomHeader = ({
                                    date,
                                    decreaseMonth,
                                    increaseMonth,
                                }: {
        date: Date;
        decreaseMonth: () => void;
        increaseMonth: () => void;
    }) => (
        <div className={styles.header}>
            <button onClick={() => { decreaseMonth(); handleMonthChange(date); }}>{"<"}</button>
            <span>{format(date, 'yyyy.MM')}</span>
            <button onClick={() => { increaseMonth(); handleMonthChange(date); }}>{">"}</button>
        </div>
    );

    const getDayClassName = (date: Date) => {
        const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
        const isOutsideCurrentMonth = date.getMonth() !== (selectedDate ? selectedDate.getMonth() : new Date().getMonth());
        const hasMission = missionDates.some(missionDate => missionDate.toDateString() === date.toDateString());

        if (isSelected) {
            return styles.selectedDay;
        } else if (isOutsideCurrentMonth) {
            return 'react-datepicker__day--outside-month';
        } else if (hasMission) {
            return styles.hasMission;
        }
        return '';
    };

    const getWeekDayClassName = (date: Date) => {
        const day = date.getDay();
        if (day === 0) {
            return styles.sunday;
        } else if (day === 6) {
            return styles.saturday;
        }
        return '';
    };

    return (
        <div className={styles.calendarContainer} style={{ zIndex: 1000 }}>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                locale="ko"
                renderCustomHeader={renderCustomHeader}
                calendarClassName={styles.customCalendar}
                dayClassName={getDayClassName}
                formatWeekDay={(day) => day.substr(0, 1)}
                weekDayClassName={getWeekDayClassName}
            />
            {!todayMissionExists && (
                <MissionForm onSubmit={() => fetchMissionDates(new Date())} />
            )}
            {missionData && (
                <div className={styles.missionDataContainer}>
                    <h3>미션 데이터</h3>
                    {/* 미션테이블에서 아이디로 mission_name도 받아와서 출력해야함 */}
                    <p>미션 ID: {missionData.id}</p>
                    <p>사용자 ID: {missionData.userId}</p>
                    <p>미션 ID: {missionData.missionId}</p>
                    <p>완료 날짜: {missionData.completeDate}</p>
                    <p>미션 키: {missionData.missionKey}</p>
                    <p>미션 URL: <a href={missionData.missionUrl} target="_blank" rel="noopener noreferrer">{missionData.missionUrl}</a></p>
                    <p>미션 리뷰: {missionData.missionReview}</p>
                    <img src={missionData.missionUrl} alt="Mission" />
                </div>
            )}
            {recordedPhrasesData && (
                <div className={styles.recordedPhrasesDataContainer}>
                    <h3>녹음된 구문 데이터</h3>
                    <p>기록 키: {recordedPhrasesData.recordKey}</p>
                    <p>기록 URL: <a href={recordedPhrasesData.recordUrl} target="_blank" rel="noopener noreferrer">{recordedPhrasesData.recordUrl}</a></p>
                    <audio controls>
                        <source src={recordedPhrasesData.recordUrl} type="audio/mpeg" />
                        {/* 만약 안되면 브라우저에서 지원x 표시 */}
                    </audio>
                </div>
            )}
        </div>
    );
};

export default Calendar;
