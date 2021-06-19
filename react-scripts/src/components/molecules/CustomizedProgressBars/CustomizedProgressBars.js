import React from 'react';
import {Typography} from "@material-ui/core";
import Countdown from 'react-countdown';
import Moment from 'moment';

require('moment-timezone');

Moment.tz.setDefault("Asia/Seoul");

export default function CustomizedProgressBars() {
    const [afterTokenSale, setAfterTokenSale] = React.useState(false);

    const checkIsAfterTokenSale = () => {
        const today = Moment();
        const isAfterTokenSale = today.isAfter(Moment('26-06-2021 00:00:00', 'DD-MM-YYYY hh:mm:ss'));

        console.log("isAfterTokenSale: " + isAfterTokenSale);

        setAfterTokenSale(isAfterTokenSale);
    };

    React.useEffect(() => {
        checkIsAfterTokenSale();
    }, []);

    return (
        <>
            {/*<BorderLinearProgress variant="determinate" value={20} />*/}
            <Typography
                variant="subtitle1"
                color="primary"
                align={"left"}
            >
                <strong>
                    { afterTokenSale ? 'Public sale closes in ' : 'Public sale starts in ' }
                    { afterTokenSale ? <Countdown
                        date={Date.now() + Moment('10-07-2021 00:00:00', 'DD-MM-YYYY hh:mm:ss').diff(Moment(), 'milliseconds')}
                        renderer={props => <span>{props.days} d {props.hours} h {props.minutes} m {props.seconds} s</span>}
                    /> : <Countdown
                        date={Date.now() + Moment('26-06-2021 00:00:00', 'DD-MM-YYYY hh:mm:ss').diff(Moment(), 'milliseconds')}
                        renderer={props => <span>{props.days} d {props.hours} h {props.minutes} m {props.seconds} s</span>}
                    />}
                </strong>
            </Typography>
        </>
    );
}