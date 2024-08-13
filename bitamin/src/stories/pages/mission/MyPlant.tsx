import React, { useState, useEffect } from 'react';
import { getExperience } from '@/api/missionAPI';
import axios from 'axios';
import styles from '/src/styles/mission/MissionPage.module.css';

import sunnyImg from '@/assets/weatherImage/sunny.png';
import blueCloudImg from '@/assets/weatherImage/blue_cloud.png';
import darkCloudImg from '@/assets/weatherImage/dark_cloud.png';
import rainyImg from '@/assets/weatherImage/rainy.png';
import snowImg from '@/assets/weatherImage/snow.png';

const MyPlant: React.FC = () => {
    const [experience, setExperience] = useState<number | null>(null);
    const [weatherSky, setWeatherSky] = useState<string | null>(null);
    const [weatherPty, setWeatherPty] = useState<string | null>(null);
    const [weatherImage, setWeatherImage] = useState<string | undefined>(undefined);
    const [tmp, setTmp] = useState<number | null>(null);
    const [pop, setPop] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await getExperience();
                if (response && response.data) {
                    setExperience(response.data.experience);
                } else {
                    console.error('Invalid response structure:', response);
                }
            } catch (error) {
                console.error('Error fetching experience:', error);
            }
        };

        fetchExperience();
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const API_URL = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`;

            const today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let day = today.getDate();
            // @ts-ignore
            month = month < 10 ? `0${month}` : month;
            // @ts-ignore
            day = day < 10 ? `0${day}` : day;
            const todayStr = `${year}${month}${day}`;

            const times = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

            const getClosestTime = () => {
                const now = today.getHours() * 100 + today.getMinutes();
                return times.reduce((prev, curr) => Math.abs(Number(curr) - now) < Math.abs(Number(prev) - now) ? curr : prev);
            };

            const closestTime = getClosestTime();

            try {
                const response = await axios.get(API_URL, {
                    params: {
                        ServiceKey: 'aQ/KD9B2XVnmNv0SkIefiz7rV6Ccy78ElnPFBkXZLRQ7jBbpWfCIBnp16ZEHqHC24e/AiNSPdfFIl66DEGReng==',
                        dataType: 'JSON',
                        base_date: todayStr,
                        base_time: closestTime,
                        numOfRows: 15,
                        nx: 66, // 예제 위치
                        ny: 100, // 예제 위치
                    },
                    responseType: 'json',
                });

                if (response.data.response?.body?.items?.item) {
                    const data = response.data.response.body.items.item;
                    data.forEach((item: any) => {
                        switch (item.category) {
                            case 'TMP':
                                setTmp(Number(item.fcstValue));
                                break;
                            case 'SKY':
                                switch (item.fcstValue) {
                                    case '1':
                                        setWeatherSky('맑음');
                                        setWeatherImage(sunnyImg);
                                        break;
                                    case '3':
                                        setWeatherSky('구름많음');
                                        setWeatherImage(blueCloudImg);
                                        break;
                                    case '4':
                                        setWeatherSky('흐림');
                                        setWeatherImage(darkCloudImg);
                                        break;
                                }
                                break;
                            case 'PTY':
                                switch (item.fcstValue) {
                                    case '0':
                                        setWeatherPty('없음');
                                        break;
                                    case '1':
                                        setWeatherPty('비');
                                        setWeatherImage(rainyImg);
                                        break;
                                    case '2':
                                        setWeatherPty('비/눈');
                                        setWeatherImage(rainyImg);
                                        break;
                                    case '3':
                                        setWeatherPty('눈');
                                        setWeatherImage(snowImg);
                                        break;
                                    case '4':
                                        setWeatherPty('소나기');
                                        setWeatherImage(rainyImg);
                                        break;
                                    default:
                                        setWeatherPty('알 수 없음');
                                }
                                break;
                            case 'POP':
                                setPop(Number(item.fcstValue));
                                break;
                        }
                    });
                } else {
                    setError('API 응답에 문제가 있습니다.');
                }
            } catch (error) {
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchWeatherData();
    }, []);

    return (
        <div className={styles.plantBox}>
            <h3>내 식물의 경험치</h3>
            {experience !== null ? (
                <p>경험치: {experience}</p>
            ) : (
                <p>경험치를 불러오는 중...</p>
            )}
            {weatherSky && <p>하늘 상태: {weatherSky}</p>}
            {weatherPty && <p>강수 형태: {weatherPty}</p>}
            {weatherImage && <img src={weatherImage} alt="weather icon" className={styles.weatherImage} />}
            {tmp !== null && <p>기온: {tmp}℃</p>}
            <p>강수확률: {pop}%</p>
            {error && <p className={styles.error}>오류: {error}</p>}
        </div>
    );
};

export default MyPlant;
