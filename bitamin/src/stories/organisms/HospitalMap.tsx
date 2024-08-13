import React, { useEffect, useState, useRef } from 'react'

declare global {
  interface Window {
    kakao: any
  }
}

interface Marker {
  position: {
    lat: number
    lng: number
  }
  content: string
}

const MapBox: React.FC = () => {
  const [info, setInfo] = useState<Marker | null>(null)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [places, setPlaces] = useState<any[]>([])
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // 대전 유성구 봉명동 좌표
  const defaultCenter = { lat: 36.362343, lng: 127.356749 }
  const defaultLevel = 5 // 기본 확대/축소 레벨

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const options = {
      center: new window.kakao.maps.LatLng(
        defaultCenter.lat,
        defaultCenter.lng
      ),
      level: defaultLevel,
    }

    mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, options)

    const zoomControl = new window.kakao.maps.ZoomControl()
    mapRef.current.addControl(
      zoomControl,
      window.kakao.maps.ControlPosition.RIGHT
    )

    const mapTypeControl = new window.kakao.maps.MapTypeControl()
    mapRef.current.addControl(
      mapTypeControl,
      window.kakao.maps.ControlPosition.TOPRIGHT
    )

    const ps = new window.kakao.maps.services.Places()

    const searchOptions = {
      location: new window.kakao.maps.LatLng(
        defaultCenter.lat,
        defaultCenter.lng
      ),
      radius: 10000, // 반경 10km 내 검색
    }

    ps.keywordSearch(
      '정신건강',
      (data: any, status: any, _pagination: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          console.log('Search Data:', data) // 검색 데이터를 로그로 출력합니다.
          const bounds = new window.kakao.maps.LatLngBounds()
          const newMarkers: Marker[] = []
          const newPlaces: any[] = []

          for (let i = 0; i < data.length; i++) {
            const latLng = new window.kakao.maps.LatLng(
              parseFloat(data[i].y),
              parseFloat(data[i].x)
            )

            newMarkers.push({
              position: {
                lat: parseFloat(data[i].y),
                lng: parseFloat(data[i].x),
              },
              content: data[i].place_name,
            })

            newPlaces.push(data[i])
            bounds.extend(latLng)
          }
          setMarkers(newMarkers)
          setPlaces(newPlaces)
          mapRef.current.setBounds(bounds)

          newMarkers.forEach((marker) => {
            const markerPosition = new window.kakao.maps.LatLng(
              marker.position.lat,
              marker.position.lng
            )
            const kakaoMarker = new window.kakao.maps.Marker({
              position: markerPosition,
            })

            kakaoMarker.setMap(mapRef.current)

            window.kakao.maps.event.addListener(kakaoMarker, 'click', () => {
              setInfo(marker)
            })
          })
        } else {
          console.error('Failed to search places: ', status)
        }
      },
      searchOptions
    )
  }, [])

  const handleCenter = () => {
    if (mapRef.current) {
      mapRef.current.setCenter(
        new window.kakao.maps.LatLng(defaultCenter.lat, defaultCenter.lng)
      )
      mapRef.current.setLevel(defaultLevel) // 확대/축소 레벨을 기본값으로 설정
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        id="map"
        style={{ width: '100%', height: '500px' }}
        ref={mapContainerRef}
      />
      {info && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          <div>{info.content}</div>
        </div>
      )}
      <button
        onClick={handleCenter}
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          padding: '10px 20px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        내 동네로 돌아가기
      </button>
      <div style={{ marginTop: '20px' }}>
        <h2>검색된 병원 목록</h2>
        <ul>
          {places.map((place, index) => (
            <li key={index}>
              <strong>
                <a
                  href={place.place_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {place.place_name}
                </a>
              </strong>
              <br />
              {place.address_name}
              <br />
              {place.phone ? `전화번호: ${place.phone}` : '전화번호 정보 없음'}
              <br />
              {/* 카카오 Q&A에는 제공X라고 하긴 했는데 github 찾아보고 가져올 수 있으면 하겠음 */}
              {/* {place.opening_hours
                ? `영업시간: ${place.opening_hours}`
                : '영업시간 정보 없음'} */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MapBox
