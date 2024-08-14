import React, { useState, useEffect } from 'react';
import { getExperience } from '@/api/missionAPI';
import axios from 'axios';
import styles from '/src/styles/mission/MissionPage.module.css';

import sunnyImg from '@/assets/weatherImage/sunny.png';
import blueCloudImg from '@/assets/weatherImage/blue_cloud.png';
import darkCloudImg from '@/assets/weatherImage/dark_cloud.png';
import rainyImg from '@/assets/weatherImage/rainy.png';
import snowImg from '@/assets/weatherImage/snow.png';

import sunnyBg from '@/assets/weatherImage/sunnybg.png';
import cloudyBg from '@/assets/weatherImage/cloudybg.png';
import rainyBg from '@/assets/weatherImage/rainbg.png';
import snowyBg from '@/assets/weatherImage/snowbg.png';
import blueCloudBg from '@/assets/weatherImage/bluecloudy.png';

const MyPlant: React.FC = () => {
  const [experience, setExperience] = useState<number | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [weatherSky, setWeatherSky] = useState<string | null>(null);
  const [weatherPty, setWeatherPty] = useState<string | null>(null);
  const [weatherImage, setWeatherImage] = useState<string | undefined>(undefined);
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined);
  const [tmp, setTmp] = useState<number | null>(null);
  const [pop, setPop] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateLevel = (experience: number) => {
      if (experience >= 0 && experience <= 450) return 0;
      if (experience >= 500 && experience <= 950) return 1;
      if (experience >= 1000 && experience <= 1450) return 2;
      if (experience >= 1500 && experience <= 1950) return 3;
      if (experience >= 2000 && experience <= 2450) return 4;
      if (experience >= 2500) return 5;
      return null; // 유효하지 않은 경험치일 경우
    };

    const fetchExperience = async () => {
      try {
        const response = await getExperience();
        if (response && response.data) {
          const exp = response.data.experience;
          setExperience(exp);
          setLevel(calculateLevel(exp));
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
      const API_URL = import.meta.env.VITE_APP_WEATHER_URL;

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
      const ServiceKey = import.meta.env.VITE_APP_WEATHER_KEY;
      try {
        const response = await axios.get(API_URL, {
          params: {
            ServiceKey:ServiceKey,
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
                    setBackgroundImage(sunnyBg);
                    break;
                  case '3':
                    setWeatherSky('구름많음');
                    setWeatherImage(blueCloudImg);
                    setBackgroundImage(blueCloudBg);
                    break;
                  case '4':
                    setWeatherSky('흐림');
                    setWeatherImage(darkCloudImg);
                    setBackgroundImage(cloudyBg);
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
                    setBackgroundImage(rainyBg);
                    break;
                  case '2':
                    setWeatherPty('비/눈');
                    setWeatherImage(rainyImg);
                    setBackgroundImage(rainyBg);
                    break;
                  case '3':
                    setWeatherPty('눈');
                    setWeatherImage(snowImg);
                    setBackgroundImage(snowyBg);
                    break;
                  case '4':
                    setWeatherPty('소나기');
                    setWeatherImage(rainyImg);
                    setBackgroundImage(rainyBg);
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
        }
      } catch (error) {
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className={styles.plantBox} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h3>내 식물의 경험치</h3>
      {experience !== null ? (
        <p>경험치: {experience}</p>
      ) : (
        <p>경험치를 불러오는 중...</p>
      )}
      {level !== null && <p>레벨: {level}</p>}
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
