import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';
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
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(10);
  const [delay, setDelay] = useState<number | null>(1000); // 1초 간격

  // Firestore로부터 callStartTime을 가져와서 타이머 설정하는 함수
  const fetchStartCallTime = async () => {
    try {
      const roomRef = await db.collection('rooms').doc(roomId);

      roomRef.onSnapshot(async snapshot => {
        const data = snapshot.data();
        if (data && data.created_date) {
          const callStartTime = data.created_date.toDate(); // Firestore Timestamp을 JavaScript Date로 변환
          console.log('Call Start Time:', callStartTime);
          setTimerStarted(true); // 타이머 시작
        }
      });
    } catch (error) {
      console.error('Error fetching startCallTime:', error);
    }
  };

  // 타이머
  const handleCountdown = () => {
    if (minutes > 0 || seconds > 0) {
      if (seconds === 0) {
        setMinutes(prevMinutes => prevMinutes - 1);
        setSeconds(59);
      } else {
        setSeconds(prevSeconds => prevSeconds - 1);
      }
      // 카운트다운 종료
    } else {
      setDelay(null);
      onBackPress();
    }
  };

  // 시간 연장
  const extensionTime = () => {
    setMinutes(minutes + 5);
  };

  useEffect(() => {
    fetchStartCallTime();
  }, []);

  useInterval(handleCountdown, timerStarted ? delay : null);

  return (
    <>
      <View>
        <Text>
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </Text>
        <Button title="EXTENSION TIME" onPress={extensionTime} />
      </View>
    </>
  );
};

export default Timer;
