/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {View, Text} from 'react-native';
import {db} from './util/firestore';

type TimerProps = {
  onBackPress: () => void;
  roomId: any;
};

// useInterval callback 매개변수 타입
type IntervalFunction = () => unknown | void;

// useInterval hook
function useInterval(callback: IntervalFunction, delay: number | null) {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    console.log('delay', delay);
  }, [delay]);
}

const Timer: React.FC<TimerProps> = ({onBackPress, roomId}) => {
  const [timerStarted, setTimerStarted] = useState(false); // 타이머 시작 여부
  const [isTimerActive, setTimerActive] = useState(false); // 타이머 활성화 여부
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [callStartTime, setCallStartTime] = useState<number | null>(null); // 통화 시작 시간
  const [callEndTime, setCallEndTime] = useState<number | null>(null); // 통화 종료 시간
  const [delay, setDelay] = useState<number | null>(1); // 1 밀리초 간격
  const [init, setInit] = useState(true); // 타이머 초기화 여부

  /**
   * 통화 시작 시간, 종료 시간 가져오기
   * 통화 시작 시간, 종료 시간이 없으면 생성
   * 통화 시작 시간, 종료 시간이 있으면 타이머 시작
   * 통화 종료 시간이 지나면 타이머 종료
   *
   */
  const fetchTimerData = async () => {
    try {
      const roomRef = await db.collection('rooms').doc(roomId);

      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (data && data.callerReady && data.calleeReady && init) {
          if (!data.callStartTime || !data.callEndTime) {
            // 통화 시작 시간시간 또는 종료 시간이 없을 때
            await roomRef.update({
              callStartTime: Math.floor(new Date().getTime()) + 5000,
              callEndTime: Math.floor(new Date().getTime()) + 15000,
            });
            console.log('callStartTime, callEndTime 업데이트');
          }
          if (data.callStartTime && data.callEndTime) {
            setInit(false);
            setCallStartTime(data.callStartTime);
            setCallEndTime(data.callEndTime);
            setTimerStarted(true);
            console.log('시간체크 시작');
          } else {
            console.log('오류 발생, callStartTime, callEndTime 없음');
          }
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useInterval callback 함수
  const handleCountdown = () => {
    if (callStartTime && callEndTime) {
      let now = Math.floor(new Date().getTime()); // 밀리초 단위로 현재 시간 가져오기

      if (now > callStartTime && !isTimerActive) {
        setTimerActive(true);
        console.log('타이머 active');
      }

      // 통화 종료 시간이 현재 시간보다 이후일 때
      if (now < callEndTime) {
        // 남은 시간 계산
        const timeLeft = callEndTime - now;
        const remainingMinutes = Math.floor((timeLeft % 3600000) / 60000);
        const remainingSeconds = Math.floor((timeLeft % 60000) / 1000);

        if (remainingMinutes !== minutes) {
          setMinutes(remainingMinutes);
        }

        if (remainingSeconds !== seconds) {
          setSeconds(remainingSeconds);
        }

        console.log('now', now);
      } else {
        // 통화 종료 시간이 지났을 때
        setDelay(null);
        onBackPress();
      }
    }
  };
  useInterval(handleCountdown, timerStarted ? delay : null);
  useEffect(() => {
    fetchTimerData();
  }, [timerStarted]);

  return (
    <>
      <View>
        {isTimerActive ? (
          <Text>
            남은 시간: {minutes}분 {seconds}초
          </Text>
        ) : (
          <Text>통화 종료 시간 가져오는 중...</Text>
        )}
      </View>
    </>
  );
};

export default Timer;
