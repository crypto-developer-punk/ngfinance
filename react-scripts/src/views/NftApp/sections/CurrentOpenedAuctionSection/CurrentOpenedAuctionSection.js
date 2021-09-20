import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import ReactPlayer from 'react-player';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import CustomizedProgressBars from 'components/molecules/CustomizedProgressBars/CustomizedProgressBars';
import {CardBase, Section} from "components/organisms";

import Eth from "assets/images/main/logo_eth.svg";
import Rarible from "assets/images/main/logo_rarible.png";
import NextSaleNft from "assets/images/main/next_sale_nft.jpg";

import Moment from 'moment';
require('moment-timezone');
Moment.tz.setDefault("Asia/Seoul");

const AUCTION_DATE = '19-09-2021 21:00:00';

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
}));

const CurrentOpenedAuctionSection = props => {
  const { className, ...rest } = props;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });
  const classes = useStyles();

  const {webThreeContext} = props.store;

  const connectToWallet = async () => {
    try {
      if (!webThreeContext.isValidNetwork) {
        props.showDialog(`${webThreeContext.networkName} is not supported network`, <div>{"Please select etherium mainet network"}</div>);
        return;
      }
      await props.store.asyncRequestAuth();
    } catch (err) {
      props.showErrorDialog(err);
    }
  };

  const getWalletBtnLabel = () => {
    return webThreeContext.isWalletConnected ? `${webThreeContext.networkName} NET Connected` : getWalletConnectInfo();
  };

  const getWalletConnectInfo = () => {
    if (!webThreeContext.isValidNetwork) {
      return "Please change wallet network to mainnet"; 
    }
    return "";
  };

  return (
    <React.Fragment>

        {/* title with connect wallet btn*/}
        <Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={6}
          md={6}
        >
          <SectionHeader
            title={
              <Typography variant="h5">
                Current opened auction
              </Typography>
            }
            align="left"
            disableGutter
          />
        </Grid>
        <Grid
            item
            container
            justify="flex-end"
            alignItems="flex-end"
            xs={6}
            md={6}
        >
          <Button variant="contained" color="primary" size={isMd? "large":"small"} onClick={connectToWallet} disabled={webThreeContext.isWalletConnected || !webThreeContext.isValidNetwork}>
            {getWalletBtnLabel()}
          </Button>
        </Grid>

        {/* nft-image */}
        <Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          md={6}
        >
          <ReactPlayer
            url={"https://ngfinance.io/resources/metroPainting.mp4"}
            width='100%'
            height='100%'
            playing={true}
            loop={true}
            muted={true}
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomizedProgressBars saleDate={AUCTION_DATE} isStart={false}/>
              </Grid>
              <Grid item xs={9}>
                <SectionHeader
                  title={
                    <span>
                      <div>
                        <Typography variant="caption" className={classes.tag} >
                          Nostalgia Artist
                        </Typography>
                        <Typography variant="caption" className={classes.tag} >
                          Governance NFT
                        </Typography>
                        <Typography variant="caption" className={classes.tag} >
                          Redeemable
                        </Typography>
                      </div>
                    </span>
                  }
                  align="left"
                  disableGutter
                />
              </Grid>
              <Grid item xs={3} align="right">
                <Image
                    src={Rarible}
                    style={{ width: '40px', height:'40px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <Typography component="span" variant="h5" color="textPrimary" >
                          <strong>Metro painting</strong>
                        </Typography>
                      </span>
                    }
                    align="left"
                    disableGutter
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItemMain}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" color={"primary"}>
                      DESCRIPTION
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1">
                      Metro painting
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.gridItemMain}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" color={"primary"}>
                      CLOSING DATE
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1">
                      September 19 at 21:00 KST
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <Typography component="span" variant="body1" color="textSecondary">
                          Reserve price
                        </Typography>{' '}
                        <Typography component="span" variant="h6" color="textPrimary">
                          <strong>0.37</strong>
                        </Typography>{' '}
                        <Typography component="span" variant="body1" color="textSecondary">
                          ETH
                          <span style={{paddingLeft: '10px'}}>
                            <Image
                                src={Eth}
                                style={{height:'20px', width: '20px'}}
                            />
                          </span>
                        </Typography>
                      </span>
                    }
                    align="left"
                    disableGutter
                    titleVariant="h3"
                />
              </Grid>
              <Grid item xs={12}>
                <span>
                  <Typography id="discrete-slider-small-steps" gutterBottom>
                    {/*Total amount : {amountOfNft} NFT*/}
                    Total amount : 1
                  </Typography>
                </span>
              </Grid>
              <Grid item xs={12} align="center">
                <br />
                <Button variant="contained" color="primary" size="large"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("https://rarible.com/token/0x4dfd4f4aa74b62614597e6f5417f70a6fa7a9f45:2?tab=bids", '_blank');
                        }}
                        fullWidth
                        disabled={false}>
                  Place a bid
                </Button>
              </Grid>
              {
                <Grid item xs={12} align="center"><Typography component="span" variant="overline" color="error">
                  We only provide purchase on Ethereum mainnet.
                  <br/>
                  beware for using Binance smart chain.
                </Typography>
                </Grid>
              }
            </Grid>
          </CardBase>
        </Grid>
    </React.Fragment>
  );
};

CurrentOpenedAuctionSection.propTypes = {
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(CurrentOpenedAuctionSection));