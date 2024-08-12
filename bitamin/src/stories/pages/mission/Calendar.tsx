import React, { useState, useEffect } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko'
import styles from '/src/styles/mission/quest2.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import '/src/styles/mission/custom-datepicker.css'
import {
  fetchMonthMissionAndPhrase,
  fetchMissionsByDate,
} from '@/api/missionAPI'

// @ts-ignore
registerLocale('ko', ko)
setDefaultLocale('ko')

interface CalendarProps {
  onDateChange: (date: Date | null) => void
}

const Calendar: React.FC<CalendarProps> = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [missionDate, setMissionDate] = useState<Date | null>(null)
  const [todayMissionExists, setTodayMissionExists] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [monthMissions, setMonthMissions] = useState<any[]>([])

  const fetchMissionDate = async (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd')
    try {
      setLoading(true)
      const data = await fetchMissionsByDate(formattedDate)
      const missionDate = new Date(data.completeDate)
      setMissionDate(missionDate)
      const today = new Date().toISOString().split('T')[0]
      setTodayMissionExists(missionDate.toISOString().split('T')[0] === today)

      // 월간 미션 및 문구 데이터 가져오기
      const monthData = await fetchMonthMissionAndPhrase(formattedDate)
      setMonthMissions(monthData)
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
    onDateChange(today)
  }, [])

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const correctedDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      )
      setSelectedDate(correctedDate)
      setMissionDate(null)
      onDateChange(correctedDate)
    }
  }

  const handleMonthChange = async (date: Date) => {
    fetchMissionDate(date) // 기존 함수 호출

    try {
      setLoading(true)
      const formattedDate = format(date, 'yyyy-MM-dd')
      const monthData = await fetchMonthMissionAndPhrase(formattedDate)
      setMonthMissions(monthData)
    } catch (error) {
      console.error('Error fetching month missions:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderCustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
  }: {
    date: Date
    decreaseMonth: () => void
    increaseMonth: () => void
  }) => (
    <div className={styles.header}>
      <button
        className={styles.prevButton}
        onClick={() => {
          decreaseMonth()
          handleMonthChange(new Date(date.getFullYear(), date.getMonth() - 1)) // 이전 달로 이동
        }}
      >
        {'<'}
      </button>
      <span className={styles.currentMonth}>{format(date, 'yyyy.MM')}</span>
      <button
        className={styles.nextButton}
        onClick={() => {
          increaseMonth()
          handleMonthChange(new Date(date.getFullYear(), date.getMonth() + 1)) // 다음 달로 이동
        }}
      >
        {'>'}
      </button>
    </div>
  )

  const getDayClassName = (date: Date) => {
    const today = new Date()
    const isFutureDate = date > today

    const hasMission = monthMissions.some(
      (mission) =>
        new Date(mission.activityDate).toDateString() === date.toDateString() &&
        mission.memberMissionId
    )
    const hasPhrase = monthMissions.some(
      (mission) =>
        new Date(mission.activityDate).toDateString() === date.toDateString() &&
        mission.memberPhraseId
    )

    let classNames = ''

    if (isFutureDate) {
      classNames += ' react-datepicker__day--disabled'
    } else {
      if (hasMission && !hasPhrase) {
        classNames += ' react-datepicker__day--mission'
      }
      if (hasPhrase && !hasMission) {
        classNames += ' react-datepicker__day--phrase'
      }
      if (hasPhrase && hasMission) {
        classNames += ' react-datepicker__day--phrase--mission'
      }
    }

    return classNames
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

      {/* 월간 미션 및 문구 출력 */}
      {/*<div className={styles.missionList}>*/}
      {/*    {monthMissions.map((mission, index) => (*/}
      {/*        <div key={index} className={styles.missionItem}>*/}
      {/*            <p>미션 ID: {mission.memberMissionId}</p>*/}
      {/*            <p>문구 ID: {mission.memberPhraseId !== null ? mission.memberPhraseId : '문구 없음'}</p>*/}
      {/*            <p>활동 날짜: {mission.activityDate}</p>*/}
      {/*        </div>*/}
      {/*    ))}*/}
      {/*</div>*/}
    </div>
  )
}

export default Calendar
