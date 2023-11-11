import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Button} from 'react-native';

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

export default function Timer({navigation}: {navigation: any}) {
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(10);
  const [delay, setDelay] = useState<number | null>(1000); // 1초 간격

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
      navigation.navigate('Home');
    }
  };

  // 시간 연장
  const extensionTime = () => {
    setMinutes(minutes + 5);
  };

  useInterval(handleCountdown, delay);

  return (
    <View>
      <Text>
        {minutes < 10 ? `0${minutes}` : minutes}:
        {seconds < 10 ? `0${seconds}` : seconds}
      </Text>
      <Button title="EXTENSION TIME" onPress={extensionTime} />
    </View>
  );
}
