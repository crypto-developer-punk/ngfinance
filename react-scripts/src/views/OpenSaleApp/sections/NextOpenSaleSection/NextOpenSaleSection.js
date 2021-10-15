import React from 'react';
import { inject, observer } from "mobx-react";
import {values, map} from 'mobx';
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import CustomizedProgressBars from 'components/molecules/CustomizedProgressBars/CustomizedProgressBars';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import Countdown from 'react-countdown';

import { Icon } from 'components/atoms';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";
import {TimeProgress} from "components/my";
import {sleep} from "myutil";

import Eth from "assets/images/main/logo_eth.svg";
import PaintSVG from 'assets/images/main/pallete_icon.svg';
import Rarible from "assets/images/main/logo_rarible.png";

import Moment from 'moment';
var _ = require('lodash');
require('moment-timezone');
Moment.tz.setDefault("Asia/Seoul");

const SALE_END_DATE = '15-10-2021 01:00:00';

const useStyles = makeStyles(theme => ({
  image: {
    boxShadow:
      '25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
    borderRadius: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 500,
    },
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  tag: {
    padding: theme.spacing(1 / 2, 1),
    borderRadius: theme.spacing(1 / 2),
    background: theme.palette.secondary.main,
    color: 'black',
    margin: theme.spacing(0, 1, 1, 0),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 1, 1, 0),
    },
  },
  gridRow: {
    marginTop: theme.spacing(2)
  },
  gridItemMain: {
    marginTop: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#E3E3E3',
    background: '#2E3348'
  },
  urltext: {
    // textOverflow: 'ellipsis'
  },
}));

const NextOpenSaleSection = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  
  React.useEffect(() => {
    console.log('aaa', Moment(SALE_END_DATE, 'DD-MM-YYYY hh:mm:ss').valueOf());
  }, []);

  const renderCountDown = ({hours, minutes, seconds, completed}) => {
    // console.log('aaa', hours);
    if (completed) {
      return <span>You are good to go!</span>
    } else {
      const m = Moment(SALE_END_DATE, 'DD-MM-YYYY hh:mm:ss');
      return (
      <React.Fragment>
        <Grid item>
          <Typography component="span" variant="body1" color="textSecondary">
            {`Sale ends ${m.format("MMMM DD, YYYY")} at ${m.format("LT")} KST`}
          </Typography>
        </Grid>
        <Grid item container>
          <Grid item>
            <Typography component="span" variant="body1" color="textSecondary">{hours}</Typography>
          </Grid> 
          <Grid item>
            <Typography component="span" variant="body1" color="textSecondary">{"Hours"}</Typography>
          </Grid> 
          <Grid item>
            <Typography component="span" variant="body1" color="textSecondary">{minutes}</Typography>
          </Grid> 
          <Grid item>
            <Typography component="span" variant="body1" color="textSecondary">{"Minutes"}</Typography>
          </Grid>
          <Grid item>
            <Typography component="span" variant="body1" color="textSecondary">{seconds}</Typography>
          </Grid> 
          <Grid item>
            <Typography component="span" variant="body1" color="textSecondary">{"Seconds"}</Typography>
          </Grid>  
        </Grid>
      </React.Fragment>);
    } 
  };

  return (
    <React.Fragment>
      {/* title */}
      <Grid item xs={12} style={{marginBottom: '0px'}} >
        <SectionHeader
            title={
              <Typography variant="h5">
                Next open sale
              </Typography>
            }
            align="left"
            disableGutter
        />
        <Divider/>
      </Grid>

      {/* nft-image */}
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        xs={12}
        md={6}
      >
        <Image
            src={"https://ngfinance.io/resources/metaverse.png"}
            alt="next open sale NFT"
            style={{ width: '100%', height:'100%' }}
            className={classes.image}
            data-aos="flip-left"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="2000"
        />
      </Grid>
      
      {/* nft-description */}
      <Grid
        item
        container
        justify="flex-start"
        alignItems="flex-start"
        xs={12}
        md={6}
        data-aos={'fade-up'}
      >
        <CardBase liftUp variant="outlined" align="left" withShadow
                style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
          <Grid container spacing={0}>
            <Grid container spacing={0} item>
              <Grid container item xs={12} spacing={2} alignItems="center">
                <Grid item >
                  <SectionHeader
                      title={
                        <span>
                          <Typography component="span" variant="h5" color="textPrimary" >
                            <strong>Metaverse</strong>
                          </Typography>
                        </span>
                      }
                      align="left"
                      disableGutter
                  />
                </Grid>
                <Grid item >
                  <Image
                      src={Rarible}
                      style={{ width: 30, height:30 }}
                  />
                </Grid>  
              </Grid>

              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <div>
                          <Typography variant="caption" className={classes.tag} >
                            Nostalgia Artist
                          </Typography>
                          <Typography variant="caption" className={classes.tag} >
                            Utility NFT
                          </Typography>
                          <Typography variant="caption" className={classes.tag} >
                            PAINT
                          </Typography>
                        </div>
                      </span>
                    }
                    align="left"
                    disableGutter
                  />
              </Grid>
              
              <Grid container item xs={12} spacing={1} className={classes.gridRow} alignItems="center">
                <Grid item xs={3}>
                  <Typography component="span" variant="body1" color="textSecondary" >
                    Price
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="span" variant="body1" color="textPrimary" >
                    10000000
                  </Typography>
                </Grid>
                <Grid item>
                  <Image src={PaintSVG} style={{width:20, height:20}}/>
                </Grid>
                <Grid item>
                  <Typography component="span" variant="caption" color="textPrimary" >
                    PAINT
                  </Typography>
                </Grid>
              </Grid>

              <Grid container item xs={12} spacing={1} className={classes.gridRow} alignItems="center">
                <Grid item xs={3}>
                  <Typography component="span" variant="body1" color="primary" >
                    Description
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography component="span" variant="body1" color="textSecondary" >
                    Metaverse
                  </Typography>
                </Grid>
              </Grid>
              
              <Grid container item xs={12} spacing={3} className={classes.gridRow}>
                <Grid item xs={12}>
                  <Divider/>
                </Grid>
              </Grid>

              <Grid container item xs={12} className={classes.gridRow}>
                <Grid item container xs={12}>
                  <Countdown date={Moment(SALE_END_DATE, 'DD-MM-YYYY hh:mm:ss').valueOf()} renderer={renderCountDown}>
                  </Countdown>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardBase>
      </Grid> 
    </React.Fragment>
  );
};

NextOpenSaleSection.propTypes = {
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(NextOpenSaleSection));