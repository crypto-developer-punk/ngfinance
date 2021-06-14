import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Typography} from "@material-ui/core";
import Countdown from 'react-countdown';

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
                {/* todo - 날짜 계산시 개선이 필요함. momentjs 고려*/}
                <Countdown
                    date={Date.now() + new Date(new Date(2021, 7, 11).getTime() - new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()).getTime()).getTime()}
                    renderer={props => <span>{props.days} d {props.hours} h {props.minutes} m {props.seconds} s</span>}
                />
            </Typography>
        </>
    );
}