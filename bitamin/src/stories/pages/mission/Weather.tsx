import React, { useState } from 'react';
import { deg_to_dir, fetchWeatherData, parseWeatherData, pyt_code, sky_code } from '@/utils/weather';
// @ts-ignore
import styles from '../../../styles/mission/quest2.module.css';

const Weather: React.FC = () => {
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

export default Weather;
