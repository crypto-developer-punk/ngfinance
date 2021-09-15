import React from 'react';
import {Typography} from "@material-ui/core";
import Countdown from 'react-countdown';
import Moment from 'moment';

require('moment-timezone');

Moment.tz.setDefault("Asia/Seoul");

export default function CustomizedProgressBars(props) {
    const [afterTokenSale, setAfterTokenSale] = React.useState(false);
    const [afterTokenSaleOpenContext, setAfterTokenSaleOpenContext] = React.useState("");
    const [afterTokenSaleCloseContext, setAfterTokenSaleCloseContext] = React.useState("");

    const checkIsAfterTokenSale = () => {
        const today = Moment();
        const isAfterTokenSale = today.isAfter(Moment(props.saleDate, 'DD-MM-YYYY hh:mm:ss'));

        console.log("isAfterTokenSale: " + isAfterTokenSale);

        setAfterTokenSale(isAfterTokenSale);

        if (props.isStart) {
            setAfterTokenSaleOpenContext("Public sale starts in ");
            setAfterTokenSaleCloseContext("");
        } else {
            setAfterTokenSaleOpenContext("Public sale closes in ");
            setAfterTokenSaleCloseContext("");
        }
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
                    { afterTokenSale ? afterTokenSaleCloseContext : afterTokenSaleOpenContext }
                    { afterTokenSale ? "" : <Countdown
                        date={Date.now() + Moment(props.saleDate, 'DD-MM-YYYY hh:mm:ss').diff(Moment(), 'milliseconds')}
                        renderer={props => <span>{props.days} d {props.hours} h {props.minutes} m {props.seconds} s</span>}
                    />}
                </strong>
            </Typography>
        </>
    );
}