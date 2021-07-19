import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Button, ButtonGroup, colors, Grid, Typography, Divider} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import GenesisNFT from '../../../../assets/images/main/genesis_nft.jpg';
import {CardBase} from "../../../../components/organisms";
import Eth from "../../../../assets/images/main/logo_eth.svg";
import Rarible from "../../../../assets/images/main/logo_rarible.png";
import PaintToken from "../../../../assets/images/main/paint_token.jpg";
import CanvasToken from "../../../../assets/images/main/canvas_token.jpg";
import Slider from '@material-ui/core/Slider';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import {useWeb3} from '@openzeppelin/network/react';
import CustomizedProgressBars from "../../../../components/molecules/CustomizedProgressBars/CustomizedProgressBars";

import Config from '../../../../config.json';
import ReactGA from 'react-ga';
import Moment from 'moment';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";
import axios from "axios";
import {registerLock} from "../../requestDatabase";
import {register} from "../../../../serviceWorker";

require('moment-timezone');

Moment.tz.setDefault("Asia/Seoul");

ReactGA.initialize(Config.ga_code);
ReactGA.pageview(window.location.pathname + window.location.search);

// Define token type
const TOKEN_TYPE_PAINT = 0;
const TOKEN_TYPE_CANVAS = 1;

// Define constant variable
const LOCK_STAKING = "STAKING";
const LOCK_UNSTAKING = "UNSTAKING";
const LOCK_CLAIM = "CLAIM";

// Configuration depending on development environment
const defaultConfig = Config.development;
const environment = process.env.REACT_APP_ENV || 'development';
const isDebugMode = environment === 'development' || environment === 'staging';
const environmentConfig = Config[environment];

// Lock key
const KEY_NFT_AMOUNT = "nft_amount_";
const KEY_IS_LOCKED_STAKING = "is_locked_staking";
const KEY_IS_LOCKED_UNSTAKING = "is_locked_unstaking";
const KEY_IS_DISABLED_STAKING = "is_disabled_staking";
const KEY_IS_DISABLED_UNSTAKING = "is_disabled_unstaking";

const PRIVATE_KEY = "cf906ffc0ff527cde210fafc00b7c2563c7a7dc2859984bb1f428bc3307d6bc6";
const DB_HOST = environmentConfig.db_host;

const requestDatabase = require("../../requestDatabase");

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
  }
}));

const PrettoSlider = withStyles({
  root: {
    color: '#3f51b5',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

const Hero = props => {
  const web3Context = useWeb3(environmentConfig.eth_network);
  const { networkId, networkName, accounts, providerName, lib } = web3Context;

  const requestAuth = async web3Context => {
    try {
      const result = await web3Context.requestAuth();

      if (result.length > 0) {
        setConnectedWallet(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const requestTransfer = async() => {
    try {
      const amountOfEth = summarizedPrice;
      const amountToSend = lib.utils.toWei(amountOfEth.toString(), 'ether'); // Convert to wei value

      setSendingTransaction(true);

      console.log("Amount of ETH: " + amountOfEth);

      let send = await lib.eth.sendTransaction({
        from: accounts[0],
        to: environmentConfig.address_to,
        value: amountToSend
      }).then(receipt => {
        console.log("ETH transaction result status: " + receipt.status);
        console.log("ETH transaction hash: " + receipt.transactionHash);

        setTimeout(() => {
          setSendingTransaction(false);
          window.location.reload()
        }, 10000)
      });
    } catch (e) {
      console.error(e);
      setSendingTransaction(false);
    }
  };

  const requestStaking = (nft_chain_id) => {
    if (!isValidNetwork()) {
      return;
    }

    if (connectedWallet) {
      console.log("staking");
      requestTransforNft(nft_chain_id)
    } else {
      console.log("request to connect to wallet");
      requestAuth(web3Context);
    }
  };

  const requestUnstaking = (nft_chain_id) => {
    if (!isValidNetwork()) {
      return;
    }

    if (connectedWallet) {
      console.log("unstaking");
      requestTransforNftFromStaked(nft_chain_id)
    } else {
      console.log("request to connect to wallet");
      requestAuth(web3Context);
    }
  };

  const requestBalanceOfNft = async() => {
    try {
      const amountOfEth = summarizedPrice;
      const amountToSend = lib.utils.toWei(amountOfEth.toString(), 'ether'); // Convert to wei value

      setSendingTransaction(true);

      console.log("Amount of ETH: " + amountOfEth);

      let send = await lib.eth.sendTransaction({
        from: accounts[0],
        to: environmentConfig.address_to,
        value: amountToSend
      }).then(receipt => {
        console.log("ETH transaction result status: " + receipt.status);
        console.log("ETH transaction hash: " + receipt.transactionHash);

        setTimeout(() => {
          setSendingTransaction(false);
          window.location.reload()
        }, 10000)
      });
    } catch (e) {
      console.error(e);
      setSendingTransaction(false);
    }
  };

  const getNftContract = async() => {
    const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
      from: accounts[0] // default from address
    });

    return nftContract;
  };

  const checkBalanceOfNft = async(nft_chain_id) => {
    console.log("Check balance of nft. nft chain id: " + nft_chain_id);

    const nftContract = await getNftContract();

    let balanceOfNft = await nftContract.methods.balanceOf(accounts[0], nft_chain_id).call();

    console.log("Check balance of nft: " + balanceOfNft);
    upsertState(KEY_NFT_AMOUNT + nft_chain_id, balanceOfNft);

    return balanceOfNft;
  };

  const checkStakingAndLockStatus = async(nft_chain_id) => {
    console.log("Check staking status");

    try {
      const nftContract = await getNftContract();
      const balanceOfTotalStakedNft = await nftContract.methods.balanceOf(environmentConfig.toStakingAddress, environmentConfig.nftChainId).call();

      console.log("balanceOfTotalStakedNft: " + balanceOfTotalStakedNft);
      setBalanceOfTotalStakedNft(balanceOfTotalStakedNft);

      const isStaked = await checkStaked();
      console.log("isStaked: " + isStaked);

      upsertState(KEY_IS_DISABLED_STAKING + nft_chain_id, isStaked);
      upsertState(KEY_IS_DISABLED_UNSTAKING + nft_chain_id, !isStaked);

      await checkLockStatus(nft_chain_id);
    } catch (e) {
      console.error(e);
    }
  };

  const checkStaked = async () => {
    const response = await requestDatabase.getStaked(DB_HOST, accounts[0], environmentConfig.nftChainId);
    let staked;

    console.log("Check staking status");

    if (response.status === 200 && response.data.length > 0) {
      console.log(response.data);

      const result = response.data[0];
      setBalanceOfStakedNft(result.nft_amount);
      staked = true;
    } else {
      setBalanceOfStakedNft(0);
      staked = false;
    }

    setStaked(staked);

    return staked;
  };

  const snapshotAndRewardToken = async () => {
    const response = await requestDatabase.snapshotAndRewardPaintToken(DB_HOST, TOKEN_TYPE_PAINT);

    console.log(response);
    await checkRewardStatus();
  };

  const checkRewardStatus = async () => {
    console.log("Check reward status");

    setIsDisabledClaim(true);

    const response = await requestDatabase.getReward(DB_HOST, accounts[0], TOKEN_TYPE_PAINT);

    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const tokenAmount = result.token_amount || 0;

      console.log("reward token amount: " + tokenAmount);

      if (tokenAmount > 0) {
        setIsDisabledClaim(false);
      }

      setBalanceOfRewardPaint(tokenAmount);
    } else {
      setBalanceOfRewardPaint(0);
    }
  };

  const claim = async () => {
    try {
      setIsLockedClaim(true);
      setOpenClaimDialog(true);

      const response = await requestDatabase.claim(DB_HOST, accounts[0], environmentConfig.nftChainId, TOKEN_TYPE_PAINT);
      console.log(response);

    } finally {
      await checkRewardStatus();
      await checkLockStatus(environmentConfig.nftChainId);
      setOpenClaimDialog(false);
    }
  };

  const checkSnapshotStatus = async () => {
    const response = await requestDatabase.getSnapshot(DB_HOST, accounts[0], TOKEN_TYPE_PAINT);

    console.log(response);
    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const snapshot_time = result.snapshot_time || "";
      setSnapshotStatus(snapshot_time);
    } else {
      setSnapshotStatus("");
    }
  };

  const checkLockStatus = async (nft_chain_id) => {
    console.log("Check lock status");

    upsertState(KEY_IS_LOCKED_STAKING + nft_chain_id, false);
    upsertState(KEY_IS_LOCKED_UNSTAKING + nft_chain_id, false);
    setIsLockedClaim(false);

    requestDatabase.getStakeLockStatus(DB_HOST, accounts[0], nft_chain_id)
        .then(response => {
          if (response.status === 200 && response.data.length > 0) {
            response.data.map(data => {
              const lockStatus = data.status;
              console.log("lock status: " + lockStatus);

              switch (lockStatus) {
                case LOCK_STAKING:
                  upsertState(KEY_IS_LOCKED_STAKING + nft_chain_id, true);
                  break;
                case LOCK_UNSTAKING:
                  upsertState(KEY_IS_LOCKED_UNSTAKING + nft_chain_id, true);
                  break;
              }
            });
          }
        });

    requestDatabase.getClaimLockStatus(DB_HOST, accounts[0])
        .then(response => {
          if (response.status === 200 && response.data.length > 0) {
            const claimLockStatus = response.data[0].status;
            console.log("claim lock status: " + claimLockStatus);

            if (claimLockStatus === LOCK_CLAIM) {
              setIsLockedClaim(true);
            }
          }
        });
  };

  const registerLock = async (status) => {
    const response = await requestDatabase.registerLock(DB_HOST, accounts[0], environmentConfig.nftChainId, status);

    console.log(response);
    await checkLockStatus(environmentConfig.nftChainId);
  };

  const unlock = async (status) => {
    const response = await requestDatabase.unlock(DB_HOST, accounts[0], environmentConfig.nftChainId, status);

    console.log(response);
    await checkLockStatus(environmentConfig.nftChainId);
  };

  const requestTransforNft = async(nft_chain_id) => {
    setOpenStakingDialog(true);

    const amountOfNft = state.get(KEY_NFT_AMOUNT + nft_chain_id);

    try {
      upsertState(KEY_IS_LOCKED_STAKING + nft_chain_id, true);

      const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
        from: accounts[0], // default from address
      });

      if (amountOfNft <= 0) {
        console.log("No found balanceOf");
        return;
      }

      let resultOfTransferred = await nftContract.methods.safeTransferFrom(accounts[0], environmentConfig.toStakingAddress, nft_chain_id, amountOfNft, "0x00").send();
      console.log(resultOfTransferred);
      if (resultOfTransferred.status) {
        await requestDatabase.registerStaking(DB_HOST, accounts[0], nft_chain_id, amountOfNft);
        await checkBalanceOfNft(nft_chain_id);
        await checkStakingAndLockStatus(nft_chain_id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      upsertState(KEY_IS_LOCKED_STAKING + nft_chain_id, false);
      setOpenStakingDialog(false);
    }
  };

  const requestTransforNftFromStaked = async(nft_chain_id) => {
    try {
      upsertState(KEY_IS_LOCKED_UNSTAKING + nft_chain_id, true);
      setOpenUnstakingDialog(true);

      await requestDatabase.unstaking(DB_HOST, accounts[0], nft_chain_id, balanceOfStakedNft);
      await sleep(2000);
      await checkBalanceOfNft(nft_chain_id);
      await checkStakingAndLockStatus(nft_chain_id);
    } catch (e) {
      console.error(e);
    } finally {
      upsertState(KEY_IS_LOCKED_UNSTAKING + nft_chain_id, false);
      setOpenUnstakingDialog(false);
    }
  };

  const connectToWallet = () => {
    if (!isValidNetwork()) {
      return;
    }

    console.log("request to connect to wallet");
    requestAuth(web3Context);
  };

  const requestBuyNft = () => {
    if (!isValidNetwork()) {
      return;
    }

    console.log("request to transfer eth");
    requestTransfer();
  };

  const isValidNetwork = () => {
    const validNetwork = (networkId === 1) || (networkId === 4);

    if (!validNetwork) {
      return false;
    }
    return true;
  };

  const [isDisabledClaim, setIsDisabledClaim] = React.useState(true);
  const [isLockedClaim, setIsLockedClaim] = React.useState(false);

  const [balanceOfStakedNft, setBalanceOfStakedNft] = React.useState(0);
  const [balanceOfTotalStakedNft, setBalanceOfTotalStakedNft] = React.useState(0);
  const [balanceOfRewardPaint, setBalanceOfRewardPaint] = React.useState(0);
  const [staked, setStaked] = React.useState(false);

  const [snapshotStatus, setSnapshotStatus] = React.useState("");

  const [sendingTransaction, setSendingTransaction] = React.useState(false);

  const [nftInfos, setNftInfos] = React.useState([]);
  const [state, setState] = React.useState(new Map());

  // Map functions
  const addState = (key, value) => {
    setState((prev) => new Map([...prev, [key, value]]));
  };


  const upsertState = (key, value) => {
    setState((prev) => new Map(prev).set(key, value));
  };

  const deleteState = (key) => {
    setState((prev) => {
      const newState = new Map(prev);
      newState.delete(key);
      return newState;
    });
  };

  const clearState = () => {
    setState((prev) => new Map(prev.clear()));
  };

  const getNftInfo = async() => {
    console.log("Get NFT Info ");

    const response = await requestDatabase.getNftInfo(DB_HOST);
    const nftInfos = response.data;

    // todo - check response
    console.log(nftInfos);
    setNftInfos(nftInfos);

    return nftInfos;
  };

  const isConnectedWallet = () => {
    if (accounts && accounts.length > 0) {
      return true;
    }

    return  false;
  };

  const getBalance = React.useCallback(async () => {
    // get nft contents
    const nftInfos = await getNftInfo();

    let connected = isConnectedWallet();
    let balance = connected ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), 'ether') : 'Unknown';
    setConnectedWallet(connected);

    if (connected) {
      nftInfos.map(nftInfo => {
        checkBalanceOfNft(nftInfo.nft_chain_id)
            .then(balanceOfNft => {
              checkStakingAndLockStatus(nftInfo.nft_chain_id);
            });
      });
      checkRewardStatus();
      checkSnapshotStatus();
    } else {
      nftInfos.map(nftInfo => {
        upsertState(KEY_NFT_AMOUNT + nftInfo.nft_chain_id, 0);
        upsertState(KEY_IS_DISABLED_STAKING + nftInfo.nft_chain_id, true);
        upsertState(KEY_IS_DISABLED_UNSTAKING + nftInfo.nft_chain_id, true);
        setIsDisabledClaim(true);
      });
    }

    // Logging
    console.log("[Web3] ETH network connected: " + connected);
    console.log("[Web3] Network id: " + networkId +", name: " + networkName);
    console.log("[Web3] Connected account: " + accounts[0]);
    console.log("[Web3] ETH Balance: " + balance);
    console.log("[Web3] Provider name: " + providerName);

    console.log("[ENV] REACT_APP_ENV: " + process.env.REACT_APP_ENV);
    console.log("[ENV] address to: " + environmentConfig.address_to);
    console.log("[ENV] eth network: " + environmentConfig.eth_network);

    console.log("[ENV] NFT Contract Address: " + environmentConfig.nftContractAddress);
    console.log("[ENV] NFT Chain ID: " + environmentConfig.nftChainId);
    console.log("[ENV] staking address to: " + environmentConfig.toStakingAddress);

    console.log("[State] connected wallet: " + connectedWallet);
  }, [accounts, lib.eth, lib.utils]);

  const [connectedWallet, setConnectedWallet] = React.useState(false);
  ////////////////////

  const { className, ...rest } = props;
  const classes = useStyles();

  const PRICE_ETH_PER_NFT = 0.13;
  const [amountOfNft, setAmountNft] = React.useState(1);
  const [summarizedPrice, setSummarizedPrice] = React.useState(PRICE_ETH_PER_NFT);
  const [openStakingDialog, setOpenStakingDialog] = React.useState(false);
  const [openUnstakingDialog, setOpenUnstakingDialog] = React.useState(false);
  const [openClaimDialog, setOpenClaimDialog] = React.useState(false);

  React.useEffect(() => {
    getBalance();
  }, [accounts, getBalance, networkId]);

  const handleSliderChange = (event, newValue) => {
    const calculatedPrice = Number(PRICE_ETH_PER_NFT * newValue).toFixed(3);
    setAmountNft(newValue);
    setSummarizedPrice(calculatedPrice);
  };

  return (
    <div className={className} {...rest}>
      <Grid
        container
        justify="space-between"
        spacing={4}
      ><Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          md={6}
      >
        <SectionHeader
            title={
              <Typography variant="h5">
                Now open sale
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
            xs={12}
            md={6}
        >
          <Button variant="contained" color="primary" size="large" onClick={connectToWallet} disabled={connectedWallet}>
            Connect Wallet
          </Button>
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
          <Image
              src={GenesisNFT}
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
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
            <Grid container spacing={2}>
              {/*<Grid item xs={12}>*/}
              {/*  <SectionHeader*/}
              {/*      title={*/}
              {/*        <span>*/}
              {/*          <CustomizedProgressBars />*/}
              {/*            /!*<Typography variant="h6" color="primary">*!/*/}
              {/*            /!*    <b> Genesis NFT </b>*!/*/}
              {/*            /!*</Typography>*!/*/}
              {/*          <Divider style={{marginTop: '10px'}} />*/}
              {/*        </span>*/}
              {/*      }*/}
              {/*      align="left"*/}
              {/*      disableGutter*/}
              {/*  />*/}
              {/*</Grid>*/}
              <Grid item xs={9}>
                <SectionHeader
                    title={
                      <span>
                        <div>
                          <Typography variant="caption" className={classes.tag} >
                            Genesis
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
              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <Typography component="span" variant="h5" color="textPrimary" >
                          <strong>Beginning of Nostalgia</strong>
                        </Typography>
                      </span>
                    }
                    align="left"
                    disableGutter
                />
              </Grid>
              <Grid item xs={12} className={classes.gridItemMain}>
                <Grid container>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle1" color={"primary"}>
                      DESCRIPTION
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Typography variant="subtitle1">
                      NG.finance Genesis NFT
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.gridItemMain}>
                <Grid container>
                  <Grid item xs={12} md={3}>
                    <Typography variant="subtitle1" color={"primary"}>
                      ISSUE DATE
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Typography variant="subtitle1">
                      It will be minted at July 11, 2021
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
                          <strong>{PRICE_ETH_PER_NFT}</strong>
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
                    Total amount : {amountOfNft} NFT
                  </Typography>
                </span>
                {/*<PrettoSlider*/}
                {/*    valueLabelDisplay="auto"*/}
                {/*    aria-label="Amount of NFT"*/}
                {/*    min={1}*/}
                {/*    max={100}*/}
                {/*    onChange={handleSliderChange}*/}
                {/*    value={amountOfNft}*/}
                {/*/>*/}
              </Grid>
              {/*<Grid item xs={12} align="center">*/}
              {/*  <Typography component="span" variant="inherit" color="textSecondary">*/}
              {/*    {amountOfNft} NFT = {summarizedPrice} ETH*/}
              {/*  </Typography>*/}
              {/*</Grid>*/}
              <Grid item xs={12} align="center">
                <br />
                <LinearProgress style={{marginBottom:"2px"}} hidden={!sendingTransaction}/>
                <Button variant="contained" color="primary" size="large"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("https://rarible.com/collection/0x6cff6eb6c7cc2409b48e6192f98914fd05aab4ba?tab=owned", '_blank');
                        }}
                        fullWidth>
                  Buy NFT
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
        <Grid
            item
            container
            justify="flex-start"
            alignItems="flex-start"
            xs={12}
            md={12}
            data-aos={'fade-up'}
        >
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
            <CardBase liftUp variant="outlined" align="left" withShadow
                      style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>

              {
                nftInfos.map((nftInfo) =>
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
                          src={nftInfo.image_url}
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
                                <strong>{nftInfo.subject}</strong>
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
                              {state.get(KEY_NFT_AMOUNT + nftInfo.nft_chain_id)} NFT
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
                            <a href='https://rarible.com/token/0x6cff6eb6c7cc2409b48e6192f98914fd05aab4ba:2?tab=owners' target='_blank'>
                              https://rarible.com/token/0x6cff6eb6c7cc2409b48e6192f98914fd05aab4ba:2?tab=owners
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
                              <Button onClick={() => requestStaking(nftInfo.nft_chain_id)}
                                      disabled={state.get(KEY_IS_LOCKED_STAKING + nftInfo.nft_chain_id) || state.get(KEY_IS_DISABLED_STAKING + nftInfo.nft_chain_id)}>
                                staking
                              </Button>
                              {' '}
                              <Button onClick={() => requestUnstaking(nftInfo.nft_chain_id)}
                                      disabled={state.get(KEY_IS_LOCKED_UNSTAKING + nftInfo.nft_chain_id) || state.get(KEY_IS_DISABLED_UNSTAKING + nftInfo.nft_chain_id)}>
                                unstaking
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
                              {balanceOfStakedNft} NFT
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )
              }
            </CardBase>
          </Grid>
        </Grid>
      </Grid>

      <br/>
      <Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          md={12}
          data-aos={'fade-up'}
          hidden={!isDebugMode}
      >
        <Grid item xs={12} style={{marginBottom: '15px'}}>
          <SectionHeader
              title={
                <Typography variant="h5">
                  Stake NFT
                </Typography>
              }
              align="left"
              disableGutter
          />
        </Grid>

        <Grid item xs={12}>
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
            <Grid container spacing={5} hidden={connectedWallet}>
              <Grid
                  item
                  container
                  justify="flex-start"
                  alignItems="flex-start"
                  xs={12}
                  data-aos={'fade-up'}
              >
                <SectionHeader
                    title={
                      <span>
                          <Typography variant="h6" color={"textSecondary"} >
                            Please connect wallet
                          </Typography>
                        </span>
                    }
                    align="left"
                    disableGutter
                />
              </Grid>
            </Grid>

            <Grid container spacing={5} hidden={!connectedWallet}>
              <Grid item xs={8} align="left">
                <h5> Next Snapshot Time : { snapshotStatus } </h5>
              </Grid>
              <Grid item xs={4} align="right">
                <Button variant="contained" color="primary" size="large" onClick={claim} fullWidth disabled={isLockedClaim || isDisabledClaim}>
                  Claim
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <h5> Total value locked: { balanceOfTotalStakedNft } </h5>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <h5> Balance </h5>
              </Grid>
              <Grid
                  container
                  xs={6}
                  alignContent="flex-start"
                  justify="flex-start"
                  alignItems="center"
              >
                <Grid item>
                  <Image src={PaintToken}
                         style={{ width: '120px', height:'120px' }}/>
                </Grid>
                <Grid item
                      alignItems=""
                      justify="center">
                  <h5> Paint: { balanceOfRewardPaint } </h5>
                </Grid>
              </Grid>
              <Grid
                  container
                  xs={6}
                  alignContent="flex-start"
                  justify="flex-start"
                  alignItems="center"
              >
                <Grid item>
                  <Image src={CanvasToken}
                         style={{ width: '120px', height:'120px' }}/>
                </Grid>
                <Grid item>
                  <h5> Canvas: { 0 } </h5>
                </Grid>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>
      </Grid>

      <br/>

      <Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          md={12}
          data-aos={'fade-up'}
          hidden={!isDebugMode}
      >
        <Grid item xs={12} style={{marginBottom: '15px'}}>
          <SectionHeader
              title={
                <Typography variant="h5">
                  [Debug] Staking
                </Typography>
              }
              align="left"
              disableGutter
          />
        </Grid>

        <Grid item xs={12}>
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
            <Grid container spacing={5} hidden={connectedWallet}>
              <Grid
                  item
                  container
                  justify="flex-start"
                  alignItems="flex-start"
                  xs={12}
                  data-aos={'fade-up'}
              >
                <SectionHeader
                    title={
                      <span>
                          <Typography variant="h6" color={"textSecondary"} >
                            Please connect wallet
                          </Typography>
                        </span>
                    }
                    align="left"
                    disableGutter
                />
              </Grid>
            </Grid>

            <Grid container spacing={5} hidden={!connectedWallet}>
              <Grid item xs={4}>
                <h5> Staking:  </h5>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={() => registerLock(LOCK_STAKING)} fullWidth disabled={false}>
                  Lock
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={() => unlock(LOCK_STAKING)} fullWidth disabled={false}>
                  Unlock
                </Button>
              </Grid>
              <Grid item xs={4}>
                <h5> Unstaking:  </h5>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={() => registerLock(LOCK_UNSTAKING)} fullWidth disabled={false}>
                  Lock
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={() => unlock(LOCK_UNSTAKING)} fullWidth disabled={false}>
                  Unlock
                </Button>
              </Grid>
              <Grid item xs={4}>
                <h5> Claim:  </h5>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={() => registerLock(LOCK_CLAIM)} fullWidth disabled={false}>
                  Lock
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={() => unlock(LOCK_CLAIM)} fullWidth disabled={false}>
                  Unlock
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="primary" size="large" onClick={() => checkLockStatus(nftInfos[0].nft_chain_id)} fullWidth disabled={false}>
                  Check lock status
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="primary" size="large" onClick={checkStaked} fullWidth disabled={false}>
                  get staking
                </Button>
              </Grid>
              <Grid item xs={4}>
                <h5> Reward: </h5>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={snapshotAndRewardToken} fullWidth disabled={false}>
                  Snapshot and reward token
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={checkRewardStatus} fullWidth disabled={false}>
                  Check Reward status
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" size="large" onClick={getNftInfo} fullWidth disabled={false}>
                  Get NFT info
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" size="large" onClick={() => setOpenStakingDialog(true)} fullWidth disabled={false}>
                  Start dialog
                </Button>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>
      </Grid>

      <Dialog
          open={openStakingDialog}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Staking"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Now your NFT is staking.
            <br/>
            <br/>
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStakingDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={openUnstakingDialog}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Unstaking"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Now your NFT is unstaking.
            <br/>
            <br/>
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnstakingDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={openClaimDialog}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Claim"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Reward token is in-progress.
            <br/>
            <br/>
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenClaimDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

Hero.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Hero;
