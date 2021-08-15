import React, { useState } from 'react';
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import {CardBase} from "../../../../components/organisms";
import Eth from "../../../../assets/images/main/logo_eth.svg";
import Rarible from "../../../../assets/images/main/logo_rarible.png";
import PaintToken from "../../../../assets/images/main/logo_paint_token.svg";
import CanvasToken from "../../../../assets/images/main/logo_canvas_token.svg";
import NextSaleNft from "../../../../assets/images/main/next_sale_nft.jpg";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import {useWeb3} from '@openzeppelin/network/react';

import Moment from 'moment';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import axios from "axios";

import {environmentConfig, productionConfig, isDebugMode} from 'myconfig';
import requestBackend from 'api/requestBackend';
import requestWeb3 from 'api/requestWeb3';

require('moment-timezone');

Moment.tz.setDefault("Asia/Seoul");

// Define token type
const TOKEN_TYPE_PAINT = 0;
const TOKEN_TYPE_CANVAS = 1;

// Lock key
const KEY_NFT_AMOUNT = "nft_amount_";
const KEY_STAKED_NFT_AMOUNT = "staked_nft_amount_";

const KEY_IS_DISABLED_STAKING = "is_disabled_staking_";
const KEY_IS_DISABLED_UNSTAKING = "is_disabled_unstaking_";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

const Hero = props => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });
  
  React.useEffect(() => {
    console.log('mounted!!!');
    async function test() {
      const accounts = await requestWeb3.getAccounts(); 
      console.log(accounts);
    }
    test();
  });

  return (
    <div>
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default inject(({store}) => ({
  store: store,
}))(observer(Hero));