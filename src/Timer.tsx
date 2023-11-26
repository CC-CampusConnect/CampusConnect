import React, {useState} from 'react';
import {View, Text} from 'react-native';
import useInterval from './hooks/useInterval';

type TimerProps = {
  onBackPress: () => void;
  timerStarted: boolean;
  isExtended: boolean;
  setIsExtended: (isExtended: boolean) => void;
};

export default function Timer({
  onBackPress,
  timerStarted,
  isExtended,
  setIsExtended,
}: TimerProps) {
  const [minutes, setMinutes] = useState<number>(10);
  const [seconds, setSeconds] = useState<number>(0);
  const [delay, setDelay] = useState<number | null>(1000); // 1 밀리초 간격

  /**
   * 통화 시작 시간, 종료 시간 가져오기
   * 통화 시작 시간, 종료 시간이 없으면 생성
   * 통화 시작 시간, 종료 시간이 있으면 타이머 시작
   * 통화 종료 시간이 지나면 타이머 종료
   *
   */

  // useInterval callback 함수

  const handleCountdown = () => {
    if (timerStarted) {
      if (isExtended) {
        setMinutes(minutes + 5);
        setIsExtended(false);
      }

      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        if (minutes === 0) {
          // 통화 종료 시간이 지났을 때

          setDelay(null);
          onBackPress();
          console.log('타이머 종료');
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }
  };
  useInterval(handleCountdown, delay);

  return (
    <>
      <View className='w-[70px] h-[30px] bg-white rounded my-auto'>
        {timerStarted ? (
          <Text className='text-center text-[20px]'>
            {minutes} : {seconds}
          </Text>
        ) : (
          <Text>통화 종료 시간 가져오는 중...</Text>
        )}
      </View>
    </>
  );
}
