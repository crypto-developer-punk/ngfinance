import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles, useTheme} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import GenesisNFT from '../../../../assets/images/main/genesis_nft.jpg';
import {CardBase} from "../../../../components/organisms";
import Eth from "../../../../assets/images/main/logo_eth.svg";
import Rarible from "../../../../assets/images/main/logo_rarible.png";
import PaintToken from "../../../../assets/images/main/logo_paint_token.svg";
import CanvasToken from "../../../../assets/images/main/logo_canvas_token.svg";

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import {useWeb3} from '@openzeppelin/network/react';

import Config from '../../../../config.json';
import ReactGA from 'react-ga';
import Moment from 'moment';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Slide from "@material-ui/core/Slide";

require('moment-timezone');

Moment.tz.setDefault("Asia/Seoul");

ReactGA.initialize(Config.ga_code);
ReactGA.pageview(window.location.pathname + window.location.search);

// Define token type
const TOKEN_TYPE_PAINT = 0;
const TOKEN_TYPE_CANVAS = 1;

// Configuration depending on development environment
const environment = process.env.REACT_APP_ENV || 'development';
const isDebugMode = environment === 'development' || environment === 'staging';
const environmentConfig = Config[environment];

// Lock key
const KEY_NFT_AMOUNT = "nft_amount_";
const KEY_STAKED_NFT_AMOUNT = "staked_nft_amount_";

const KEY_IS_DISABLED_STAKING = "is_disabled_staking_";
const KEY_IS_DISABLED_UNSTAKING = "is_disabled_unstaking_";

const BACKEND_URL = environmentConfig.backend_url;

const requestBackend = require("../../requestBackend");

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

  const web3Context = useWeb3(environmentConfig.eth_network);
  const { networkId, networkName, accounts, providerName, lib } = web3Context;

  const checkBalanceTest = async() => {
    const Web3 = require('web3');
    let web3 = new Web3(Config["production"].eth_network);

    const account = "0x0440A262C4C02904D40F90a160041999823e6B56";
    const nftContractAbi = Config["production"].nftContractAbi;
    const nftContractAddress = Config["production"].nftContractAddress;
    const nft_chain_id = 2;

    console.log("web3 test - web3ContextTest: " + Config["production"].eth_network);
    console.log("web3 test - nftContractAbi: " + nftContractAbi);
    console.log("web3 test - nftContractAddress: " + nftContractAddress);

    const nftContract = new web3.eth.Contract(nftContractAbi, nftContractAddress, {
      from: account // default from address
    });

    const balanceOfNft = await nftContract.methods.balanceOf(account, nft_chain_id).call();
    console.log("web3 test - account: " + account +", balanceOf : " + balanceOfNft);
  };

  const getConnectedAddress = () => {
    if (isConnectedWallet) {
      return accounts[0];
    }

    return undefined;
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

  const getNftContract = async() => {
    const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
      from: getConnectedAddress() // default from address
    });

    return nftContract;
  };

  const checkBalanceOfNft = async(nft_chain_id) => {
    console.log("Check balance of nft. nft chain id: " + nft_chain_id);

    const nftContract = await getNftContract();

    let balanceOfNft = await nftContract.methods.balanceOf(getConnectedAddress(), nft_chain_id).call();

    console.log("Check balance of nft: " + balanceOfNft);
    upsertState(KEY_NFT_AMOUNT + nft_chain_id, balanceOfNft);

    return balanceOfNft;
  };

  const checkTotalValueLockedNftAmount = async() => {
    const response = await requestBackend.getTotalValueLockedNftAmount(BACKEND_URL, getConnectedAddress());
    if (response.status === 200 && response.data.length > 0) {
      console.log(response.data);
      const result = response.data[0];
      const amount = result.totalValueLockedNftAmount | 0;

      console.log("checkTotalValueLockedNftAmount: " + amount);
      setBalanceOfTotalStakedNft(amount);
    } else {
      setBalanceOfTotalStakedNft(0);
    }
  };

  const checkStakingAndLockStatus = async(balanceOfNft, nft_chain_id) => {
    try {
      const isStaked = await checkStaked(nft_chain_id);

      console.log("checkStakingAndLockStatus > isStaked: " + isStaked);
      console.log("checkStakingAndLockStatus > state.get(KEY_NFT_AMOUNT + nft_chain_id): " + state.get(KEY_NFT_AMOUNT + nft_chain_id));

      if (isStaked) {
        upsertState(KEY_IS_DISABLED_STAKING + nft_chain_id, true);
        upsertState(KEY_IS_DISABLED_UNSTAKING + nft_chain_id, false);
      } else if (!isStaked && balanceOfNft > 0) {
        upsertState(KEY_IS_DISABLED_STAKING + nft_chain_id, false);
        upsertState(KEY_IS_DISABLED_UNSTAKING + nft_chain_id, true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkStaked = async (nft_chain_id) => {
    const response = await requestBackend.getStaked(BACKEND_URL, getConnectedAddress(), nft_chain_id);
    let staked;

    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const nft_amount = result.nft_amount;

      console.log("checkStaked > staked nft_amount: " + nft_amount);

      upsertState(KEY_STAKED_NFT_AMOUNT + nft_chain_id, nft_amount);
      staked = true;
    } else {
      console.log("checkStaked > staked nft_amount: 0");

      upsertState(KEY_STAKED_NFT_AMOUNT + nft_chain_id, 0);
      staked = false;
    }

    return staked;
  };

  const snapshotAndRewardToken = async () => {
    const response = await requestBackend.snapshotAndRewardPaintToken(BACKEND_URL, TOKEN_TYPE_PAINT, getConnectedAddress());

    console.log(response);
    await checkRewardStatus();
  };

  const checkRewardStatus = async () => {
    console.log("Check reward status");

    setIsDisabledClaim(true);

    const response = await requestBackend.getReward(BACKEND_URL, getConnectedAddress(), TOKEN_TYPE_PAINT);

    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const tokenAmount = result.token_amount || 0;

      console.log("reward token amount: " + tokenAmount);

      if (tokenAmount > 0) {
        setIsDisabledClaim(false);
      }

      setBalanceOfRewardPaint(tokenAmount);

      return tokenAmount;
    } else {
      setBalanceOfRewardPaint(0);
      return 0;
    }
  };

  const claim = async () => {
    try {
      setOpenClaimDialog(true);

      const response = await requestBackend.approve(BACKEND_URL, getConnectedAddress(), 0, TOKEN_TYPE_PAINT);

      if (response.status === 200) {
        const approved_token_amount = response.data.approved_token_amount;
        console.log("claim > approved_token_amount: " + approved_token_amount);

        await requestTransferFromPaintToken();
      }
    } finally {
      const rewardTokenAmount = await checkRewardStatus();
      console.log ("claim > rewardTokenAmount: " + rewardTokenAmount);
      setOpenClaimDialog(false);
    }
  };

  const requestTransferFromPaintToken = async() => {
    try {
      const contract = new lib.eth.Contract(environmentConfig.PAINT_TOKEN_CONTRACT_ABI, environmentConfig.PAINT_TOKEN_CONTRACT_ADDRESS, {
        from: getConnectedAddress(), // default from address
      });

      let tokenAmount = await contract.methods.allowance(environmentConfig.toStakingAddress, getConnectedAddress()).call();
      console.log("requestTransferFromPaintToken > token amount: " + tokenAmount);

      return contract.methods.transferFrom(environmentConfig.toStakingAddress, getConnectedAddress(), tokenAmount).send()
          .on('transactionHash', function(hash){
            console.log("transactionHash: " + hash);
            setClaimTransactionUrl(environmentConfig.etherscan_url + hash);

            requestBackend.claim(BACKEND_URL, getConnectedAddress(), 0, TOKEN_TYPE_PAINT, hash)
                .then(response => {
                  console.log("claim > claim status: " + response.status);
                });

            return true;
          })
          .on('receipt', function(receipt){
            console.log("receipt: " + receipt);
            return true;
          })
          .on('error', function(error, receipt) {
            console.log("error");
            return false;
          });
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const checkSnapshotStatus = async () => {
    const response = await requestBackend.getSnapshot(BACKEND_URL, TOKEN_TYPE_PAINT, getConnectedAddress());

    console.log(response);
    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const snapshot_time = result.snapshot_time || "";
      setSnapshotStatus(snapshot_time);
    } else {
      setSnapshotStatus("");
    }
  };

  const requestTransforNft = async(nft_chain_id) => {
    setOpenStakingDialog(true);

    const amountOfNft = state.get(KEY_NFT_AMOUNT + nft_chain_id);

    try {
      const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
        from: getConnectedAddress(), // default from address
      });

      if (amountOfNft <= 0) {
        console.log("staking > No found balanceOf");
        return;
      }

      await nftContract.methods.safeTransferFrom(getConnectedAddress(), environmentConfig.toStakingAddress, nft_chain_id, amountOfNft, "0x00").send()
          .on('transactionHash', function(hash){
            console.log("staking > transactionHash: " + hash);
            setStakingTransactionUrl(environmentConfig.etherscan_url + hash);

            requestBackend.registerStaking(BACKEND_URL, getConnectedAddress(), nft_chain_id, amountOfNft, hash)
                .then(response => {
                  console.log("staking > staking status: " + response.status);
                });
          })
          .on('receipt', function(receipt){
            console.log("staking > receipt: " + receipt);
          })
          .on('error', function(error, receipt) {
            console.log("staking > error: " + error);
          });
    } catch (e) {
      console.error(e);
    } finally {
      setOpenStakingDialog(false);

      const balanceOfNft = await checkBalanceOfNft(nft_chain_id);
      await checkStakingAndLockStatus(balanceOfNft, nft_chain_id);
      await checkTotalValueLockedNftAmount();
    }
  };

  const requestTransforNftFromStaked = async(nft_chain_id) => {
    try {
      setOpenUnstakingDialog(true);

      await requestBackend.unstaking(BACKEND_URL, getConnectedAddress(), nft_chain_id)
          .then(response => {
            sleep(2000);
            window.location.reload();
          })
          .catch(error => {
            const message = error.response.data.message;
            const dayOfLockUpNft = error.response.data.dayOfLockUpNft;

            setOpenUnstakingDialog(false);
            setDayOfLockUpNft(dayOfLockUpNft);
            setUnstakingMessage(message);
            setOpenUnstakingMessageDialog(true);
          });
    } catch (e) {
      console.error(e);
    } finally {
      setOpenUnstakingDialog(false);

      await sleep(2000);
      await checkBalanceOfNft(nft_chain_id);
      await checkStakingAndLockStatus(0, nft_chain_id);
      await checkTotalValueLockedNftAmount();
    }
  };

  const connectToWallet = () => {
    if (!isValidNetwork()) {
      return;
    }

    console.log("request to connect to wallet");
    requestAuth(web3Context);
  };

  const isValidNetwork = () => {
    const validNetwork = (networkId === 1) || (networkId === 4);

    if (!validNetwork) {
      return false;
    }
    return true;
  };

  const [isDisabledClaim, setIsDisabledClaim] = React.useState(true);

  const [balanceOfStakedNft, setBalanceOfStakedNft] = React.useState(0);
  const [balanceOfTotalStakedNft, setBalanceOfTotalStakedNft] = React.useState(0);
  const [balanceOfRewardPaint, setBalanceOfRewardPaint] = React.useState(0);

  const [snapshotStatus, setSnapshotStatus] = React.useState("");

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
    console.log("Get NFT Info");

    const response = await requestBackend.getNftInfo(BACKEND_URL, getConnectedAddress());
    const nftInfos = response.data;

    // todo - check response
    console.log(nftInfos);
    setNftInfos(nftInfos);

    await initializeState(nftInfos);

    return nftInfos;
  };

  const isConnectedWallet = () => {
    if ((typeof accounts !== 'undefined') && accounts && accounts.length > 0) {
      return true;
    }

    return  false;
  };

  const initializeState = async(nftInfos) => {
    // eslint-disable-next-line array-callback-return
    nftInfos.map(nftInfo => {
      upsertState(KEY_NFT_AMOUNT + nftInfo.nft_chain_id, 0);
      upsertState(KEY_STAKED_NFT_AMOUNT + nftInfo.nft_chain_id, 0);

      upsertState(KEY_IS_DISABLED_STAKING + nftInfo.nft_chain_id, true);
      upsertState(KEY_IS_DISABLED_UNSTAKING + nftInfo.nft_chain_id, true);
    });
    setIsDisabledClaim(true);
  };

  const getBalance = React.useCallback(async () => {
    // checkBalanceTest();

    // get nft contents
    const nftInfos = await getNftInfo();
    checkSnapshotStatus();
    checkTotalValueLockedNftAmount();

    let connected = isConnectedWallet();
    let balance = connected ? lib.utils.fromWei(await lib.eth.getBalance(getConnectedAddress()), 'ether') : 'Unknown';

    setConnectedWallet(connected);
    if (connected) {
      nftInfos.map(nftInfo => {
        checkBalanceOfNft(nftInfo.nft_chain_id)
            .then(balanceOfNft => {
              checkStakingAndLockStatus(balanceOfNft, nftInfo.nft_chain_id);
            });
      });
      await checkRewardStatus();
    }

    // Logging
    console.log("[Web3] ETH network connected: " + connected);
    console.log("[Web3] Network id: " + networkId +", name: " + networkName);
    // console.log("[Web3] Connected account: " + getConnectedAddress());
    console.log("[Web3] ETH Balance: " + balance);
    console.log("[Web3] Provider name: " + providerName);

    console.log("[ENV] REACT_APP_ENV: " + process.env.REACT_APP_ENV);
    console.log("[ENV] eth network: " + environmentConfig.eth_network);

    console.log("[ENV] NFT Contract Address: " + environmentConfig.nftContractAddress);
    console.log("[ENV] staking address to: " + environmentConfig.toStakingAddress);

    console.log("[State] connected wallet: " + connectedWallet);
  }, [accounts, lib.eth, lib.utils]);

  const [connectedWallet, setConnectedWallet] = React.useState(false);

  const { className, ...rest } = props;
  const classes = useStyles();

  const PRICE_ETH_PER_NFT = 0.13;
  const [amountOfNft, setAmountNft] = React.useState(1);
  const [openStakingDialog, setOpenStakingDialog] = React.useState(false);
  const [openUnstakingDialog, setOpenUnstakingDialog] = React.useState(false);

  const [openUnstakingMessageDialog, setOpenUnstakingMessageDialog] = React.useState(false);
  const [dayOfLockUpNft, setDayOfLockUpNft] = React.useState(2);
  const [unstakingMessage, setUnstakingMessage] = React.useState("");

  const [openClaimDialog, setOpenClaimDialog] = React.useState(false);

  const [stakingTransactionUrl, setStakingTransactionUrl] = React.useState("");
  const [claimTransactionUrl, setClaimTransactionUrl] = React.useState("");

  React.useEffect(() => {
    getBalance();
  }, [accounts, getBalance, networkId]);

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
          justify="flex-start"
          alignItems="flex-start"
          xs={6}
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
            xs={6}
            md={6}
        >
          <Button variant="contained" color="primary" size={isMd? "large":"small"} onClick={connectToWallet} disabled={connectedWallet}>
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
              </Grid>
              <Grid item xs={12} align="center">
                <br />
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
              {
                nftInfos.map((nftInfo) =>
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
                                    <a href={nftInfo.nft_url} target='_blank'>
                                      {nftInfo.nft_url}
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
                                              disabled={state.get(KEY_IS_DISABLED_STAKING + nftInfo.nft_chain_id)}>
                                        staking
                                      </Button>
                                      {' '}
                                      <Button onClick={() => requestUnstaking(nftInfo.nft_chain_id)}
                                              disabled={state.get(KEY_IS_DISABLED_UNSTAKING + nftInfo.nft_chain_id)}>
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
                                      {state.get(KEY_STAKED_NFT_AMOUNT + nftInfo.nft_chain_id)} NFT
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
        </Grid>
      </Grid>

      <br/>
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
            <Grid container spacing={isMd ? 5 : 1}>
              <Grid item xs={6} md={6} align={"left"}>
                <Typography component="span" variant="h6">
                  Overview
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} align={"right"}>
                <Button variant="outlined" color="primary" size="large" onClick={claim} disabled={isDisabledClaim}>
                  Claim
                </Button>
              </Grid>
              <Grid item xs={12} md={6} align="left">
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Next snapshot time : { snapshotStatus }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Total value locked NFT : { balanceOfTotalStakedNft }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography component="span" variant="h6">
                  Balance
                </Typography>
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
                  <Typography component="span" variant="subtitle1">
                    Paint Token : { balanceOfRewardPaint }
                  </Typography>
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
                  <Typography component="span" variant="subtitle1">
                    Canvas Token : { 0 }
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>
      </Grid>

      <br/>
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
                  [Debug] Stake NFT
                </Typography>
              }
              align="left"
              disableGutter
          />
        </Grid>

        <Grid item xs={12}>
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" size="large" onClick={() => checkStaked(nftInfos[0].nft_chain_id)} fullWidth disabled={false}>
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
        <DialogTitle id="alert-dialog-slide-title">{"Staking NFT"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Your NFT staking is in progress
            <br/>
            <br/>
            <div hidden={stakingTransactionUrl.length <= 0}>
              <a href={stakingTransactionUrl} target={"_blank"}>View staking transaction</a>
              <br/>
              <br/>
            </div>
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
          open={openUnstakingDialog}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Unstaking NFT"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Your NFT unstaking is in progress
            <br/>
            <br/>
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
          open={openClaimDialog}
          TransitionComponent={Transition}
          keepMounted
          // onClose={handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Claim reward token"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Claiming the reward token
            <br/>
            <br/>
            <div hidden={claimTransactionUrl.length <= 0}>
              <a href={claimTransactionUrl} target={"_blank"}>View claim transaction</a>
              <br/>
              <br/>
            </div>
            <LinearProgress />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
          open={openUnstakingMessageDialog}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Unstaking NFT"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You can't unstaking your NFT.
            <br/>
            Unstaking is possible {dayOfLockUpNft} days after staking.
            <br/>
            <br/>
            Remaining time: {unstakingMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUnstakingMessageDialog(false)} color="primary">
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
