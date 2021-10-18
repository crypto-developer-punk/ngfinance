import React from 'react';
import {Typography} from "@material-ui/core";
import Countdown from 'react-countdown';
import moment from 'moment';
import PropTypes from 'prop-types';

import {sleep, DateHelper} from "myutil";

require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");


const TimeProgress = props => {
  const {endTimestamp} = props;

  const [curTimestamp, setCurTimestamp] = React.useState(Date.now());
  const [days, setDays] = React.useState("0");
  const [hours, setHours] = React.useState("0");
  const [minutes, setMinutes] = React.useState("0");
  const [seconds, setSeconds] = React.useState("0");
  const [completed, setCompleted] = React.useState(false);

  const id = React.useRef(null);

  const clear = () => {
    window.clearInterval(id.current);
  }

  React.useEffect(()=>{
    if (!endTimestamp)
      endTimestamp = Date.now();

    id.current = window.setInterval(()=>{
      setCurTimestamp((time)=>time+1000)
    },1000)
    return () => clear();
  },[])

  const updateHoursMinutesSeconds = (diffDuration) => {
    const t = DateHelper.msToTime(diffDuration);
    setDays(t.days);
    setHours(t.hours);
    setMinutes(t.minutes);
    setSeconds(t.seconds);
  };

  React.useEffect(()=>{
    const duration = endTimestamp - (curTimestamp+1000);
    if(duration <= 0){
      setHours("0");
      setMinutes("0");
      setSeconds("0");
      setCompleted(true);
      clear();
    } else {
      updateHoursMinutesSeconds(duration);
    }
  },[curTimestamp])

  return (
    <React.Fragment>
      {props.renderer && props.renderer(days, hours, minutes, seconds, completed)}
    </React.Fragment>
  );
}

TimeProgress.propTypes = {
  endTimestamp: PropTypes.number,
};

export default TimeProgress;