import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const App = () => {
  const [timerOn, setTimerOn] = useState(false);
  const [time, setTime] = useState(0);

  const stop$ = useMemo(() => new Subject(), []);

  let countClicks = 0;
  function wait(e) {
    if (countClicks) {
      clearTimeout(countClicks);
      countClicks = 0;
    }

    if (e.detail === 1) {
      countClicks = setTimeout(function () {}, 300);
    } else if (e.detail === 2) {
      setTimerOn(false);
    }
  }

  const start = () => {
    setTimerOn(true);
  };

  const stop = useCallback(() => {
    setTimerOn(false);
    setTime(0);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setTimerOn(true);
  }, []);

  useEffect(() => {
    const timer$ = new Observable(observer => {
      let count = 0;
      const intlId = setInterval(() => {
        observer.next((count += 1));
        console.log(count);
      }, 1000);

      return () => {
        clearInterval(intlId);
      };
    });

    const subscribtion$ = timer$.pipe(takeUntil(stop$)).subscribe({
      next: () => {
        if (timerOn === true) {
          setTime(prev => prev + 1000);
        }
      },
    });

    return () => {
      subscribtion$.unsubscribe();
    };
  }, [timerOn]);

  return (
    <section>
      <span>{('0' + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
      <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
      <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
      <button onClick={wait}>Wait</button>
    </section>
  );
};

export default App;
