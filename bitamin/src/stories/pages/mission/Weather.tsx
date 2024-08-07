import React, { useEffect, useState } from 'react';
import axios from 'axios';

// 이미지 파일을 import합니다.
import sunnyImg from 'C:/Users/SSAFY/Desktop/S11P12B105/bitamin/src/assets/missionImage/sunny.png';
import blueCloudImg from 'C:/Users/SSAFY/Desktop/S11P12B105/bitamin/src/assets/missionImage/blue_cloud.png';
import darkCloudImg from 'C:/Users/SSAFY/Desktop/S11P12B105/bitamin/src/assets/missionImage/dark_cloud.png';
import rainyImg from 'C:/Users/SSAFY/Desktop/S11P12B105/bitamin/src/assets/missionImage/rainy.png';
import snowImg from 'C:/Users/SSAFY/Desktop/S11P12B105/bitamin/src/assets/missionImage/snow.png';

const WeatherInfo: React.FC = () => {
  const [tmp, setTmp] = useState<number | null>(null);
  const [sky, setSky] = useState<string | null>(null);
  const [pty, setPty] = useState<string | null>(null);
  const [pop, setPop] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    console.log(todayStr);

    const times = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

    // 현재 시간에서 가장 가까운 발표 시간을 찾는 함수
    const getClosestTime = () => {
      const now = today.getHours() * 100 + today.getMinutes();
      return times.reduce((prev, curr) => Math.abs(Number(curr) - now) < Math.abs(Number(prev) - now) ? curr : prev);
    };

    const closestTime = getClosestTime();
    console.log(`Closest Time: ${closestTime}`);

    axios
      .get(API_URL, {
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
      })
      .then((response) => {
        console.log(`API Response for time ${closestTime}:`, response);
        if (response.data.response?.body?.items?.item) {
          const data = response.data.response.body.items.item;
          console.log(`Parsed Data for time ${closestTime}:`, data);
          data.forEach((item: any) => {
            switch (item.category) {
              case 'TMP':
                setTmp(Number(item.fcstValue));
                break;
              case 'SKY':
                switch (item.fcstValue) {
                  case '1':
                    setSky('맑음');
                    break;
                  case '3':
                    setSky('구름많음');
                    break;
                  case '4':
                    setSky('흐림');
                    break;
                }
                break;
              case 'PTY':
                switch (item.fcstValue) {
                  case '0':
                    setPty('없음');
                    break;
                  case '1':
                    setPty('비');
                    break;
                  case '2':
                    setPty('비/눈');
                    break;
                  case '3':
                    setPty('눈');
                    break;
                  case '4':
                    setPty('소나기');
                    break;
                  default:
                    setPty('알 수 없음');
                }
                break;
              case 'POP':
                setPop(Number(item.fcstValue));
                break;
            }
          });
        } else {
          setError('API 응답에 문제가 있습니다.');
          console.error('API 응답에 문제가 있습니다.', response.data);
        }
      })
      .catch((error) => {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('Error fetching data:', error);
      });
  }, []);

  const getImage = (): string | undefined => {
    if (pty === '비' || pty === '비/눈' || pty === '소나기') {
      return rainyImg;
    }
    if (pty === '눈') {
      return snowImg;
    }
    if (sky === '맑음') {
      return sunnyImg;
    }
    if (sky === '구름많음') {
      return blueCloudImg;
    }
    if (sky === '흐림') {
      return darkCloudImg;
    }
    return undefined; // 기본 이미지가 없을 경우 undefined 반환
  };

  return (
    <div style={styles.container}>
      (
        <>
          <div style={styles.info}>기온 : {tmp}℃</div>
          <div style={styles.info}>하늘상태 : {sky}</div>
          <div style={styles.info}>강수형태 : {pty}</div>
          <div style={styles.info}>강수확률 : {pop}%</div>
          {getImage() && <img src={getImage()} alt="weather icon" style={styles.image} />}
        </>
      )
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: '0 auto',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
  },
  info: {
    marginBottom: '10px',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: '20px',
  },
  image: {
    width: '100px', // 이미지 크기를 조정할 수 있습니다.
    height: '100px',
  },
};

export default WeatherInfo;
