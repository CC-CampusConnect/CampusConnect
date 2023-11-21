import {useRef, useEffect} from 'react';

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
    // console.log('delay', delay);
  }, [delay]);
}

export default useInterval;
