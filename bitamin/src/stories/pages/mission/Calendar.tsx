import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import styles from '/src/styles/mission/quest2.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import '/src/styles/mission/custom-datepicker.css'
import { fetchMissionDatesByMonth, fetchMissionsByDate } from '@/api/missionAPI'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
registerLocale('ko', ko)
setDefaultLocale('ko')

interface CalendarProps {
  onDateChange: (date: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [missionDate, setMissionDate] = useState<Date | null>(null)
  const [todayMissionExists, setTodayMissionExists] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchMissionDate = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd') // 일까지 포함한 형식으로 변경
    try {
      setLoading(true)
      const data = await fetchMissionsByDate(formattedDate)
      const missionDate = new Date(data.completeDate)
      setMissionDate(missionDate)
      const today = new Date().toISOString().split('T')[0]
      setTodayMissionExists(missionDate.toISOString().split('T')[0] === today)
    } catch (error) {
      console.error('Error fetching mission date:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const today = new Date()
    setSelectedDate(today)
    fetchMissionDate(today)
    onDateChange(today) // 페이지 로드 시 오늘 날짜를 선택된 상태로 설정
  }, [])

  const handleDateChange = (date: Date | null) => {
    if (date) {
      // 선택된 날짜를 UTC 시간으로 설정하여 하루 전날짜가 되는 문제를 해결
      const correctedDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      setSelectedDate(correctedDate)
      setMissionDate(null) // 상태 초기화
      onDateChange(correctedDate)
    }
  }

  const handleMonthChange = (date: Date) => {
    fetchMissionDate(date)
  }

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
      <button onClick={() => {
        decreaseMonth()
        handleMonthChange(date)
      }}>{'<'}</button>
      <span>{format(date, 'yyyy.MM')}</span>
      <button onClick={() => {
        increaseMonth()
        handleMonthChange(date)
      }}>{'>'}</button>
    </div>
  )

  const getDayClassName = (date: Date) => {
    const isSelected = selectedDate && date.getTime() === selectedDate.getTime()
    const isOutsideCurrentMonth = date.getMonth() !== (selectedDate ? selectedDate.getMonth() : new Date().getMonth())
    const hasMission = missionDate && missionDate.toDateString() === date.toDateString()
    const isFutureDate = date > new Date()

    if (isFutureDate) {
      return styles.disabledDay
    } else if (isSelected) {
      return styles.selectedDay
    } else if (isOutsideCurrentMonth) {
      return 'react-datepicker__day--outside-month'
    } else if (hasMission) {
      return styles.hasMission
    }
    return ''
  }

  const getWeekDayClassName = (date: Date) => {
    const day = date.getDay()
    if (day === 0) {
      return styles.sunday
    } else if (day === 6) {
      return styles.saturday
    }
    return ''
  }

  const filterDate = (date: Date) => {
    const today = new Date()
    return date <= today
  }

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
        filterDate={filterDate}
        formatWeekDay={(day) => day.substr(0, 1)}
        weekDayClassName={getWeekDayClassName}
      />
      {loading && <p>로딩 중...</p>}
    </div>
  )
}

export default Calendar
