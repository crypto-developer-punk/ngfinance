import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import {values, map} from 'mobx';
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery, Select, MenuItem} from '@material-ui/core';
import ReactPlayer from 'react-player'
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";
import Rarible from "assets/images/main/logo_rarible.png";

import {TOKEN_TYPE_PAINT_NFT, TOKEN_TYPE_CANVAS_NFT, TOKEN_TYPE_CANVAS_PAINT_ETH_LP} from 'myconstants';
import {sleep, StringHelper} from "myutil";
import BasicSelect from "components/my/BasicSelect";

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
  nftImageContainer: {
    cursor: 'pointer',
  },
  raribleIconContainer: {
    // cursor: 'pointer',
    // '&:hover': {
    //   background: 'red'
    //   //color: theme.palette.primary.dark,
    // }
  }
}));

const OurNFTSection = props => {
  const { className, ...rest } = props;
  
  const theme = useTheme();
  const classes = useStyles();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });
  const [filterTokenTypeId, setFilterTokenTypeId] = React.useState(-1);
  
  const {store} = props; 
  const {webThreeContext, NFTArr} = store;

  const isMp4Url = StringHelper.isMp4Url;

  const onClickNftItem = _.debounce((nft) => {
    window.open(nft.nft_url, '_blank');
  }
  , 300, {
    leading: true,
    trailing: false
  });

  const [hover, setHover] = useState(false);

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
        <Grid container item xs={12} style={{marginBottom: '30px'}}>
          <Grid container item xs={12} justify="space-between" style={{}} >
            <Grid item>
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
            <Grid item style={{marginRight:10}}>
              <BasicSelect boxStyle={{width:150}} title="Category" onChanged={(event)=>{console.log(event.target); setFilterTokenTypeId(event.target.value)}} defaultIndex={0} data={[{value:-1, label:'ITEM ALL'}, {value:0, label:'UTILITY'}, {value:2, label:'GOVERNANCE'}]}/>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider/>
          </Grid>
        </Grid>
    
        {/* nft-list */}
        <Grid container item xs={12} spacing={1} >
          {
            NFTArr.filter(nft => {
              if (filterTokenTypeId === -1)
                return true;
              else {
                return nft.token_type === filterTokenTypeId;
              }
            }).map(nft => {
              return (
                  <Grid container item 
                    xs={12} sm={6} md={4}                         
                    justify="center"
                    alignItems="center">
                    <CardBase liftUp variant="outlined" withShadow >
                      <Grid
                        item
                        container
                        justify="center"
                        alignItems="center"
                        data-aos={'fade-up'}
                      >
                        <Grid container item alignItems="center" justify="center"
                          className={classes.nftImageContainer}
                          onClick={e => {
                            e.preventDefault();
                            onClickNftItem(nft);
                          }}
                        >
                          {
                            !isMp4Url(nft.image_url) &&
                            <Grid item>
                              <Image
                                src={nft.image_url}
                                // hidden={isMp4Url(nft.image_url)}
                                style={{maxHeight:340}}
                                alt="Genesis NFT"
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
                                // hidden={!isMp4Url(nft.image_url)}
                                width='100%'
                                playing={true}
                                loop={true}
                                muted={true}
                              />
                            </Grid>
                          }
                        </Grid >
                        <Grid item xs={12}>
                          <Divider style={{width: '100%', marginTop: 15}} />
                        </Grid>
                        <Grid container alignItems="center" justifyContent="center">
                          <Grid item container spacing={0} xs={9} alignItems="center" justifyContent="center">
                            <Grid item xs={9}>
                              <SectionHeader
                                title={
                                  <span>
                                    <Typography variant="caption" color={"textSecondary"} hidden={(nft.token_type === TOKEN_TYPE_PAINT_NFT ? false : true)}>
                                      Utility NFT
                                    </Typography>
                                    <Typography variant="caption" color={"textSecondary"} hidden={(nft.token_type === TOKEN_TYPE_CANVAS_NFT ? false : true)}>
                                      Governance NFT
                                    </Typography>
                                  </span>
                                }
                                align="left"
                                disableGutter
                              />
                            </Grid>
                            <Grid item xs={9}>
                              <SectionHeader
                                  title={
                                    <Typography variant="body1" color="textPrimary" >
                                      <strong>{nft.subject}</strong>
                                    </Typography>
                                  }
                                  align="left"
                                  disableGutter
                              />
                            </Grid>
                          </Grid>
                          <Grid item xs={3} align="right" >
                            <Button padding={0} startIcon={<Image
                              src={Rarible}
                              style={{ width: '40px', height:'40px', marginRight: '-12px'}}
                            />}/>
                          </Grid>
                        </Grid>
                      </Grid>
                    </CardBase>
                  </Grid>    
              )
            })
          }
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

OurNFTSection.propTypes = {
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(OurNFTSection));