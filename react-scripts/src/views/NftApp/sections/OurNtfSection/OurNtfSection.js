import React from 'react';
import { inject, observer } from "mobx-react";
import {values, map} from 'mobx';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";

import Moment from 'moment';
var _ = require('lodash');
require('moment-timezone');
Moment.tz.setDefault("Asia/Seoul");

// import requestWeb3 from 'api/requestWeb3';

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
  gridItem: {
    marginTop: theme.spacing(5)
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

const OurNtfSection = props => {
  const { className, ...rest } = props;

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });
  const classes = useStyles();

  const {webThreeContext, nftMap} = props.store;

  const requestStaking = _.debounce((nft) => {
    if (!webThreeContext.isWalletConnected) {
      props.showInfoDialog("Please connect wallet to ethereum mainet.");
      return;
    }
    const nftBalance = props.store.findNftWebThreeContext(nft.id).balance;
    if (parseInt(nftBalance) <= 0) {
      props.showInfoDialog("Must have 1 more NFT for staking");
      return;
    }
    props.showLoadingDialog("Staking NFT", 
    <div>
      Your NFT staking is in progress
      <br/>
      <br/>
      <a target={"_blank"}>View staking transaction</a>
      {/* <div hidden={stakingTransactionUrl.length <= 0}>
        <a href={stakingTransactionUrl} target={"_blank"}>View staking transaction</a>
        <br/>
        <br/>
      </div> */}
      {/* <LinearProgress /> */}
    </div>);
  }, 300, {
    leading: true,
    trailing: false
  });

  const requestUnstaking = _.debounce(() => {
    console.log('requestUnstaking');
  }, 300, {
    leading: true,
    trailing: false
  });

  return (
    <Section className={className} {...rest}>
        <Grid item xs={12} style={{marginBottom: '15px'}}>
            <SectionHeader
                title={
                  <Typography variant="h5">
                    Our NFTs
                  </Typography>
                }
                align="left"
                disableGutter
            />
        </Grid>
        <Grid item xs={12}>
          {
            values(nftMap).map(nft => 
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <CardBase liftUp variant="outlined" align="left" withShadow>
                    <Grid container spacing={5}>
                      <Grid
                          item
                          container
                          justify="flex-start"
                          alignItems="flex-start"
                          xs={12} md={4}
                          data-aos={'fade-up'}
                      >
                        <Image
                          src={nft.image_url}
                          alt="Genesis NFT"
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
                        xs={12} md={8}
                        data-aos={'fade-up'}
                      >
                        <Grid item xs={12}>
                          <SectionHeader
                            title={
                              <span>
                                <Typography variant="subtitle1" color={"textSecondary"} >
                                  Nostalgia Finance
                                </Typography>
                              </span>
                            }
                            align="left"
                            disableGutter
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <SectionHeader
                              title={
                                <Typography variant="h5" color="textPrimary" >
                                  <strong>{nft.subject}</strong>
                                </Typography>
                              }
                              align="left"
                              disableGutter
                          />
                          <Divider style={{marginTop: '20px'}} />
                        </Grid>
                        <Grid item xs={12} className={classes.gridItem}>
                          <Grid container>
                            <Grid item xs={12} md={3}>
                              <Typography variant="subtitle1" color={"primary"}>
                                PURCHASED
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={9}>
                              <Typography variant="subtitle1">
                                {props.store.findNftWebThreeContext(nft.id).balance} NFT
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.gridItem}>
                          <Grid container>
                            <Grid item xs={12} md={3}>
                              <Typography variant="subtitle1" color={"primary"}>
                                NFT URL
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={9} >
                              <a href={nft.nft_url} target='_blank'>
                                {nft.nft_url}
                              </a>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.gridItem}>
                          <Grid container>
                            <Grid item xs={12} md={3}>
                              <Typography variant="subtitle1" color={"primary"}>
                                STAKING
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={9} >
                              <ButtonGroup size="small" color="primary" aria-label="large outlined primary button group">
                                <Button onClick={() => requestStaking(nft)}>
                                  stake
                                </Button>
                                {' '}
                                <Button onClick={() => requestUnstaking(nft)}>
                                  unstake
                                </Button>
                              </ButtonGroup>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} className={classes.gridItem}>
                          <Grid container>
                            <Grid item xs={12} md={3}>
                              <Typography variant="subtitle1" color={"primary"}>
                                STAKED NFT
                              </Typography>
                            </Grid>
                            <Grid item xs={12} md={9}>
                              <Typography variant="subtitle1">
                                {/* {state.get(KEY_STAKED_NFT_AMOUNT + nftInfo.nft_chain_id)} NFT */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardBase>
                </Grid> 
              </Grid>
            )
          }
        </Grid>
    </Section>
  );
};

OurNtfSection.propTypes = {
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(OurNtfSection));