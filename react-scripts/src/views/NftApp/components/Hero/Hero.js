import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Button, colors, Grid, Typography, Divider, CardHeader} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import GenesisNFT from '../../../../assets/images/main/genesis_nft.jpg';
import {CardBase} from "../../../../components/organisms";
import Eth from "../../../../assets/images/main/logo_eth.svg";
import Rarible from "../../../../assets/images/main/logo_rarible.png";
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

const truncateString = (str) => {
  return str.length > 15 ? str.substring(0, 15) + "..." : str;
};

const Hero = props => {
  const web3Context = useWeb3(environmentConfig.eth_network);
  const { networkId, networkName, accounts, providerName, lib } = web3Context;

  const getTransactionList = async (priceOfEth, connectedAddress, lib) => {
    try {
      const response = await axios.get(environmentConfig.etherscan_api);
      const result = response.data.result;
      let sum = 0;
      let txList = [];

      result.forEach(itemTransaction => {
        if (String(connectedAddress).toUpperCase() === String(itemTransaction["from"]).toUpperCase()) {
          sum += Number(itemTransaction["value"]);
          txList.push(itemTransaction['hash']);
        }
      });

      const paidEth = lib.utils.fromWei(sum.toString(), 'ether');
      const nftBalance = Math.round(Number(paidEth) / priceOfEth);

      console.log("Paid total ETH: " + paidEth);
      console.log("Total supply of NFT: " + nftBalance + " NFT");

      setNftTxList(txList);

      return nftBalance;
    } catch (e) {
      console.error(e);
    }
  };

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

  const requestStaking = () => {
    if (!isValidNetwork()) {
      return;
    }

    if (connectedWallet) {
      console.log("staking");
      requestTransforNft()
    } else {
      console.log("request to connect to wallet");
      requestAuth(web3Context);
    }
  };

  const requestUnstaking = () => {
    if (!isValidNetwork()) {
      return;
    }

    if (connectedWallet) {
      console.log("unstaking");
      requestTransforNftFromStaked()
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

  const checkStakingAndLockStatus = async() => {
    console.log("Check staking status");

    try {
      const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
        from: accounts[0], // default from address
      });

      let balanceOfNft = await nftContract.methods.balanceOf(accounts[0], environmentConfig.nftChainId).call();
      setBalanceOfNft(balanceOfNft);

      let balanceOfTotalStakedNft = await nftContract.methods.balanceOf(environmentConfig.toStakingAddress, environmentConfig.nftChainId).call();
      setBalanceOfToalStakedNft(balanceOfTotalStakedNft);

      const isStaked = await checkStaked();
      await checkLockStatus(isStaked);
    } catch (e) {
      console.error(e);
    }
  };

  const checkStaked = async () => {
    const response = await requestDatabase.getStaked(DB_HOST, accounts[0], environmentConfig.nftChainId);
    let staked;

    console.log(response);
    if (response.status === 200 && response.data.length > 0) {
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

  const registerReward = async () => {
    const response = await requestDatabase.registerReward(DB_HOST, accounts[0], environmentConfig.nftChainId);

    console.log(response);
    await checkRewardStatus();
  };

  const checkRewardStatus = async () => {
    const response = await requestDatabase.getReward(DB_HOST, accounts[0], TOKEN_TYPE_PAINT);

    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const tokenAmount = result.token_amount || 0;
      setBalanceOfRewardPaint(tokenAmount)
    } else {
      setBalanceOfRewardPaint(0);
    }
  };

  const claim = async () => {
    const response = await requestDatabase.claim(DB_HOST, accounts[0], environmentConfig.nftChainId, TOKEN_TYPE_PAINT);

    console.log(response);
    await checkRewardStatus();
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

  const checkLockStatus = async (isStaked) => {
    const response = await requestDatabase.getLockStatus(DB_HOST, accounts[0], environmentConfig.nftChainId);

    console.log("staked:" + isStaked);

    setIsDisabledStaking(isStaked);
    setIsDisabledUnstaking(!isStaked);
    setIsDisabledClaim(!isStaked);

    if (response.status === 200 && response.data.length > 0) {
      response.data.map(data => {
        const lockStatus = data.status;
        console.log("lock status: " + lockStatus);
        // eslint-disable-next-line default-case
        switch (lockStatus) {
          case LOCK_STAKING:
            setIsDisabledStaking(true);
            break;
          case LOCK_UNSTAKING:
            setIsDisabledUnstaking(true);
            break;
          case LOCK_CLAIM:
            setIsDisabledClaim(true);
            break;
        }
      });
    }
  };

  const registerLock = async (status) => {
    const response = await requestDatabase.registerLock(DB_HOST, accounts[0], environmentConfig.nftChainId, status);

    console.log(response);
    await checkLockStatus(staked);
  };

  const unlock = async (status) => {
    const response = await requestDatabase.unlock(DB_HOST, accounts[0], environmentConfig.nftChainId, status);

    console.log(response);
    await checkLockStatus(staked);
  };

  const requestTransforNft = async() => {
    const amountOfNft = balanceOfNft;

    await requestDatabase.registerStaking(DB_HOST, accounts[0], environmentConfig.nftChainId, amountOfNft);
    await checkStakingAndLockStatus();

    return;

    try {
      const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
        from: accounts[0], // default from address
      });

      if (balanceOfNft <= 0) {
        console.log("No found balanceOf");
        return;
      }

      let resultOfTransferred = await nftContract.methods.safeTransferFrom(accounts[0], environmentConfig.toStakingAddress, environmentConfig.nftChainId, amountOfNft, "0x00").send();
      console.log(resultOfTransferred);
      if (resultOfTransferred.status) {
        await requestDatabase.registerStaking(DB_HOST, accounts[0], environmentConfig.nftChainId, amountOfNft);
        await checkStakingAndLockStatus();
      }
    } catch (e) {
      await unlock(LOCK_STAKING);
      console.error(e);
    }
  };

  const requestTransforNftFromStaked = async() => {
    const amountOfNft = balanceOfStakedNft;

    await requestDatabase.unstaking(DB_HOST, accounts[0], environmentConfig.nftChainId);
    await checkStakingAndLockStatus();
    return;

    try {
      const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
        from: accounts[0], // default from address
      });

      const acc = lib.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
      const transaction = nftContract.methods.safeTransferFrom(acc.address, accounts[0], environmentConfig.nftChainId, amountOfNft, "0x00");

      const tx = {
        to: environmentConfig.nftContractAddress,
        data: transaction.encodeABI(),
        gas: await transaction.estimateGas({from: acc.address}),
        gasPrice: await lib.eth.getGasPrice()
      };

      const signed  = await lib.eth.accounts.signTransaction(tx, PRIVATE_KEY);
      const receipt = await lib.eth.sendSignedTransaction(signed.rawTransaction);

      if (receipt.status) {
        await requestDatabase.unstaking(DB_HOST, accounts[0], environmentConfig.nftChainId);
        await checkStakingAndLockStatus();
      }
    } catch (e) {
      await unlock(LOCK_UNSTAKING);
      console.error(e);
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
      handleClickOpen();
      return false;
    }
    return true;
  };
  const [isDisabledStaking, setIsDisabledStaking] = React.useState(false);
  const [isDisabledUnstaking, setIsDisabledUnstaking] = React.useState(true);
  const [isDisabledClaim, setIsDisabledClaim] = React.useState(true);

  const [balanceOfNft, setBalanceOfNft] = React.useState(0);
  const [balanceOfStakedNft, setBalanceOfStakedNft] = React.useState(0);
  const [balanceOfToalStakedNft, setBalanceOfToalStakedNft] = React.useState(0);
  const [balanceOfRewardPaint, setBalanceOfRewardPaint] = React.useState(0);
  const [staked, setStaked] = React.useState(false);

  const [snapshotStatus, setSnapshotStatus] = React.useState("");

  const [disableBuyNft, setDisableBuyNft] = React.useState(false);
  const [nftTxList, setNftTxList] = React.useState([]);
  const [sendingTransaction, setSendingTransaction] = React.useState(false);
  const [nftBalance, setNftBalance] = React.useState(0);
  const [balance, setBalance] = React.useState(0);

  const isConnectedWallet = () => {
    if (accounts && accounts.length > 0) {
      return true;
    }

    return  false;
  };

  const getBalance = React.useCallback(async () => {
    let connected = isConnectedWallet();
    let balance = connected ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), 'ether') : 'Unknown';

    setConnectedWallet(connected);
    if (connected) {
      const nftBalance = await getTransactionList(PRICE_ETH_PER_NFT, accounts[0], lib);
      setNftBalance(nftBalance);

      checkRewardStatus();
      checkStakingAndLockStatus();
      checkSnapshotStatus();
    } else {
      setNftBalance(0);
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

    setBalance(balance);
  }, [accounts, lib.eth, lib.utils]);

  const checkIfBuyNft = () => {
    const today = Moment();
    const isFinishTokenSale = today.isAfter(Moment('10-07-2021 00:00:00', 'DD-MM-YYYY hh:mm:ss'));
    let isDisableBuyNft = false;

    if (!isConnectedWallet()) {
      isDisableBuyNft = true;
    } else if (isDebugMode) {
      isDisableBuyNft = false;
    } else if (isFinishTokenSale) {
      isDisableBuyNft = true;
    }

    setDisableBuyNft(isDisableBuyNft);
    console.log("[STATE] disableBuyNft: " + disableBuyNft);
  };

  const [connectedWallet, setConnectedWallet] = React.useState(false);
  ////////////////////

  const { className, ...rest } = props;
  const classes = useStyles();

  const PRICE_ETH_PER_NFT = 0.13;
  const [amountOfNft, setAmountNft] = React.useState(1);
  const [summarizedPrice, setSummarizedPrice] = React.useState(PRICE_ETH_PER_NFT);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    getBalance();
    checkIfBuyNft();
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
      >
        <Grid
            item
            container
            justify="flex-end"
            alignItems="flex-end"
            xs={12}
            md={12}
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
              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <CustomizedProgressBars />
                          {/*<Typography variant="h6" color="primary">*/}
                          {/*    <b> Genesis NFT </b>*/}
                          {/*</Typography>*/}
                        <Divider style={{marginTop: '10px'}} />
                      </span>
                    }
                    align="left"
                    disableGutter
                />
              </Grid>
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
                    Amount : {amountOfNft} NFT
                  </Typography>
                </span>
                <PrettoSlider
                    valueLabelDisplay="auto"
                    aria-label="Amount of NFT"
                    min={1}
                    max={100}
                    onChange={handleSliderChange}
                    value={amountOfNft}
                />
              </Grid>
              <Grid item xs={12} align="center">
                <Typography component="span" variant="inherit" color="textSecondary">
                  {amountOfNft} NFT = {summarizedPrice} ETH
                </Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <br />
                <LinearProgress style={{marginBottom:"2px"}} hidden={!sendingTransaction}/>
                <Button variant="contained" color="primary" size="large" onClick={requestBuyNft} disabled={disableBuyNft} fullWidth>
                  Sale closed
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
                    YOUR NFTs
                  </Typography>
                }
                align="left"
                disableGutter
            />
          </Grid>

          <Grid item xs={12}>
            <CardBase liftUp variant="outlined" align="left" withShadow
                      style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
              <Grid container spacing={5} hidden={nftBalance!==0}>
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
                            No history found
                          </Typography>
                        </span>
                      }
                      align="left"
                      disableGutter
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5} hidden={nftBalance===0}>
                <Grid
                    item
                    container
                    justify="flex-start"
                    alignItems="flex-start"
                    xs={12} md={4}
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
                            <strong>Beginning of Nostalgia</strong>
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
                          TRANSACTIONS
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <Typography variant="subtitle1">
                          {nftTxList.map(function(d, idx){
                            return (<li key={idx}><a href={environmentConfig.etherscan_uri + String(d)} target={"_blank"}>{truncateString(String(d))}</a></li>)
                          })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
                  YOUR STAKING
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
              <Grid item xs={12}>
                <h5> Snapshot time: { snapshotStatus } </h5>
                <br/>
                <h5> Total value locked: { balanceOfToalStakedNft } </h5>
                <br/>
                <h5> Your balance of NFT: { balanceOfNft } </h5>
                <br/>
                <h5> Staked NFT: { balanceOfStakedNft } </h5>
                <br/>
                <h5> Reward of $PAINT: { balanceOfRewardPaint } </h5>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={requestStaking} fullWidth disabled={isDisabledStaking}>
                  staking
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={requestUnstaking} fullWidth disabled={isDisabledUnstaking}>
                  unstaking
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={claim} fullWidth disabled={isDisabledClaim}>
                  Claim
                </Button>
              </Grid>
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
                <Button variant="contained" color="primary" size="large" onClick={() => checkLockStatus(staked)} fullWidth disabled={false}>
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
                <Button variant="contained" color="primary" size="large" onClick={registerReward} fullWidth disabled={false}>
                  Register reward
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button variant="contained" color="primary" size="large" onClick={checkRewardStatus} fullWidth disabled={false}>
                  Check Reward status
                </Button>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>
      </Grid>

      <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Wrong network"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            We only provide purchase on ethereum mainnet.
            <br />
            Beware for using Binance Smart Chain(BSC).
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
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
