import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery } from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardBase, Section } from "components/organisms";
import { TokenBoard } from "components/my";
import PaintToken from "assets/images/main/logo_paint_token.svg";
import CanvasToken from "assets/images/main/logo_canvas_token.svg";

import {TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, TOKEN_TYPE_PAINT_POOL} from 'myconstants';
import {sleep, MathHelper} from "myutil";

import Moment from 'moment';
require('moment-timezone');
Moment.tz.setDefault("Asia/Seoul");
var _ = require('lodash');

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
    color: 'white',
    background: '#2E3348CC'
  },
  paperSub: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: 'white',
    background: '#2E3348CC'
  },
}));

const ClaimSection = props => {
    const { className, ...rest } = props;
  
    const theme = useTheme();
    const classes = useStyles();
    const isMd = useMediaQuery(theme.breakpoints.up('md'), {
      defaultMatches: true,
    });
    const isSm = useMediaQuery(theme.breakpoints.up('sm'), {
      defaultMatches: true,
    });
  
    const {store} = props; 
    const {webThreeContext, paintNftSnapshot, canvasNftSnapshot, lpSnapshot, paintEthLpStaking, paintPoolStaking, paintPoolSnapshot, StakedCanvasNftCount, StakedPaintNftCount, NonStakedCanvasNftCount, NonStakedPaintNftCount} = store;
    
    // console.log('aaa', StakedCanvasNftCount, StakedPaintNftCount);

    const claim = _.debounce(async (token_type) => {
      let ended = false;
      try {
        props.showLoadingDialog("Claim reward token",
        <div>
           Claiming the reward token
          <br/>
          <br/>
        </div>);

        await store.asyncClaimToken(token_type, (step, hashUrl)=>{
            if (!ended)
              props.showLoadingDialog("Claim reward token",
                <div>
                  Claiming the reward token
                  <br/>
                  {step}
                  <br/>
                  <br/>
                  <div hidden={!hashUrl || hashUrl.length <= 0}>
                    <a href={hashUrl} target={"_blank"}>View claim transaction</a>
                    <br/>
                    <br/>
                  </div>
                </div>);
          });
        props.closeDialog();
        window.location.reload();
      } catch(err) {
        props.showErrorDialog(err);
      } finally {
        ended = true;
      }
    }, 300, {
      leading: true,
      trailing: false
    })

    const isDisabledPaintClaim = () => {
      return paintNftSnapshot.balance_of_reward === 0 || !webThreeContext.isWalletConnected;
    };  

    const isDisabledCanvasClaim = () => {
      return canvasNftSnapshot.balance_of_reward === 0 || !webThreeContext.isWalletConnected;
    };  

    const isDisabledLpClaim = () => {
      return lpSnapshot.balance_of_reward === 0 || !webThreeContext.isWalletConnected;
    };

    const isDisalbedPaintClaim = () => {
      return paintPoolSnapshot.balance_of_reward === 0 || !webThreeContext.isWalletConnected;
    };

    const buttonSize = () => {
      return isMd ? "large" : (isSm ? "medium" : "small")
    };

    return (
      <React.Fragment>
         <Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          md={12}
          data-aos={'fade-up'}
        >
          {/* title */}
          <Grid item xs={12} style={{marginBottom: '30px'}}>
            <SectionHeader
                title={
                  <Typography variant="h5">
                    Claim rewards
                  </Typography>
                }
                align="left"
                disableGutter
            />
            <Divider/>
          </Grid>

          {/*  NFT Claim (PAINT) */}
          <TokenBoard 
            apyLabel={`Your CANVAS reward amount per week (APW) : ${paintNftSnapshot.reward_amount_per_week * StakedPaintNftCount} CANVAS`}
            apyTooltip={`CANVAS reward amount per week : ${paintNftSnapshot.reward_amount_per_week} CANVAS`}
            boarderTopColor={colors.deepOrange[900]}
            title={
              <Typography component="span" variant="h6" style={{color: `${colors.deepOrange[900]}`}}>
                NFT Staking (PAINT)
              </Typography>
            } 
            stakingButtonComponents={
              <Button variant="outlined" color="primary" size={buttonSize()} onClick={()=>{claim(TOKEN_TYPE_PAINT_NFT)}} disabled={isDisabledPaintClaim()}>
                Claim
              </Button>
            }
            lpTokenBalanceComponents={
              <Grid item xs={12}>
                <Paper className={classes.paperSub}>
                  <Typography component="span" variant="subtitle1">
                    Your Remained Utility NFT : {NonStakedPaintNftCount}
                  </Typography>
                  <br/>
                  <Typography component="span" variant="subtitle1">
                    Your Staked Utility NFT : {StakedPaintNftCount}
                  </Typography>
                </Paper>
              </Grid>
            }
            snapShotTimeStr={paintNftSnapshot.snapShotTimeStr}
            totalValueLockedTitle={"Total number of NFT locked"}
            totalValueLockedNftAmount={MathHelper.toFixed(paintNftSnapshot.total_value_locked_nft_amount)}
            hashAddressLabel={"PAINT : 0x83e031005ecb771b7ff900b3c7b0bdde7f521c08"}
            balanceOfReward={MathHelper.toFixed(paintNftSnapshot.balance_of_reward)}
            dropTokenImage={PaintToken}
            dropTokenName={"Paint Token"}/>
          
          <br/>
          <br/>

          {/*  NFT Claim (Canvas) */}
          <TokenBoard 
            boarderTopColor={colors.green[900]}
            apyLabel={`CANVAS reward amount per week (APW) : ${canvasNftSnapshot.reward_amount_per_week * StakedCanvasNftCount} CANVAS`}
            apyTooltip={`CANVAS reward amount per week : ${canvasNftSnapshot.reward_amount_per_week} CANVAS`}
            title={
              <Typography component="span" variant="h6" style={{color: `${colors.green[900]}`}}>
                NFT Staking (CANVAS)
              </Typography>
            }
            stakingButtonComponents={
              <Button variant="outlined" color="primary" size={buttonSize()} onClick={()=>{claim(TOKEN_TYPE_CANVAS_NFT)}} disabled={isDisabledCanvasClaim()}>
                Claim
              </Button>
            }
            lpTokenBalanceComponents={
              <Grid item xs={12}>
                <Paper className={classes.paperSub}>
                  <Typography component="span" variant="subtitle1">
                    Your Remained Utility NFT : {NonStakedCanvasNftCount}
                  </Typography>
                  <br/>
                  <Typography component="span" variant="subtitle1">
                    Your Staked Utility NFT : {StakedCanvasNftCount}
                  </Typography>
                </Paper>
              </Grid>
            }
            snapShotTimeStr={canvasNftSnapshot.snapShotTimeStr}
            totalValueLockedTitle={"Total number of NFT locked"}
            totalValueLockedNftAmount={MathHelper.toFixed(canvasNftSnapshot.total_value_locked_nft_amount)}
            hashAddressLabel={"CANVAS : 0x863ad391091ae0e87b850c2bb7bfc7597c79c93f"}
            balanceOfReward={MathHelper.toFixed(canvasNftSnapshot.balance_of_reward)}
            dropTokenImage={CanvasToken}
            dropTokenName={"Canvas Token"}/>

          {/*  PAINT/ETH LP Claim (PAINT) */}
          <TokenBoard 
            boarderTopColor={colors.deepPurple[900]}
            apyLabel={`CANVAS reward amount per week (APW) : ${MathHelper.toFixed(lpSnapshot.reward_amount_per_week * paintEthLpStaking.token_amount)} CANVAS`}
            apyTooltip={`CANVAS reward amount per week : ${lpSnapshot.reward_amount_per_week} CANVAS`}
            title={
              <Typography component="span" variant="h6" style={{color: `${colors.deepPurple[900]}`}}>
                PAINT/ETH LP Staking
              </Typography>
            }
            subTitle={
              <Typography component="span" variant="overline" color="error">
                The mobile meta mask is currently under maintenance.
                <br/>
                Currently, only desktop meta mask is available.
              </Typography>
            }
            stakingButtonComponents={
              <Grid item xs={12}>
                <Button style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginLeft: -1}} variant="outlined" color="primary" size={buttonSize()} onClick={() => claim(TOKEN_TYPE_CANVAS_PAINT_ETH_LP)} disabled={isDisabledLpClaim()}>
                  Claim
                </Button>
              </Grid>
            }
            lpTokenBalanceComponents={
              <Grid item xs={12}>
                <Paper className={classes.paperSub}>
                  <Typography component="span" variant="subtitle1">
                    Your PAINT/ETH LP : {MathHelper.parseFixedFloat(webThreeContext.paintEthLpBalanceStr)}
                  </Typography>
                  <br/>
                  <Typography component="span" variant="subtitle1">
                    Staked PAINT/ETH LP : {MathHelper.toFixed(paintEthLpStaking.token_amount)}
                  </Typography>
                </Paper>
              </Grid>
            }
            snapShotTimeStr={lpSnapshot.snapShotTimeStr}
            totalValueLockedTitle={"Total number of LP locked"}
            totalValueLockedNftAmount={ MathHelper.toFixed(lpSnapshot.total_value_locked_nft_amount)}
            hashAddressLabel={"CANVAS : 0x863ad391091ae0e87b850c2bb7bfc7597c79c93f"}
            balanceOfReward={MathHelper.toFixed(lpSnapshot.balance_of_reward)}
            dropTokenImage={CanvasToken}
            dropTokenName={"Canvas Token"}/>            

          {/*  PAINT/ETH LP Claim (PAINT) */}
          <TokenBoard 
            apyLabel={`CANVAS reward amount per week (APW) : ${MathHelper.toFixed(paintPoolSnapshot.reward_amount_per_week * paintPoolStaking.token_amount)} CANVAS`}
            apyTooltip={`CANVAS reward amount per week : ${paintPoolSnapshot.reward_amount_per_week} CANVAS`}
            boarderTopColor={colors.deepPurple[900]}
            title={
              <Typography component="span" variant="h6" style={{color: `${colors.deepPurple[900]}`}}>
                Paint Token Staking
              </Typography>
            }
            subTitle={
              <Typography component="span" variant="overline" color="error">
                The mobile meta mask is currently under maintenance.
                <br/>
                Currently, only desktop meta mask is available.
              </Typography>
            }
            stakingButtonComponents={
              <Grid item xs={12}>
                <Button style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginLeft: -1}} variant="outlined" color="primary" size={buttonSize()} onClick={() => claim(TOKEN_TYPE_PAINT_POOL)} disabled={isDisalbedPaintClaim()}>
                  Claim
                </Button>
              </Grid>
            }
            lpTokenBalanceComponents={
              <Grid item xs={12}>
                <Paper className={classes.paperSub}>
                  <Typography component="span" variant="subtitle1">
                    Your Paint Token : {MathHelper.parseFixedFloat(webThreeContext.paintPoolBalanceStr)}
                  </Typography>
                  <br/>
                  <Typography component="span" variant="subtitle1">
                    Staked Paint Token : {MathHelper.toFixed(paintPoolStaking.token_amount)}
                  </Typography>
                </Paper>
              </Grid>
            }
            snapShotTimeStr={paintPoolSnapshot.snapShotTimeStr}
            totalValueLockedTitle={"Total number of Paint locked"}
            totalValueLockedNftAmount={ MathHelper.toFixed(paintPoolSnapshot.total_value_locked_nft_amount)}
            hashAddressLabel={"PAINT : 0x83e031005ecb771b7ff900b3c7b0bdde7f521c08"}
            balanceOfReward={MathHelper.toFixed(paintPoolSnapshot.balance_of_reward)}
            dropTokenImage={PaintToken}
            dropTokenName={"Paint Token"}/> 
        </Grid>
      </React.Fragment>)
};

ClaimSection.propTypes = {
    className: PropTypes.string,
};
  
export default inject(({store}) => ({
store: store,
}))(observer(ClaimSection));