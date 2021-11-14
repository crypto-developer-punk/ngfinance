import React from 'react';
import { inject, observer } from "mobx-react";
import {values, map} from 'mobx';
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery, CircularProgress} from '@material-ui/core';
import ReactPlayer from 'react-player'
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";
import { isMobile } from "react-device-detect";

import {sleep, StringHelper} from "myutil";
import {isDebugMode} from 'myconfig';
import {TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_NFT} from "myconstants";

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
  },
  paperSub: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: 'white',
    background: '#2E3348CC'
  },
}));

const NftStakingSection = props => {
  const { className, ...rest } = props;

  const theme = useTheme();
  const classes = useStyles();

  const [emptyStakingEnabled, setEmptyStakingEnabled] = React.useState(false);

  const {store} = props;
  const {webThreeContext, OwnerNFTArr, NFTArr} = store;

  React.useEffect(() => {
    async function delayEmptyStaking() {
      await sleep(2000);
      setEmptyStakingEnabled(true);
    }
    delayEmptyStaking();
  }, []);

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

  const isMp4Url = StringHelper.isMp4Url;

  const preventClickHandler = (e) => {
    e.preventDefault();
  }

  // console.log('aaa', OwnerNFTArr.length);
  const renderNftStaking = (nftArr) => {
    if (!nftArr || nftArr.length === 0) {
      if (emptyStakingEnabled)
        return renderEmptyNtfStaking();
      return <div/>//<Grid item xs={12} container spacing={3} justify="center" alignItems="center" style={{marginTop:3}}><CircularProgress /></Grid>
    }
    return (
      <Grid item xs={12}>
        {nftArr.map(nft => {
          const staking = store.findNftStaking(nft);
          const nftBalance = nft.balance;
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
                      justify="center"
                      alignItems="flex-start"
                      xs={12} md={4}
                      style={{marginTop:isMp4Url(nft.image_url) && isMobile ? 32 : 0}}
                      // xs={4}
                      data-aos={'fade-up'}
                    >
                      {
                        !isMp4Url(nft.image_url) &&
                        <Grid item>
                          <Image
                            src={nft.image_url}
                            style={{maxHeight:340}}
                            className={classes.image}
                            data-aos="flip-left"
                            data-aos-easing="ease-out-cubic"
                            data-aos-duration="2000"
                          />
                        </Grid>
                      }
                      {
                        isMp4Url(nft.image_url) &&
                        <Grid item maxHeight={340} xs={12} style={isMp4Url(nft.image_url) ? {marginTop:'-10%', marginBottom: '2%'} : {}}>
                          <ReactPlayer
                            url={nft.image_url}
                            width='100%'
                            playing={isMobile ? false : true}
                            loop={true}
                            muted={true}
                          />
                        </Grid>
                      }
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
                                <Typography variant="subtitle1" color={"textSecondary"} hidden={(nft.token_type === TOKEN_TYPE_PAINT_NFT ? false : true)}>
                                  Utility NFT
                                </Typography>
                                <Typography variant="subtitle1" color={"textSecondary"} hidden={(nft.token_type === TOKEN_TYPE_CANVAS_NFT ? false : true)}>
                                  Governance NFT
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
    </Grid>)
  };
  
  const renderEmptyNtfStaking = () => {
    return (
      <Grid item xs={12} style={{marginLeft:1, marginTop:-1}}>
        <SectionHeader
            title={
              <Typography variant="h5">
                You don`t have nfts. If you want to stake, check nfts in nft tab.
              </Typography>
            }
            align="left"
            disableGutter
        />
      </Grid>
    )
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
                  NFT Staking
                </Typography>
              }
              align="left"
              disableGutter
          />
          <Divider/>
        </Grid>
        
        {/* nft-list */}
        {renderNftStaking(OwnerNFTArr)}
      </Grid>
    </React.Fragment>
  );
};

NftStakingSection.propTypes = {
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(NftStakingSection));