import React from 'react';
import {Typography} from "@material-ui/core";
import Countdown from 'react-countdown';
import moment from 'moment';

require('moment-timezone');

moment.tz.setDefault("Asia/Seoul");


const TimeProgress = props => {
  const [timer, setTimer] = React.useState(moment.now() + 1000000);
  const id = React.useRef(null);

  const clear = () => {
    window.clearInterval(id.current);
  }

  React.useEffect(()=>{
    id.current = window.setInterval(()=>{
      setTimer((time)=>time-1)
    },1000)
    return () => clear();
  },[])


  React.useEffect(()=>{
    if(timer===0){
      clear()
    }
  },[timer])

  return (
    <div className="App">
     <div>Time left : {timer} </div>
    </div>
  );
}

export default TimeProgress;