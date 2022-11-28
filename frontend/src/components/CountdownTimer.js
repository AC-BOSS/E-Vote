import React, {useState} from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { useCountdown } from '../hooks/useCountdown';
import './CountdownTimer.css';

const ExpiredNotice = () => {
  return (
    <></>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="show-counter">
        <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
        <p>:</p>
        <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
        <p>:</p>
        <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
    </div>
  );
};

const CountdownTimer = ({ startDate, endDate }) => {
  const [targetDate, setTargetDate] = useState(startDate);
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
    // console.log(targetDate, startDate, endDate);
  if (days + hours + minutes + seconds <= 0 ) {
    if(targetDate === startDate) {
        setTargetDate(endDate);
    } else {
        return <ExpiredNotice />;
    }
  } else {
    return (
      <>
      {targetDate===startDate?<span>Poll starts in:</span>:<span>Poll ends in:</span>}
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    </>
    );
  }
};

export default CountdownTimer;