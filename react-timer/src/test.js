
import { render } from 'react-dom';
import { useEffect, useState } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import React, {
  useCallback,  
  useMemo,
} from 'react';
import { Observable } from 'rxjs';
import {
  map,
  buffer,
  debounceTime,
  filter,
} from 'rxjs/operators';

const App = () => {
  const [time, setTime] = React.useState(0);
  const [timerOn, setTimerOn] = React.useState(false);

  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (timerOn === true) {
          setTime(prevTime => prevTime + 1000);
        }
      });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [timerOn]);

  return (
    <div className="Timers">
      <h2>Stopwatch</h2>
      <div id="display">
        <span>{('0' + Math.floor((time / 3600000) % 60)).slice(-2)}:</span>
        <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}</span>
      </div>

      <div id="buttons">
          <button className="start-button" onClick={() => setTimerOn(true)}>
            Start
          </button>
          <button className="stop-button" onClick={() => setTimerOn(false)}>
            Stop
          </button>
          <button onClick={() => setTime(0)}>Reset</button>
          <button onClick={() => setTimerOn(false)}>Wait</button>
      </div>
    </div>
  );
};

export default App;