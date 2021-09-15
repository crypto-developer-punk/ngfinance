import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {Grid, Button, Typography, Divider, TextField} from '@material-ui/core';
import { Image } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { CardBase } from 'components/organisms';
import GenesisNFT from '../../../../assets/images/main/genesis_nft.jpg';
import Eth from '../../../../assets/images/main/logo_eth.svg';

const useStyles = makeStyles(theme => ({
  playIcon: {
    width: 40,
    height: 40,
    [theme.breakpoints.up('sm')]: {
      width: 80,
      height: 80,
    },
    [theme.breakpoints.up('md')]: {
      width: 80,
      height: 80,
    },
  },
    cardBase: {
        width: '75%',
        height: '75%',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '100%',
        }
    }
}));

const About = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  return (
    <div className={className} {...rest} align="center">
      <SectionHeader
        title={
          <span>
            <Typography component="span" variant="inherit" color="primary">
              Genesis NFT
            </Typography>
          </span>
        }
        subtitle="Purchase the genesis NFT with ETH. The Genesis NFT will be the only version without a personal purchase limit."
        ctaGroup={[
          <Button color="primary" variant="contained" size="large"
                  onClick={(e) => {
                      e.preventDefault();
                      window.location.href="app";
                  }}>
            Buy Genesis NFT
          </Button>
        ]}
        data-aos="fade-up"
      />
      <CardBase withShadow liftUp variant="outlined" data-aos="fade-up" className={classes.cardBase}>
          <Grid container justify="center" spacing={2}>
              <Grid item data-aos={'fade-up'}>
                  <Image
                      src={GenesisNFT}
                      alt="NG Finance's genesis NFT"
                      className={classes.image}
                      data-aos="flip-left"
                      data-aos-easing="ease-out-cubic"
                      data-aos-duration="2000"
                  />
              </Grid>
              <Grid item xs={7} md={8} data-aos={'fade-up'}>
                  <Typography
                      variant="h6"
                      color="textPrimary"
                      className={classes.blogTitle}
                      align="left"
                  >
                      <i>Beginning of Nostalgia</i>
                  </Typography>
              </Grid>
              <Grid item xs={5} md={4} data-aos={'fade-up'} align="right">
                      <Typography
                          variant="h6"
                          color="textSecondary"
                          className={classes.tag}
                      >
                      <b>0.13 ETH</b>
                      {' '}
                      <Image
                          src={Eth}
                          style={{height:'20px', width: '20px'}}
                      />
                      </Typography>
              </Grid>
          </Grid>
      </CardBase>
    </div>
  );
};

About.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default About;
