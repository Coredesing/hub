import React, { useState, useEffect, useCallback } from 'react';
import useStyles from './style';

type CountDownProps = {
  startDate?: Date,
  getCurrentDateRealTime?: (currentDate: Date) => void
}

const CountdownSort: React.FC<CountDownProps> = ({ startDate, getCurrentDateRealTime }: CountDownProps) => {
  const styles = useStyles();
  const [second, setSecond] = useState('0');
  const [minute, setMinute] = useState('0');
  const [hour, setHour] = useState('0');
  const [day, setDay] = useState('0');

  const emitCurrentDate = useCallback((now: Date) => {
    getCurrentDateRealTime && getCurrentDateRealTime(now);
  }, [getCurrentDateRealTime]);

  useEffect(() => {
    let countDownInterval = undefined as any; 

    if (startDate && startDate >= new Date()) {
      const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

      let countDown = startDate.getTime();
      countDownInterval = setInterval(function() {    

        let now = new Date().getTime(), distance = countDown - now;
        
        if (distance >= 0) {
          const currentDay = Math.floor(distance / (day));
          const currentHour = Math.floor((distance % (day)) / (hour))
          const currentMinute = Math.floor((distance % (hour)) / (minute));
          const currentSecond = Math.floor((distance % (minute)) / second)

          setDay(currentDay < 10 ? `0${currentDay}`: `${currentDay}`);
          setHour(currentHour < 10 ? `0${currentHour}`: `${currentHour}`);
          setMinute(currentMinute < 10 ? `0${currentMinute}`: `${currentMinute}`);
          setSecond(currentSecond < 10 ? `0${currentSecond}`: `${currentSecond}`);
          emitCurrentDate(new Date(now));
        }

        //do something later when date is reached
        if (distance <= 0 && countDownInterval) {
          clearInterval(countDownInterval);
          window.location.reload();
        }
        //seconds
      }, 0);
    } else {
      setSecond("00");
      setMinute("00");
      setHour("00");
      setDay("00");
    }

    return () => {
      clearInterval(countDownInterval);
    }
  }, [startDate]);

  if (!startDate) {
    return <></>;
  }

  return (
    <div className={styles.countdownSort}>
      {
        Number(day) >= 1
        ?
        <>
          {day} days
        </>
        :
        <>
          {`${hour}h : `}
          {`${minute}m`}
        </>
      }
    </div>
  )
}

export default CountdownSort;
