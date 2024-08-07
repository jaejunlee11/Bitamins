import axios from 'axios';

export interface WeatherInfo {
    SKY: string;
    PTY: string;
    RN1: string;
    T1H: string;
    REH: string;
    VEC: string;
    WSD: string;
}

export const deg_code: { [key: number]: string } = {
    0: 'N',
    360: 'N',
    180: 'S',
    270: 'W',
    90: 'E',
    22.5: 'NNE',
    45: 'NE',
    67.5: 'ENE',
    112.5: 'ESE',
    135: 'SE',
    157.5: 'SSE',
    202.5: 'SSW',
    225: 'SW',
    247.5: 'WSW',
    292.5: 'WNW',
    315: 'NW',
    337.5: 'NNW',
};

export const pyt_code: { [key: number]: string } = {
    0: '강수 없음',
    1: '비',
    2: '비/눈',
    3: '눈',
    5: '빗방울',
    6: '진눈깨비',
    7: '눈날림',
};

export const sky_code: { [key: number]: string } = {
    1: '맑음',
    3: '구름많음',
    4: '흐림',
};

export const deg_to_dir = (deg: number): string => {
    let close_dir = '';
    let min_abs = 360;
    if (!(deg in deg_code)) {
        for (const key in deg_code) {
            const abs_val = Math.abs(Number(key) - deg);
            if (abs_val < min_abs) {
                min_abs = abs_val;
                close_dir = deg_code[Number(key)];
            }
        }
    } else {
        close_dir = deg_code[deg];
    }
    return close_dir;
};

export const fetchWeatherData = async (
    serviceKey: string,
    base_date: string,
    base_time: string,
    nx: string,
    ny: string
): Promise<any> => {
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&dataType=json&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;
    const response = await axios.get(url);
    return response.data.response.body.items.item;
};

export const parseWeatherData = (
    data: any[]
): { [key: string]: WeatherInfo } => {
    const informations: { [key: string]: WeatherInfo } = {};
    data.forEach((item) => {
        const { category, fcstDate, fcstTime, fcstValue } = item;
        const dateTimeKey = `${fcstDate}${fcstTime}`;
        if (!informations[dateTimeKey]) {
            informations[dateTimeKey] = {} as WeatherInfo;
        }
        // @ts-ignore
        informations[dateTimeKey][category] = fcstValue;
    });

    // 가장 최근 시간 데이터만 반환
    const latestKey = Object.keys(informations).sort().pop();
    if (latestKey) {
        return { [latestKey]: informations[latestKey] };
    }

    return {};
};
