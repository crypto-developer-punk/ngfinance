import React from 'react';
import { inject, observer } from "mobx-react";
import {values, map} from 'mobx';
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import CustomizedProgressBars from 'components/molecules/CustomizedProgressBars/CustomizedProgressBars';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase, Section} from "components/organisms";
import {sleep} from "myutil";

import Eth from "assets/images/main/logo_eth.svg";
import Rarible from "assets/images/main/logo_rarible.png";

import Moment from 'moment';
var _ = require('lodash');
require('moment-timezone');
Moment.tz.setDefault("Asia/Seoul");

const SALE_DATE = '15-09-2021 21:00:00';

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

const NextOpenSaleSection = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  
  const [afterTokenSaleImageUrl, setAfterTokenSaleImageUrl] = React.useState("https://ngfinance.io/resources/blank.jpg");
  const [afterTokenSaleSubject, setAfterTokenSaleSubject] = React.useState("Veiled");
  const [afterTokenSale, setAfterTokenSale] = React.useState(false);

  const checkIsAfterTokenSale = (saleDate) => {
    const today = Moment();
    const isAfterTokenSale = today.isAfter(Moment(saleDate, 'DD-MM-YYYY hh:mm:ss'));

    console.log("Sale date: " + saleDate + ", isAfterTokenSale: " + isAfterTokenSale);

    if (isAfterTokenSale) {
      setAfterTokenSale(true);
      setAfterTokenSaleSubject("N-Loot");
      setAfterTokenSaleImageUrl("https://ngfinance.io/resources/nLoot.jpg");
    }
  };

  React.useEffect(() => {
    checkIsAfterTokenSale(SALE_DATE);
  });

  return (
    <React.Fragment>
      {/* title */}
      <Grid item xs={12} style={{marginBottom: '0px'}}>
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
        justify="flex-start"
        alignItems="flex-start"
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomizedProgressBars saleDate={SALE_DATE} isStart={true}/>
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
                        <strong>Metaverse</strong>
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
                    Metaverse
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} className={classes.gridItemMain}>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" color={"primary"}>
                    OPEN SALE DATE
                  </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1">
                    September 27 at 21:00 KST
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <SectionHeader
                title={
                  <span>
                    <Typography component="span" variant="body1" color="textSecondary">
                      Price
                    </Typography>{' '}
                    <Typography component="span" variant="h6" color="textPrimary">
                      <strong>0.6</strong>
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
                    Total amount : 20
                  </Typography>
                </span>
            </Grid>
            <Grid item xs={12} align="center">
              <br />
              <Button variant="contained" color="primary" size="large"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open("https://rarible.com/token/0x6cff6eb6c7cc2409b48e6192f98914fd05aab4ba:21", '_blank');
                      }}
                      fullWidth
                      disabled={true}>
                Sold out
              </Button>
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