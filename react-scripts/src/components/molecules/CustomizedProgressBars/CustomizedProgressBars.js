import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Typography} from "@material-ui/core";
import Countdown from 'react-countdown';
import Moment from 'moment';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);

export default function CustomizedProgressBars() {
    return (
        <>
            {/*<BorderLinearProgress variant="determinate" value={20} />*/}
            <Typography
                variant="subtitle1"
                color="primary"
                align={"left"}
            >
                Public sale open until - {' '}
                <Countdown
                    date={Date.now() + Moment('11-07-2021 00:00:00', 'DD-MM-YYYY hh:mm:ss').diff(Moment(), 'milliseconds')}
                    renderer={props => <span>{props.days} d {props.hours} h {props.minutes} m {props.seconds} s</span>}
                />
            </Typography>
        </>
    );
}