import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";
import Eth from "assets/images/main/logo_eth.svg";
import Rarible from "assets/images/main/logo_rarible.png";
import NextSaleNft from "assets/images/main/next_sale_nft.jpg";

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
}));

const NextNftSection = props => {
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
    <Section className={className} {...rest}>
       <Grid
        container
        spacing={4}
      >
        {/* wallet connect row */}
        <Grid
          item
          container
          justify="space-between"
          alignItems="center"
          direction="row"
          xs={12}
        >
          <Typography variant="h5">
                  Our next NFT
          </Typography>
          <Grid
            item
            container
            justify="flex-end"
            alignItems="center"
            direction="row"
            xs={8}
            spacing={2}
          >
            {/* <Grid item>
              <Typography variant="subtitle1">
                {getWalletConnectInfo()}
              </Typography>
            </Grid> */}
            <Grid item>
              <Button variant="contained" color="primary" size={isMd? "large":"small"} onClick={connectToWallet} disabled={webThreeContext.isWalletConnected || !webThreeContext.isValidNetwork}>
                {getWalletBtnLabel()}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* main nft introduce */}
        <Grid
            item
            container
            justify="flex-start"
            alignItems="flex-start"
            xs={12}
            md={6}
            data-aos={'fade-up'}
        >
          <Image
              src={NextSaleNft}
              alt="Genesis NFT"
              style={{ width: '100%', height:'700px' }}
              className={classes.image}
              data-aos="flip-left"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="2000"
          />
        </Grid>
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
              <Grid item container xs={12} direction="row" justifyContent="space-between"
  alignItems="center">
                <Grid item xs={9}>
                  <SectionHeader
                        title={
                          <span>
                            <div>
                              <Typography variant="caption" className={classes.tag} >
                                Nostalgia Artist
                              </Typography>
                              <Typography variant="caption" className={classes.tag} >
                                Paint Token
                              </Typography>
                              <Typography variant="caption" className={classes.tag} >
                                NFT
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
              </Grid>
              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <Typography component="span" variant="h5" color="textPrimary" >
                          <strong>London</strong>
                        </Typography>
                      </span>
                    }
                    align="left"
                    disableGutter
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItemMain}>
                <Grid container direction="row" >
                  <Grid item xs={4} >
                    <Typography variant="subtitle1" color={"primary"}>
                      DESCRIPTION
                    </Typography>
                  </Grid>
                  <Grid item xs={8} >
                    <Typography variant="subtitle1" >
                      London
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.gridItemMain}>
                <Grid container>
                  <Grid item xs={4} >
                    <Typography variant="subtitle1" color={"primary"}>
                      ISSUE DATE
                    </Typography>
                  </Grid>
                  <Grid item xs={8} >
                    <Typography variant="subtitle1">
                      The nft will be released within August, 2021
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <SectionHeader
                  title={
                    <span>
                      <Typography component="span" variant="body1" color="textSecondary">
                        On sale
                      </Typography>{' '}
                      <Typography component="span" variant="h6" color="textPrimary">
                        <strong>-</strong>
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
                    Total amount : TBA
                  </Typography>
                </span>
              </Grid>
              <Grid item xs={12} align="center">
                <br />
                <Button variant="contained" color="primary" size="large"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("https://rarible.com/collection/0x6cff6eb6c7cc2409b48e6192f98914fd05aab4ba?tab=owned", '_blank');
                        }}
                        fullWidth
                        disabled={true}>
                  To be opened
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
    
      </Grid>
    </Section>
  );
};

NextNftSection.propTypes = {
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(NextNftSection));