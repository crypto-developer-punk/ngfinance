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

const TokenClaimSection = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const {title, subTitle, stakingButtonComponents, lpTokenBalanceComponents, snapShotTimeStr, totalValueLockedTitle, totalValueLockedNftAmount, hashAddressLabel, balanceOfReward, dropTokenImage, dropTokenName, boarderTopColor} = props;

  return (
    <React.Fragment>
      <Grid item xs={12} style={{marginBottom: '30px'}}>
        <CardBase liftUp variant="outlined" align="left" withShadow
                  style={{ borderTop: `5px solid ${boarderTopColor}` }}>
          <Grid container spacing={isMd ? 5 : 2}>
            <Grid item container xs={12} justify="center" alignItems="center">
            <Grid item xs={6} md={6} align={"left"}>
              {title}
            </Grid>
            <Grid item xs={6} md={6} align={"right"}>
              {stakingButtonComponents}
            </Grid>
            </Grid>
            { subTitle && 
              <Grid item xs={12} md={12} align={"left"}>
                  {subTitle}
              </Grid>
            }
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} md={6} align="left">
              <Paper className={classes.paper}>
                <Typography component="span" variant="subtitle1">
                  Next snapshot date : { snapShotTimeStr }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Typography component="span" variant="subtitle1">
                  {totalValueLockedTitle} : { totalValueLockedNftAmount }
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
              <Paper className={classes.paper}>
                <Typography component="span" variant="subtitle1">
                  <div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                  {hashAddressLabel}
                  </div>
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {lpTokenBalanceComponents}
            <Grid item xs={12}>
              <Typography component="span" variant="h6">
                Token Drop Balance
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid
                  container
                  xs={12}
                  alignContent="flex-start"
                  justify="flex-start"
                  alignItems="center"
                  spacing={2}
              >
                <Grid item>
                  <Image src={dropTokenImage}
                        style={{ width: '120px', height:'120px' }}/>
                </Grid>
                <Grid item
                    alignItems=""
                    justify="center">
                  <Typography component="span" variant="subtitle1">
                    {dropTokenName} : { balanceOfReward }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardBase>
      </Grid>
    </React.Fragment>
  );
};

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
    const {webThreeContext, paintNftSnapshot, canvasNftSnapshot, lpSnapshot, paintEthLpStaking, paintPoolStaking, paintPoolSnapshot} = store;
    
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
          <TokenClaimSection 
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
            snapShotTimeStr={paintNftSnapshot.snapShotTimeStr}
            totalValueLockedTitle={"Total number of NFT locked"}
            totalValueLockedNftAmount={MathHelper.toFixed(paintNftSnapshot.total_value_locked_nft_amount)}
            hashAddressLabel={"PAINT : 0x83e031005ecb771b7ff900b3c7b0bdde7f521c08"}
            balanceOfReward={MathHelper.toFixed(paintNftSnapshot.balance_of_reward)}
            dropTokenImage={PaintToken}
            dropTokenName={"Paint Token"}/>
          
          <br/>
          <br/>

          {/*  NFT Claim (PAINT) */}
          <TokenClaimSection 
            boarderTopColor={colors.green[900]}
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
            snapShotTimeStr={canvasNftSnapshot.snapShotTimeStr}
            totalValueLockedTitle={"Total number of NFT locked"}
            totalValueLockedNftAmount={MathHelper.toFixed(canvasNftSnapshot.total_value_locked_nft_amount)}
            hashAddressLabel={"CANVAS : 0x863ad391091ae0e87b850c2bb7bfc7597c79c93f"}
            balanceOfReward={MathHelper.toFixed(canvasNftSnapshot.balance_of_reward)}
            dropTokenImage={CanvasToken}
            dropTokenName={"Canvas Token"}/>

          {/*  PAINT/ETH LP Claim (PAINT) */}
          <TokenClaimSection 
            boarderTopColor={colors.deepPurple[900]}
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
                    Your PAINT/ETH LP : {MathHelper.toFixed(webThreeContext.paintEthLpBalance)}
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
          <TokenClaimSection 
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
                <Button style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: 5, borderTopRightRadius: 5, marginLeft: -1}} variant="outlined" color="primary" size={buttonSize()} onClick={() => claim(TOKEN_TYPE_PAINT_POOL)} disabled={isDisabledLpClaim()}>
                  Claim
                </Button>
              </Grid>
            }
            lpTokenBalanceComponents={
              <Grid item xs={12}>
                <Paper className={classes.paperSub}>
                  <Typography component="span" variant="subtitle1">
                    Your PAINT/ETH LP : {MathHelper.toFixed(webThreeContext.paintPoolBalance)}
                  </Typography>
                  <br/>
                  <Typography component="span" variant="subtitle1">
                    Staked Paint Token : {MathHelper.toFixed(paintPoolStaking.token_amount)}
                  </Typography>
                </Paper>
              </Grid>
            }
            snapShotTimeStr={paintPoolSnapshot.snapShotTimeStr}
            totalValueLockedTitle={"Total number of LP locked"}
            totalValueLockedNftAmount={ MathHelper.toFixed(paintPoolSnapshot.total_value_locked_nft_amount)}
            hashAddressLabel={"CANVAS : 0x863ad391091ae0e87b850c2bb7bfc7597c79c93f"}
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