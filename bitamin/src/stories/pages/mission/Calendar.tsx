import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import styles from '/src/styles/mission/quest2.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import '/src/styles/mission/custom-datepicker.css';
import { fetchMonthMissionAndPhrase, fetchMissionsByDate } from '@/api/missionAPI';

// @ts-ignore
registerLocale('ko', ko);
setDefaultLocale('ko');

interface CalendarProps {
    onDateChange: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [loading, setLoading] = useState<boolean>(false);
    const [monthMissions, setMonthMissions] = useState<any[]>([]); // 초기값을 빈 배열로 설정

    const fetchMissionDate = async (date: Date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        try {
            setLoading(true);
            const data = await fetchMissionsByDate(formattedDate);
            const missionDate = new Date(data.completeDate);

            // 월간 미션 및 문구 데이터 가져오기
            const response = await fetchMonthMissionAndPhrase(formattedDate);
            const monthData = response.data;

            // monthMissions가 배열인지 확인하고 배열이 아닌 경우 빈 배열로 설정
            setMonthMissions(Array.isArray(monthData) ? monthData : []);

            setSelectedDate(date); // 초기 날짜 설정
        } catch (error) {
            console.error('Error fetching mission date:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        fetchMissionDate(today);
        onDateChange(today);
        return () => {
            setLoading(false); // 컴포넌트 언마운트 시 상태 업데이트 방지
        };
    }, []);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const correctedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
            setSelectedDate(correctedDate);
            onDateChange(correctedDate);
            fetchMissionDate(correctedDate); // 새로운 날짜 선택 시 미션 데이터 가져오기
        }
    };

    const handleMonthChange = async (date: Date) => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1); // 해당 달의 1일로 설정
        setSelectedDate(firstDayOfMonth);
        onDateChange(firstDayOfMonth);
        fetchMissionDate(firstDayOfMonth); // 해당 달의 1일에 대한 미션 데이터 가져오기
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
            <button
                className={styles.prevButton}
                onClick={() => {
                    decreaseMonth();
                    handleMonthChange(new Date(date.getFullYear(), date.getMonth() - 1)); // 이전 달로 이동 후 해당 달의 1일로 설정
                }}
            >
                {'<'}
            </button>
            <span className={styles.currentMonth}>{format(date, 'yyyy.MM')}</span>
            <button
                className={styles.nextButton}
                onClick={() => {
                    increaseMonth();
                    handleMonthChange(new Date(date.getFullYear(), date.getMonth() + 1)); // 다음 달로 이동 후 해당 달의 1일로 설정
                }}
            >
                {'>'}
            </button>
        </div>
    );

    const getDayClassName = (date: Date) => {
        let classNames = '';

        // 월간 미션 데이터에서 해당 날짜에 미션이나 문구가 있는지 확인
        const hasMission = monthMissions.some(mission =>
            new Date(mission.activityDate).toDateString() === date.toDateString() && mission.memberMissionId
        );
        const hasPhrase = monthMissions.some(mission =>
            new Date(mission.activityDate).toDateString() === date.toDateString() && mission.memberPhraseId
        );

        if (hasMission && !hasPhrase) {
            classNames += ' react-datepicker__day--mission'; // 미션만 있는 경우
        }
        if (hasPhrase && !hasMission) {
            classNames += ' react-datepicker__day--phrase'; // 문구만 있는 경우
        }
        if (hasPhrase && hasMission) {
            classNames += ' react-datepicker__day--phrase--mission'; // 미션과 문구가 모두 있는 경우
        }

        return classNames.trim();
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
                maxDate={new Date()} // 오늘 날짜 이후는 선택할 수 없게 설정
                renderCustomHeader={renderCustomHeader}
                calendarClassName={styles.customCalendar}
                dayClassName={getDayClassName}
                formatWeekDay={(day) => day.substr(0, 1)}
                weekDayClassName={getWeekDayClassName}
            />
            {loading && <p>로딩 중...</p>}
        </div>
    );
};

export default Calendar;
