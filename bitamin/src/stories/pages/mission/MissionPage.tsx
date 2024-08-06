import React, { useState, useCallback } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import { format } from 'date-fns'
import ko from 'date-fns/locale/ko';
// @ts-ignore
import styles from '../../../styles/mission/quest2.module.css';
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/mission/custom-datepicker.css"; // 커스텀 CSS 파일
import {deg_to_dir, fetchWeatherData, parseWeatherData, pyt_code, sky_code } from '@/utils/weather';

// @ts-ignore
registerLocale('ko', ko);
setDefaultLocale('ko');

const MainQuestPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setSelectedDate(date)
            console.log(format(date, 'yyyy.MM.dd'))
        }
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
            <button onClick={decreaseMonth}>{"<"}</button>
            <span>{format(date, 'yyyy.MM')}</span>
            <button onClick={increaseMonth}>{">"}</button>
        </div>
    );

    const getDayClassName = (date: Date) => {
        const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
        const isOutsideCurrentMonth = date.getMonth() !== (selectedDate ? selectedDate.getMonth() : new Date().getMonth());

        if (isSelected) {
            return styles.selectedDay;
        } else if (isOutsideCurrentMonth) {
            return 'react-datepicker__day--outside-month';
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
        <div className={styles.calendarContainer}>
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
        </div>
    );
};

const App: React.FC = () => {
    const [weatherInfo, setWeatherInfo] = useState<{ [key: string]: any }>({});
    const [serviceKey, setServiceKey] = useState<string>(
        'aQ%2FKD9B2XVnmNv0SkIefiz7rV6Ccy78ElnPFBkXZLRQ7jBbpWfCIBnp16ZEHqHC24e%2FAiNSPdfFIl66DEGReng%3D%3D'
    );
    const [baseDate, setBaseDate] = useState<string>('20240805');
    const [baseTime, setBaseTime] = useState<string>('0500'); // 데이터가 포함된 발표 시간 설정
    const [nx, setNx] = useState<string>('66');
    const [ny, setNy] = useState<string>('100');

    const getWeather = async () => {
        try {
            const rawData = await fetchWeatherData(serviceKey, baseDate, baseTime, nx, ny);
            const parsedData = parseWeatherData(rawData);
            setWeatherInfo(parsedData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    return (
        <div className={styles.weatherContainer}>
            <h1>날씨 정보</h1>
            <div>
                <label>서비스 키:</label>
                <input type="text" value={serviceKey} onChange={(e) => setServiceKey(e.target.value)} />
            </div>
            <div>
                <label>발표 일자:</label>
                <input type="text" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />
            </div>
            <div>
                <label>발표 시간:</label>
                <input type="text" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} />
            </div>
            <div>
                <label>X 좌표:</label>
                <input type="text" value={nx} onChange={(e) => setNx(e.target.value)} />
            </div>
            <div>
                <label>Y 좌표:</label>
                <input type="text" value={ny} onChange={(e) => setNy(e.target.value)} />
            </div>
            <button className={styles.weatherButton} onClick={getWeather}>날씨 가져오기</button>
            <div>
                {Object.keys(weatherInfo).map((key) => {
                    const val = weatherInfo[key];
                    let template = `${key.slice(0, 4)}년 ${key.slice(4, 6)}월 ${key.slice(6, 8)}일 ${key.slice(8, 10)}시 ${key.slice(10, 12)}분 (${nx}, ${ny}) 지역의 날씨는 `;
                    if (val['SKY']) {
                        template += `${sky_code[Number(val['SKY'])]} `;
                    }
                    if (val['PTY']) {
                        template += `${pyt_code[Number(val['PTY'])]} `;
                        if (val['RN1'] !== '강수없음') {
                            template += `시간당 ${val['RN1']}mm `;
                        }
                    }
                    if (val['T1H']) {
                        template += `기온 ${val['T1H']}℃ `;
                    }
                    if (val['REH']) {
                        template += `습도 ${val['REH']}% `;
                    }
                    if (val['VEC'] && val['WSD']) {
                        template += `풍속 ${deg_to_dir(Number(val['VEC']))} 방향 ${val['WSD']}m/s`;
                    }
                    return <div key={key}>{template}</div>;
                })}
            </div>
        </div>
    );
};

const Frame: React.FC = () => {
    const onContainerClick = useCallback(() => {
        // Add your code here
    }, []);

    return (
        <div className={styles.bigContainer}>
            <div className={styles.div}>
                <div className={styles.navbar}>
                    <div className={styles.bitamin} onClick={onContainerClick}>BItAMin</div>
                    <div className={styles.parent8}>
                        <div className={styles.div95} onClick={onContainerClick}>
                            <div className={styles.wrapper42}>
                                <div className={styles.b}>상담</div>
                            </div>
                            <div className={styles.rectangleDiv}/>
                        </div>
                        <div className={styles.div97} onClick={onContainerClick}>
                            <div className={styles.wrapper42}>
                                <div className={styles.b}>미션</div>
                            </div>
                            <div className={styles.child1}/>
                        </div>
                        <div className={styles.div95} onClick={onContainerClick}>
                            <div className={styles.parent9}>
                                <div className={styles.b}>건강</div>
                                <div className={styles.upWrapper}>
                                    <div className={styles.up}>UP !</div>
                                </div>
                            </div>
                            <div className={styles.rectangleDiv}/>
                        </div>
                    </div>
                    <div className={styles.div101}>
                        <div className={styles.frameContainer}>
                            <div className={styles.personcircleParent}>
                                <img className={styles.personcircleIcon} alt="" src="PersonCircle.svg"/>
                                <div className={styles.frameParent1}>
                                    <div className={styles.wrapper44}>
                                        <div className={styles.div102}>
                      <span className={styles.txt}>
                        <span>김싸피</span>
                        <span className={styles.span}>
                          <span>{` `}</span>
                          <span className={styles.span1}>님</span>
                        </span>
                      </span>
                                        </div>
                                    </div>
                                    <div className={styles.vectorWrapper}>
                                        <img className={styles.vectorIcon1} alt="" src="Vector.svg"/>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.wrapper45} onClick={onContainerClick}>
                                <img className={styles.icon} alt="" src="쪽지 버튼.svg"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.child}/>
                <div className={styles.item}/>
                <div className={styles.div1} onClick={onContainerClick}>
                    <b className={styles.b}>작성</b>
                </div>
                <div className={styles.inner}>
                    <div className={styles.vectorParent}>
                        <img className={styles.frameChild} alt="" src="Vector 39.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 41.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 42.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 43.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 44.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 45.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 46.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 47.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 48.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 49.svg"/>
                        <img className={styles.frameChild} alt="" src="Vector 40.svg"/>
                    </div>
                </div>

                <div className={styles.customContainer}>
                    <MainQuestPage/>
                </div>

                <div className={styles.frameGroup}>
                    <div className={styles.parent6}>
                        <b className={styles.b}>25</b>
                        <div className={styles.div92}>일 미션</div>
                    </div>
                    <div className={styles.frameWrapper}>
                        <div className={styles.parent7}>
                            <div className={styles.div93}>산책하기</div>
                            <img className={styles.chevronLeftIcon} alt="" src="arrow-rotate-left-01.svg"/>
                        </div>
                    </div>
                </div>
                <div className={styles.inner1}>
                    <div className={styles.imageAddParent}>
                        <img className={styles.imageAddIcon} alt="" src="image-add.svg"/>
                        <div className={styles.div94}>사진을 첨부해주세요</div>
                    </div>
                </div>
                <img className={styles.frameIcon} alt="" src="Frame 448.png"/>

                {/* 새로운 App 컴포넌트 추가 */}
                <div className={styles.weatherContainer}>
                    <App/>
                </div>

            </div>
        </div>
    );
};

export default Frame;
