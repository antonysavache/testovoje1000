import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { Observable, Subject } from 'rxjs';
import {
  map,
  buffer,
  debounceTime,
  filter,
  takeUntil,
} from 'rxjs/operators';


const App = () => {
  const [timerOn, setTimerOn] = React.useState(false);
  const [time, setTime] = React.useState(0);

  const stop$ = useMemo(() => new Subject(), []);
  const click$ = useMemo(() => new Subject(), []);

  const start = () => {
      setTimerOn(true)
    };
  
    const stop = useCallback(() => {
      setTimerOn(false)
    }, []);
  
    const reset = useCallback(() => {
      setTime(0);
    }, []);
  
    const wait = useCallback(() => {
      click$.next();
      click$.next();
      setTimerOn(false)
    }, []);

  useEffect(() => {
    const doubleClick$ = click$.pipe(
      buffer(click$.pipe(debounceTime(300))),
      map((list) => list.length),
      filter((value) => value >= 2),
    
    );
    const timer$ = new Observable((observer) => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count += 1);
        console.log(count);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    });

    const subscribtion$ = timer$
      .pipe(takeUntil(doubleClick$))
      .pipe(takeUntil(stop$))
      .subscribe({
        next: () => {
          if (timerOn === true) {
            setTime((prev) => prev + 1000);
          }
        },
      });

    return (() => {
      subscribtion$.unsubscribe();
    });
  }, [timerOn]);

  return (
      <section className="stopwatch">
      <span>{('0' + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
      <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
      <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
    <button className="start-button" onClick={start}>
      Start
    </button>
    <button className="stop-button" onClick={stop}>
      Stop
    </button>
    <button onClick={reset}>Reset</button>
    <button onClick={wait}>Wait</button>
  </section>
  );
};

export default App;