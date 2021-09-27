import React from 'react';
import { inject, observer } from "mobx-react";
import {values, map} from 'mobx';
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import ReactPlayer from 'react-player'
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";

import {sleep} from "myutil";
import {isDebugMode} from 'myconfig';

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
  urltext: {
    // textOverflow: 'ellipsis'
  }
}));

const OurNtfSection = props => {
  const { className, ...rest } = props;

  const theme = useTheme();
  const classes = useStyles();

  const {store} = props;
  const {webThreeContext, nftMap} = store;

  const requestStaking = _.debounce(async (nft) => {
    if (!webThreeContext.isWalletConnected) {
      props.showInfoDialog("Please connect wallet to ethereum mainet.");
      return;
    }
    const nftBalance = nft.balance;//parseInt(props.store.findNftWebThreeContext(nft).balance);
    if (nftBalance <= 0) {
      props.showInfoDialog("Must have 1 more NFT for staking");
      return;
    }
    props.showLoadingDialog("Staking NFT", 
    <div>
      Your NFT staking is in progress
    </div>);
    let ended = false;
    try {
      await props.store.asyncRegisterNftStaking(nft, (step, hashUrl)=>{
        if (!ended)
          props.showLoadingDialog("Staking NFT", 
          <div>
            Your NFT staking is in progress
            <br/>
            {step}
            <br/>
            <br/>
            <div hidden={hashUrl.length <= 0}>
              <a href={hashUrl} target={"_blank"}>View staking transaction</a>
              <br/>
              <br/>
            </div>
          </div>);
      });
      props.closeDialog();
    } catch (err) {
      props.showErrorDialog(err);
    } finally {
      ended = true; 
    }
  }, 300, {
    leading: true,
    trailing: false
  });

  const requestUnstaking = _.debounce(async(nft) => {
    if (!webThreeContext.isWalletConnected) {
      props.showInfoDialog("Please connect wallet to ethereum mainet.");
      return;
    }
    const {token_amount} = store.findNftStaking(nft);

    if (token_amount <= 0) {
      props.showInfoDialog("Must have 1 more staked NFT");
      return;
    }

    props.showConfirmDialog("Confirm unstaking your NFT ", <div>Are you sure you want to unstaking?</div>, 
        async ()=>{
          props.showLoadingDialog("Unstaking NFT", 
          <div>
            Your NFT unstaking is in progress
            <br/>
            <br/>
          </div>);
          try {
            await store.asyncUnstakeNft(nft, (step)=> {
              props.showLoadingDialog("Unstaking NFT", 
              <div>
                Your NFT unstaking is in progress
                <br/>
                {step}
                <br/>
                <br/>
              </div>);
            });
            // await sleep(2000);
            props.closeDialog();
            window.location.reload();
          } catch (err) {
            props.showErrorDialog(err);  
          }
        });
  }, 300, {
    leading: true,
    trailing: false
  });

  const isMp4Url = (url) => {
    const extension = url.split(/[#?]/)[0].split('.').pop().trim();

    if (extension === "mp4") {
      return true;
    }
    return false;
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
                <Typography variant="inherit">
                  Our NFTs
                </Typography>
              }
              align="left"
              disableGutter
          />
          <Divider/>
        </Grid>
        
        {/* nft-list */}
        <Grid item xs={12}>
          {
            values(nftMap).map(nft => {
              const staking = store.findNftStaking(nft);
              const nftBalance = nft.balance;//parseInt(store.findNftWebThreeContext(nft).balance);
              return (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CardBase liftUp variant="outlined" align="left" withShadow>
                      <Grid container spacing={5} 
                          justify="flex-start"
                          alignItems="flex-start"
                          style={isMp4Url(nft.image_url) ? {marginTop:'-3%'} : {}}
                      >
                        <Grid
                          item
                          container
                          justify="flex-start"
                          alignItems="flex-start"
                          xs={12} md={4}
                          // xs={4}
                          data-aos={'fade-up'}
                        >
                          <Image
                            src={nft.image_url}
                            hidden={isMp4Url(nft.image_url)}
                            style={{height:'100%', width: '100%'}}
                            alt="Genesis NFT"
                            className={classes.image}
                            data-aos="flip-left"
                            data-aos-easing="ease-out-cubic"
                            data-aos-duration="2000"
                          />
                            <ReactPlayer
                              url={nft.image_url}
                              hidden={!isMp4Url(nft.image_url)}
                              width='100%'
                              height='100%'
                              playing={true}
                              loop={true}
                              muted={true}
                            />
                        </Grid>

                        <Grid
                          item
                          container
                          justify="flex-start"
                          alignItems="flex-start"
                          xs={12} md={8}
                          data-aos={'fade-up'}
                          style={isMp4Url(nft.image_url) ?  {paddingTop:'3%'} : {}}
                        >
                          <Grid item container xs={12} md={8} alignItems="center">
                            <Grid item>
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
                          </Grid>
                          <Grid item container xs={12} md={8} >
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
                                  {nftBalance} NFT
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
                                  <Grid container xs={10}>
                                      <Button style={{borderBottomLeftRadius: 5, borderBottomRightRadius: 0, borderTopLeftRadius: 5, borderTopRightRadius: 0}} variant="outlined" color="primary" size={"small"} disabled={(nftBalance <= 0 || !webThreeContext.isWalletConnected)} onClick={() => requestStaking(nft)}>
                                        stake
                                      </Button>
                                      <Button style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 5, borderTopLeftRadius: 0, borderTopRightRadius: 5, marginLeft: -1}} variant="outlined" color="primary" size={"small"} disabled={(staking.token_amount <= 0 || !webThreeContext.isWalletConnected)} onClick={() => requestUnstaking(nft)}>
                                        unstake
                                      </Button>
                                  </Grid>
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
                                  {staking.token_amount} NFT
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      {
                        isDebugMode ?                             
                        <Grid item xs={12} style={{marginTop: '3%'}}>
                          <SectionHeader
                              title={
                                <span>
                                  <Typography variant="subtitle2" style={{color:'red'}} >
                                    DebugInfo : {JSON.stringify(nft)}
                                  </Typography>
                                </span>
                              }
                              align="left"
                              disableGutter
                          />
                        </Grid>
                        : <div/>
                      }
                    </CardBase>
                  </Grid> 
                </Grid>)
              }
            )
          }
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

OurNtfSection.propTypes = {
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(OurNtfSection));