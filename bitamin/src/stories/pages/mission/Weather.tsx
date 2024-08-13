import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MyPlant from '@/stories/pages/mission/MyPlant';

import sunnyImg from '@/assets/weatherImage/sunny.png';
import blueCloudImg from '@/assets/weatherImage/blue_cloud.png';
import darkCloudImg from '@/assets/weatherImage/dark_cloud.png';
import rainyImg from '@/assets/weatherImage/rainy.png';
import snowImg from '@/assets/weatherImage/snow.png';

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

        const times = ['0200', '0500', '0800', '1100', '1400', '1700', '2000', '2300'];

        const getClosestTime = () => {
            const now = today.getHours() * 100 + today.getMinutes();
            return times.reduce((prev, curr) => Math.abs(Number(curr) - now) < Math.abs(Number(prev) - now) ? curr : prev);
        };

        const closestTime = getClosestTime();

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
                }
            })
            .catch((error) => {
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
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
        return undefined;
    };

    return (
        <div>
            <MyPlant weatherSky={sky} weatherPty={pty} weatherImage={getImage()} />
        </div>
    );
};

export default WeatherInfo;
