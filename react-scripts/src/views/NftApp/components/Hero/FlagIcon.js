import * as React from 'react';
import Bnb from "../../../../assets/images/main/flag_bnb.svg"
import Eth from "../../../../assets/images/main/flag_eth.svg"
import {makeStyles} from "@material-ui/core/styles";

// Please only use `FlagIconFactory` one time in your application, there is no
// need to use it multiple times (it would slow down your app). You may place the
// line below in a `FlagIcon.js` file in your 'components' directory, then
// write `export default FlagIcon` as shown below and import it elsewhere in your app.
// const FlagIcon = FlagIconFactory(React);
// If you are not using css modules, write the following:

const useStyles = makeStyles(theme => ({
    flagImage: {
        marginRight: theme.spacing(1)
    }
}));

const FlagIcon = props => {
    const classes = useStyles();

    if (props.code === "ETH") {
        return (
            <span className={classes.flagImage}>
                <img src={Eth} />
            </span>
        );
    }

    return (
        <span className={classes.flagImage}>
            <img src={Bnb}/>
        </span>
    );
}

export default FlagIcon;