import React, { useState, useEffect } from 'react';
import { fetchWeatherData, parseWeatherData, deg_to_dir, pyt_code, sky_code } from '@/utils/weather';
import '../../../styles/mission/App.css';

const App: React.FC = () => {
    const [weatherInfo, setWeatherInfo] = useState<{ [key: string]: any }>({});
    const [serviceKey, setServiceKey] = useState<string>(
        'aQ%2FKD9B2XVnmNv0SkIefiz7rV6Ccy78ElnPFBkXZLRQ7jBbpWfCIBnp16ZEHqHC24e%2FAiNSPdfFIl66DEGReng%3D%3D'
    );
    const [baseDate, setBaseDate] = useState<string>('');
    const [baseTime, setBaseTime] = useState<string>('');
    const [nx, setNx] = useState<string>('66');
    const [ny, setNy] = useState<string>('100');

    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0') + '00';

        setBaseDate(`${year}${month}${date}`);
        setBaseTime(`${hours}`);
    }, []);

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
        <div className="container">
            <h1>날씨 정보</h1>
            <div className="input-group">
                <label>서비스 키:</label>
                <input type="text" value={serviceKey} onChange={(e) => setServiceKey(e.target.value)} />
            </div>
            <div className="input-group">
                <label>발표 일자:</label>
                <input type="text" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} />
            </div>
            <div className="input-group">
                <label>발표 시간:</label>
                <input type="text" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} />
            </div>
            <div className="input-group">
                <label>X 좌표:</label>
                <input type="text" value={nx} onChange={(e) => setNx(e.target.value)} />
            </div>
            <div className="input-group">
                <label>Y 좌표:</label>
                <input type="text" value={ny} onChange={(e) => setNy(e.target.value)} />
            </div>
            <button onClick={getWeather}>날씨 가져오기</button>
            <div className="weather-info">
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

export default App;
