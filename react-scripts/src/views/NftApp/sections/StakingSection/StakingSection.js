import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";
import PaintToken from "assets/images/main/logo_paint_token.svg";
import CanvasToken from "assets/images/main/logo_canvas_token.svg";

import Moment from 'moment';
require('moment-timezone');
Moment.tz.setDefault("Asia/Seoul");

const useStyles = makeStyles(theme => ({
  image: {
    boxShadow:
      '25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
    borderRadius: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 500,
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
  gridItemMain: {
    marginTop: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#E3E3E3',
    background: '#2E3348'
  },
}));

const StakingSection = props => {
    const { className, ...rest } = props;
  
    const theme = useTheme();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
      defaultMatches: true,
    });
    const classes = useStyles();
  
    const {backendContext} = props.store;
    
    let ended = false;
    const claim = async () => {
      try {
        props.showLoadingDialog("Claim reward token",
        <div>
           Claiming the reward token
          <br/>
          <br/>
        </div>);

        await props.store.asyncClaimPaintToken((hashUrl)=>{
          if (!ended)
            props.showLoadingDialog("Claim reward token",
              <div>
                Claiming the reward token
                <br/>
                <br/>
                <a href={hashUrl} target={"_blank"}>View claim transaction</a>
                <br/>
                <br/>
              </div>);
        });

        props.closeDialog();
      } catch(err) {
        props.showErrorDialog(err);
      } finally {
        let ended = true;
      }
    };
    return (
    <Section className={className} {...rest}>
      <Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          data-aos={'fade-up'}
      >
        <SectionHeader
            title={
              <Typography variant="h5">
                NFT Staking
              </Typography>
            }
            align="left"
            disableGutter
        />
      </Grid>
      <Grid item xs={12}>
        <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
          <Grid container spacing={isMd ? 5 : 1}>
            <Grid item xs={6} md={6} align={"left"}>
              <Typography component="span" variant="h6">
                Overview
              </Typography>
            </Grid>
            <Grid item xs={6} md={6} align={"right"}>
              <Button variant="outlined" color="primary" size="large" onClick={claim} disabled={backendContext.paintRewardTokenAmount === 0}>
                Claim
              </Button>
            </Grid>
            <Grid item xs={12} md={6} align="left">
              <Paper className={classes.paper}>
                <Typography component="span" variant="subtitle1">
                  Next snapshot date : {backendContext.snapShotTimeStr}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Typography component="span" variant="subtitle1">
                  Total number of NFT locked : { backendContext.totalValueLockedNftAmount }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid
                  item xs={6}
              >
              <Grid
                container
                xs={12}
                alignContent="flex-start"
                justify="flex-start"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Image src={PaintToken}
                          style={{ width: '120px', height:'120px' }}/>
                </Grid>
                <Grid item
                      alignItems=""
                      justify="center">
                  <Typography component="span" variant="subtitle1">
                    Paint Token : { backendContext.paintRewardTokenAmount }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid
                  item xs={6}
              >
              <Grid
                    container
                    xs={12}
                    alignContent="flex-start"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                <Grid item>
                  <Image src={CanvasToken}
                          style={{ width: '120px', height:'120px' }}/>
                </Grid>
                <Grid item>
                  <Typography component="span" variant="subtitle1">
                    Canvas Token : { 0 }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardBase>
      </Grid>
    </Section>)
};

StakingSection.propTypes = {
    className: PropTypes.string,
};
  
export default inject(({store}) => ({
store: store,
}))(observer(StakingSection));