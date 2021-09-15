import React from 'react';
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
import NextSaleNft from "../../../../assets/images/main/next_sale_nft.png";

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
import axios from "axios";
import ReactPlayer from 'react-player'

import {isMobile} from 'react-device-detect';
import CustomizedProgressBars from "../../../../components/molecules/CustomizedProgressBars/CustomizedProgressBars";

console.log("isMobile? " + isMobile);

require('moment-timezone');

Moment.tz.setDefault("Asia/Seoul");

ReactGA.initialize(Config.ga_code);
ReactGA.pageview(window.location.pathname + window.location.search);

// Define token sale date
const AUCTION_DATE = '19-09-2021 21:00:00';
const SALE_DATE = '15-09-2021 21:00:00';

// Define token type
const TOKEN_TYPE_PAINT_NFT = 0;
const TOKEN_TYPE_CANVAS_PAINT_ETH_LP = 1;
const TOKEN_TYPE_CANVAS_NFT = 2;

// Configuration depending on development environment
const environment = process.env.REACT_APP_ENV || 'development';
const isDebugMode = (environment === 'staging') || (environment === 'development') || (environment === 'local');
const environmentConfig = Config[environment];

let isDisabledLP = false;
if (!isDebugMode && isMobile) {
  isDisabledLP = true;
}

// Lock key
const KEY_NFT_AMOUNT = "nft_amount_";
const KEY_STAKED_NFT_AMOUNT = "staked_nft_amount_";
const KEY_STAKED_PAINT_ETH_LP_AMOUNT = "staked_nft_amount_-1";

const KEY_IS_DISABLED_STAKING = "is_disabled_staking_";
const KEY_IS_DISABLED_UNSTAKING = "is_disabled_unstaking_";

const KEY_IN_PROGRESS_UNSTAKING_NFT_CHAIN_ID = "in_progress_unstaking_nft_chain_id";

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
    color: 'white',
    background: '#2E3348CC'
  },
  paperSub: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: 'white',
    background: '#2E3348CC'
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

  const checkMainnetNetworkTest = async() => {
    // Test - NFT contract
    const ethNetwork = Config["production"].eth_network;
    const account = "0x63D3C9753C13Dc72E6468c217aE6E268471033bF";
    const nftContractAbi = Config["production"].nftContractAbi;
    const nftContractAddress = Config["production"].nftContractAddress;

    const Web3 = require('web3');
    const web3 = new Web3(ethNetwork);

    const nft_chain_id = 2;

    console.log("[PROD] web3 test - web3ContextTest: " + ethNetwork);
    console.log("[PROD] web3 test - nftContractAbi: " + nftContractAbi);
    console.log("[PROD] web3 test - nftContractAddress: " + nftContractAddress);
    console.log("[PROD] web3 test - nft chain id: " + nft_chain_id);

    const nftContract = new web3.eth.Contract(nftContractAbi, nftContractAddress, {
      from: account // default from address
    });

    const balanceOfNft = await nftContract.methods.balanceOf(account, nft_chain_id).call();
    console.log("[PROD] web3 test - account: " + account +", balanceOf : " + balanceOfNft);
  };

  const getConnectedAddress = () => {
    console.log("check connected address. accounts: " + accounts);
    if (isConnectedWallet && accounts !== null && accounts.length > 0) {
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

  const requestStakingPaintEthLp = () => {
    if (!isValidNetwork()) {
      return;
    }

    requestTransforPaintEthLp();
  };

  const requestTransforPaintEthLp = async() => {
    setOpenStakingDialog(true);
    setStakingDialogContext("Your PAINT-ETH LP staking is in progress");
    setStakingTransactionUrl("");

    const amount = balanceOfPaintEthLp;
    const fromAddress = getConnectedAddress();
    const toAddress = environmentConfig.toStakingAddress;

    try {
      const nftContract = new lib.eth.Contract(environmentConfig.PAINT_ETH_LP_CONTRACT_ABI, environmentConfig.PAINT_ETH_LP_CONTRACT_ADDRESS, {
        from: fromAddress,
        gasPrice: await getFastGasPriceWei(environmentConfig.ETHERSCAN_IO_GAS_PRICE_URL)
      });

      if (amount <= 0) {
        console.log("staking PATIN-ETH LP > No found balanceOf");
        return;
      }

      const balanceWei = await lib.utils.toWei(amount, 'ether');
      await nftContract.methods.transfer(toAddress, balanceWei).send()
          .on('transactionHash', function(hash) {
            console.log("staking PATIN-ETH LP > transactionHash: " + hash);
            setStakingTransactionUrl(environmentConfig.etherscan_url + hash);

            requestBackend.registerStaking(BACKEND_URL, fromAddress, -1, amount, hash)
                .then(response => {
                  console.log("staking PATIN-ETH LP > staking status: " + response.status);
                  setOpenStakingDialog(false);
                  window.location.reload();
                });
          })
          .on('receipt', function(receipt){
            console.log("staking > receipt: " + receipt);
          })
          .on('error', function(error, receipt) {
            console.log("staking > error: " + error);
          });
    } catch (e) {
      window.location.reload();
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

  const confirmtUnstaking = (nft_chain_id) => {
    setOpenUnstakingConfirmDialog(true);
    upsertState(KEY_IN_PROGRESS_UNSTAKING_NFT_CHAIN_ID, nft_chain_id);
  };

  const requestUnstaking = (nft_chain_id) => {
    if (!isValidNetwork()) {
      return;
    }

    if (connectedWallet) {
      console.log("unstaking");
      requestTransforNftFromStaked(nft_chain_id);
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

  const getPaintEthLpContract = async() => {
    const paintEthLpContract = new lib.eth.Contract(environmentConfig.PAINT_ETH_LP_CONTRACT_ABI, environmentConfig.PAINT_ETH_LP_CONTRACT_ADDRESS, {
      from: getConnectedAddress() // default from address
    });

    return paintEthLpContract;
  };

  const checkBalanceOfNft = async(nft_chain_id) => {
    console.log("Check balance of nft. nft chain id: " + nft_chain_id);

    const nftContract = await getNftContract();

    let balanceOfNft = await nftContract.methods.balanceOf(getConnectedAddress(), nft_chain_id).call();

    console.log("Check balance of nft: " + balanceOfNft);
    upsertState(KEY_NFT_AMOUNT + nft_chain_id, balanceOfNft);

    return balanceOfNft;
  };

  const checkBalanceOfPaintEthLP = async() => {
    const paintEthLpContract = await getPaintEthLpContract();

    const balanceWei = await paintEthLpContract.methods.balanceOf(getConnectedAddress()).call();
    const balanceEther = await lib.utils.fromWei(balanceWei, 'ether');
    console.log("Check balance of PAINT-ETH LP: " + balanceEther);
    setBalanceOfPaintEthLp(balanceEther);

    return balanceEther;
  };

  const checkTotalValueLockedNftAmount = async() => {
    const responseOfPaint = await requestBackend.getTotalValueLockedNftAmount(BACKEND_URL, getConnectedAddress(), TOKEN_TYPE_PAINT_NFT);
    if (responseOfPaint.status === 200 && responseOfPaint.data.length > 0) {
      console.log(responseOfPaint.data);
      const result = responseOfPaint.data[0];
      const amount = result.totalValueLockedNftAmount | 0;

      setBalanceOfTotalPaintStakedNft(amount);
    } else {
      setBalanceOfTotalPaintStakedNft(0);
    }

    const responseOfPaintEthLP = await requestBackend.getTotalValueLockedNftAmount(BACKEND_URL, getConnectedAddress(), TOKEN_TYPE_CANVAS_PAINT_ETH_LP);
    if (responseOfPaintEthLP.status === 200 && responseOfPaintEthLP.data.length > 0) {
      console.log(responseOfPaintEthLP.data);
      const result = responseOfPaintEthLP.data[0];
      const amount = result.totalValueLockedNftAmount | 0;

      console.log("responseOfPaintEthLP: " + amount);
      setBalanceOfTotalLpStakedNft(amount);
    } else {
      setBalanceOfTotalLpStakedNft(0);
    }

    const responseOfCanvasNft = await requestBackend.getTotalValueLockedNftAmount(BACKEND_URL, getConnectedAddress(), TOKEN_TYPE_CANVAS_NFT);
    if (responseOfCanvasNft.status === 200 && responseOfCanvasNft.data.length > 0) {
      console.log(responseOfCanvasNft.data);
      const result = responseOfCanvasNft.data[0];
      const amount = result.totalValueLockedNftAmount | 0;

      console.log("responseOfCanvasNft: " + amount);
      setBalanceOfTotalCanvasNft(amount);
    } else {
      setBalanceOfTotalCanvasNft(0);
    }
  };

  const checkStakingAndLockStatus = async(balanceOfNft, nft_chain_id) => {
    try {
      const isStaked = await checkStaked(nft_chain_id);

      console.log("checkStakingAndLockStatus > isStaked: " + isStaked);
      console.log("checkStakingAndLockStatus > state.get(KEY_NFT_AMOUNT + nft_chain_id): " + state.get(KEY_NFT_AMOUNT + nft_chain_id) + ", nft chain id: " + nft_chain_id);

      if (isStaked && balanceOfNft <= 0) {
        upsertState(KEY_IS_DISABLED_STAKING + nft_chain_id, true);
        upsertState(KEY_IS_DISABLED_UNSTAKING + nft_chain_id, false);
      } else if (!isStaked && balanceOfNft > 0) {
        upsertState(KEY_IS_DISABLED_STAKING + nft_chain_id, false);
        upsertState(KEY_IS_DISABLED_UNSTAKING + nft_chain_id, true);
      } else if (isStaked && balanceOfNft > 0) {
        upsertState(KEY_IS_DISABLED_STAKING + nft_chain_id, false);
        upsertState(KEY_IS_DISABLED_UNSTAKING + nft_chain_id, false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkStakingPaintEthLp = async(balance) => {
    try {
      const isStaked = await checkStaked(-1);
      console.log("checkStakingPaintEthLp > isStaked: " + isStaked);

      if (isStaked && balance <= 0) {
        setIsDisabledStakingPaintEthLp(true);
        setIsDisabledUnstakingPaintEthLp(false);
      } else if (!isStaked && balance > 0) {
        setIsDisabledStakingPaintEthLp(false);
        setIsDisabledUnstakingPaintEthLp(true);
      } else if (isStaked && balance > 0) {
        setIsDisabledStakingPaintEthLp(false);
        setIsDisabledUnstakingPaintEthLp(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkStaked = async (nft_chain_id) => {
    const response = await requestBackend.getStaked(BACKEND_URL, getConnectedAddress(), nft_chain_id);
    let staked;

    if (response.status === 200) {
      const result = response.data;
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
    const responsePaint = await requestBackend.snapshotAndRewardToken(BACKEND_URL, TOKEN_TYPE_PAINT_NFT, getConnectedAddress());
    const responsePaintEthLp = await requestBackend.snapshotAndRewardToken(BACKEND_URL, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, getConnectedAddress());
    const responseCanvasNft = await requestBackend.snapshotAndRewardToken(BACKEND_URL, TOKEN_TYPE_CANVAS_NFT, getConnectedAddress());

    console.log(responsePaint);
    console.log(responsePaintEthLp);
    console.log(responseCanvasNft);

    await checkRewardStatusPaint();
    await checkRewardStatusPaintEthLp();
    await checkRewardStatusCanvasNft();
  };

  const checkRewardStatusPaint = async () => {
    console.log("Check reward status");

    setIsDisabledPaintClaim(true);

    const response = await requestBackend.getReward(BACKEND_URL, getConnectedAddress(), TOKEN_TYPE_PAINT_NFT);

    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const tokenAmount = result.token_amount || 0;

      console.log("reward token amount: " + tokenAmount);

      if (tokenAmount > 0) {
        setIsDisabledPaintClaim(false);
      }

      setBalanceOfRewardPaint(tokenAmount);

      return tokenAmount;
    } else {
      setBalanceOfRewardPaint(0);
      return 0;
    }
  };

  const checkRewardStatusPaintEthLp = async () => {
    console.log("Check reward status");

    setIsDisabledPaintEthLpClaim(true);

    const response = await requestBackend.getReward(BACKEND_URL, getConnectedAddress(), TOKEN_TYPE_CANVAS_PAINT_ETH_LP);

    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const tokenAmount = result.token_amount || 0;

      console.log("reward token amount: " + tokenAmount);

      if (tokenAmount > 0) {
        setIsDisabledPaintEthLpClaim(false);
      }

      setBalanceOfRewardPaintEthLp(tokenAmount);

      return tokenAmount;
    } else {
      setBalanceOfRewardPaintEthLp(0);
      return 0;
    }
  };

  const checkRewardStatusCanvasNft = async () => {
    console.log("Canvas NFT Check reward status");

    setIsDisabledCanvasNftClaim(true);

    const response = await requestBackend.getReward(BACKEND_URL, getConnectedAddress(), TOKEN_TYPE_CANVAS_NFT);

    if (response.status === 200 && response.data.length > 0) {
      const result = response.data[0];
      const tokenAmount = result.token_amount || 0;

      console.log("Canvas NFT reward token amount: " + tokenAmount);

      if (tokenAmount > 0) {
        setIsDisabledCanvasNftClaim(false);
      }

      setBalanceOfRewardCanvasNft(tokenAmount);

      return tokenAmount;
    } else {
      setBalanceOfRewardCanvasNft(0);
      return 0;
    }
  };

  const claim = async (tokenType) => {
    try {
      setOpenClaimDialog(true);
      setClaimTransactionUrl("");

      console.log("claim > token type: " + tokenType);
      const response = await requestBackend.approve(BACKEND_URL, getConnectedAddress(), tokenType);

      if (response.status === 200) {
        const approved_token_amount = response.data.approved_token_amount;
        console.log("claim > approved_token_amount: " + approved_token_amount);

        let rewardTokenAmount = 0;
        requestTransferFromPaintToken(tokenType, approved_token_amount, function () {
          switch (tokenType) {
            case TOKEN_TYPE_PAINT_NFT:
              rewardTokenAmount = checkRewardStatusPaint();
              break;
            case TOKEN_TYPE_CANVAS_PAINT_ETH_LP:
              rewardTokenAmount = checkRewardStatusPaintEthLp();
              break;
            case TOKEN_TYPE_CANVAS_NFT:
              rewardTokenAmount = checkRewardStatusCanvasNft();
              break;
          }
          console.log("claim > rewardTokenAmount: " + rewardTokenAmount);
          setOpenClaimDialog(false);
        });
      }
    } catch {
      window.location.reload();
    }
  };

  const requestTransferFromPaintToken = async(tokenType, approved_token_amount, callback) => {
    try {
      // Web3: call allowance api

      let contractAbi;
      let contractAddress;
      switch (tokenType) {
        case TOKEN_TYPE_PAINT_NFT:
          contractAbi = environmentConfig.PAINT_TOKEN_CONTRACT_ABI;
          contractAddress = environmentConfig.PAINT_TOKEN_CONTRACT_ADDRESS;
          break;
        case TOKEN_TYPE_CANVAS_PAINT_ETH_LP:
          contractAbi = environmentConfig.CANVAS_TOKEN_CONTRACT_ABI;
          contractAddress = environmentConfig.CANVAS_TOKEN_CONTRACT_ADDRESS;
          break;
        case TOKEN_TYPE_CANVAS_NFT:
          contractAbi = environmentConfig.CANVAS_TOKEN_CONTRACT_ABI;
          contractAddress = environmentConfig.CANVAS_TOKEN_CONTRACT_ADDRESS;
          break;
      }

      let contract = new lib.eth.Contract(contractAbi, contractAddress, {
        from: getConnectedAddress()
      });

      let tokenAmount = await contract.methods.allowance(environmentConfig.toStakingAddress, getConnectedAddress()).call();
      console.log("requestTransferFromPaintToken > contractAddress: " + contractAddress);
      console.log("requestTransferFromPaintToken > allowance token amount: " + tokenAmount);
      console.log("requestTransferFromPaintToken > approved token amount: " + approved_token_amount);

      // Web3: send transferFrom api
      contract = new lib.eth.Contract(contractAbi, contractAddress, {
        from: getConnectedAddress(), // default from address
        gasPrice: await getFastGasPriceWei(environmentConfig.ETHERSCAN_IO_GAS_PRICE_URL)
      });

      contract.methods.transferFrom(environmentConfig.toStakingAddress, getConnectedAddress(), lib.utils.toWei(approved_token_amount.toString(), 'ether')).send()
          .on('transactionHash', function(hash){
            console.log("transactionHash: " + hash);
            setClaimTransactionUrl(environmentConfig.etherscan_url + hash);

            requestBackend.claim(BACKEND_URL, getConnectedAddress(), tokenType, hash)
                .then(response => {
                  console.log("claim > claim status: " + response.status);
                  callback();
                });
          })
          .on('receipt', function(receipt){
            console.log("receipt: " + receipt);
          })
          .on('error', function(error, receipt) {
            console.log("error");
            callback();
          });
    } catch (e) {
      console.error(e);
      throw new Error("transferFromPaintToken is failed");
    }
  };

  const checkSnapshotStatus = async () => {
    const responseOfPaint = await requestBackend.getSnapshot(BACKEND_URL, TOKEN_TYPE_PAINT_NFT, getConnectedAddress());

    console.log(responseOfPaint);
    if (responseOfPaint.status === 200 && responseOfPaint.data.length > 0) {
      const result = responseOfPaint.data[0];
      const snapshot_time = result.snapshot_time || "";
      setSnapshotPaintStatus(snapshot_time);
    } else {
      setSnapshotPaintStatus("");
    }

    const responseOfCanvas = await requestBackend.getSnapshot(BACKEND_URL, TOKEN_TYPE_CANVAS_PAINT_ETH_LP, getConnectedAddress());
    console.log(responseOfCanvas);
    if (responseOfCanvas.status === 200 && responseOfCanvas.data.length > 0) {
      const result = responseOfCanvas.data[0];
      const snapshot_time = result.snapshot_time || "";
      setSnapshotCanvasStatus(snapshot_time);
    } else {
      setSnapshotCanvasStatus("");
    }

    const responseOfCanvasNft = await requestBackend.getSnapshot(BACKEND_URL, TOKEN_TYPE_CANVAS_NFT, getConnectedAddress());
    console.log(responseOfCanvasNft);
    if (responseOfCanvasNft.status === 200 && responseOfCanvasNft.data.length > 0) {
      const result = responseOfCanvasNft.data[0];
      const snapshot_time = result.snapshot_time || "TBA";
      setSnapshotCanvasNftStatus(snapshot_time);
    } else {
      setSnapshotCanvasNftStatus("TBA");
    }
  };

  const getFastGasPriceWei = async(etherScanGasPriceUrl) => {
    console.info(`[Web3] Try to getting fast gas price. ${etherScanGasPriceUrl}`);

    const avgGasPrice = await lib.eth.getGasPrice();
    console.info(`[Web3] average gas price: ${avgGasPrice}`);

    try {
      const result = await axios.get(etherScanGasPriceUrl);
      console.info(`[Web3] result message from Etherscan: ${result.data.message}`);

      if (result.data.message === "OK") {
        const fastGasPrice = result.data.result.FastGasPrice;
        console.info(`[Web3] fast gas price (gwei) from Etherscan : ${fastGasPrice}`);
        console.info(`[Web3] fast gas price (wei) from Etherscan : ${lib.utils.toWei(fastGasPrice.toString(), 'gwei')}`);

        if (fastGasPrice > 100) {
          console.error(`[Web3] Too high gas price`);
          return avgGasPrice;
        }

        return lib.utils.toWei(fastGasPrice.toString(), 'gwei');
      } else {
        return avgGasPrice;
      }
    } catch (e) {
      console.error(`[Web3] error: ${e}`);
      return avgGasPrice;
    }
  };

  const requestTransforNft = async(nft_chain_id) => {
    setOpenStakingDialog(true);
    setStakingDialogContext("Your NFT staking is in progress");
    setStakingTransactionUrl("");

    const amountOfNft = state.get(KEY_NFT_AMOUNT + nft_chain_id);
    const fromAddress = getConnectedAddress();
    const toAddress = environmentConfig.toStakingAddress;

    try {
      const nftContract = new lib.eth.Contract(environmentConfig.nftContractAbi, environmentConfig.nftContractAddress, {
        from: fromAddress,
        gasPrice: await getFastGasPriceWei(environmentConfig.ETHERSCAN_IO_GAS_PRICE_URL)
      });

      if (amountOfNft <= 0) {
        console.log("staking > No found balanceOf");
        return;
      }

      await nftContract.methods.safeTransferFrom(fromAddress, toAddress, nft_chain_id, amountOfNft, "0x00").send()
          .on('transactionHash', function(hash){
            console.log("staking > transactionHash: " + hash);
            setStakingTransactionUrl(environmentConfig.etherscan_url + hash);

            requestBackend.registerStaking(BACKEND_URL, fromAddress, nft_chain_id, amountOfNft, hash)
                .then(response => {
                  console.log("staking > staking status: " + response.status);

                  setOpenStakingDialog(false);

                  window.location.reload();

                  // fixme: 자신의 NFT 수량이 업데이트가 바로 되지 않는 문제가 있음. 추후 확인이 필요함.
                  // checkBalanceOfNft(nft_chain_id)
                  //     .then(balanceOfNft => {
                  //       checkStakingAndLockStatus(balanceOfNft, nft_chain_id);
                  //       checkTotalValueLockedNftAmount();
                  //     });
                });
          })
          .on('receipt', function(receipt){
            console.log("staking > receipt: " + receipt);
          })
          .on('error', function(error, receipt) {
            console.log("staking > error: " + error);
          });
    } catch (e) {
      window.location.reload();
    }
  };

  const requestTransforNftFromStaked = async(nft_chain_id) => {
    try {
      console.log("request unstaking. nft chain id: " + nft_chain_id);
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

  const [isDisabledPaintClaim, setIsDisabledPaintClaim] = React.useState(true);

  const [balanceOfTotalPaintStakedNft, setBalanceOfTotalPaintStakedNft] = React.useState(0);

  const [balanceOfRewardPaint, setBalanceOfRewardPaint] = React.useState(0);

  const [snapshotPaintStatus, setSnapshotPaintStatus] = React.useState("");

  const [nftInfos, setNftInfos] = React.useState([]);
  const [state, setState] = React.useState(new Map());

  // PAINT-ETH LP
  const [snapshotCanvasStatus, setSnapshotCanvasStatus] = React.useState("");

  const [balanceOfTotalLpStakedNft, setBalanceOfTotalLpStakedNft] = React.useState(0);

  const [balanceOfPaintEthLp, setBalanceOfPaintEthLp] = React.useState(0);
  const [balanceOfRewardPaintEthLp, setBalanceOfRewardPaintEthLp] = React.useState(0);

  const [isDisabledStakingPaintEthLp, setIsDisabledStakingPaintEthLp] = React.useState(true);
  const [isDisabledUnstakingPaintEthLp, setIsDisabledUnstakingPaintEthLp] = React.useState(true);
  const [isDisabledPaintEthLpClaim, setIsDisabledPaintEthLpClaim] = React.useState(true);

  // CANVAS NFT
  const [snapshotCanvasNftStatus, setSnapshotCanvasNftStatus] = React.useState("TBA");

  const [balanceOfTotalCanvasNft, setBalanceOfTotalCanvasNft] = React.useState(0);

  const [balanceOfRewardCanvasNft, setBalanceOfRewardCanvasNft] = React.useState(0);

  const [isDisabledCanvasNftClaim, setIsDisabledCanvasNftClaim] = React.useState(true);

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
    upsertState(KEY_STAKED_PAINT_ETH_LP_AMOUNT, 0);

    nftInfos.map(nftInfo => {
      upsertState(KEY_NFT_AMOUNT + nftInfo.nft_chain_id, 0);
      upsertState(KEY_STAKED_NFT_AMOUNT + nftInfo.nft_chain_id, 0);

      upsertState(KEY_IS_DISABLED_STAKING + nftInfo.nft_chain_id, true);
      upsertState(KEY_IS_DISABLED_UNSTAKING + nftInfo.nft_chain_id, true);
    });
    setIsDisabledPaintClaim(true);
  };

  const isMp4Url = (url) => {
    const extension = url.split(/[#?]/)[0].split('.').pop().trim();

    if (extension === "mp4") {
      return true;
    }
    return false;
  };

  const getBalance = React.useCallback(async () => {
    // checkMainnetNetworkTest();

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
      await checkRewardStatusPaint();
      await checkRewardStatusPaintEthLp();
      await checkRewardStatusCanvasNft();

      checkBalanceOfPaintEthLP()
          .then(balance => {
            console.log("balanceOfPaintEthLP: " + balance);
            checkStakingPaintEthLp(balance);
          })
    }

    // check after token sale
    checkIsAfterTokenSale(SALE_DATE);

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

  const [openStakingDialog, setOpenStakingDialog] = React.useState(false);
  const [openUnstakingDialog, setOpenUnstakingDialog] = React.useState(false);

  const [openUnstakingMessageDialog, setOpenUnstakingMessageDialog] = React.useState(false);
  const [dayOfLockUpNft, setDayOfLockUpNft] = React.useState(2);
  const [unstakingMessage, setUnstakingMessage] = React.useState("");

  const [openClaimDialog, setOpenClaimDialog] = React.useState(false);

  const [openUnstakingConfirmDialog, setOpenUnstakingConfirmDialog] = React.useState(false);

  const [stakingDialogContext, setStakingDialogContext] = React.useState("");
  const [stakingTransactionUrl, setStakingTransactionUrl] = React.useState("");
  const [claimTransactionUrl, setClaimTransactionUrl] = React.useState("");

  // Countdown token sale
  const [afterTokenSale, setAfterTokenSale] = React.useState(false);
  const [afterTokenSaleSubject, setAfterTokenSaleSubject] = React.useState("Veiled");
  const [afterTokenSaleImageUrl, setAfterTokenSaleImageUrl] = React.useState("https://ngfinance.io/resources/blank.jpg");

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
                Current opened auction
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
        >
          {/*<Image*/}
          {/*    src={NextSaleNft}*/}
          {/*    alt="Genesis NFT"*/}
          {/*    style={{ width: '100%', height:'100%' }}*/}
          {/*    className={classes.image}*/}
          {/*    data-aos="flip-left"*/}
          {/*    data-aos-easing="ease-out-cubic"*/}
          {/*    data-aos-duration="2000"*/}
          {/*/>*/}
          <ReactPlayer
              url={"https://ngfinance.io/resources/metroPainting.mp4"}
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
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomizedProgressBars saleDate={AUCTION_DATE} isStart={false}/>
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
                            Governance NFT
                          </Typography>
                          <Typography variant="caption" className={classes.tag} >
                            Redeemable
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
                          <strong>Metro painting</strong>
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
                      Metro painting
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className={classes.gridItemMain}>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" color={"primary"}>
                      CLOSING DATE
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="subtitle1">
                      September 19 at 21:00 KST
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <Typography component="span" variant="body1" color="textSecondary">
                          Reserve price
                        </Typography>{' '}
                        <Typography component="span" variant="h6" color="textPrimary">
                          <strong>0.37</strong>
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
                    {/*Total amount : {amountOfNft} NFT*/}
                    Total amount : 1
                  </Typography>
                </span>
              </Grid>
              <Grid item xs={12} align="center">
                <br />
                <Button variant="contained" color="primary" size="large"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("https://rarible.com/token/0x4dfd4f4aa74b62614597e6f5417f70a6fa7a9f45:2?tab=bids", '_blank');
                        }}
                        fullWidth
                        disabled={false}>
                  Place a bid
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
        >
          <SectionHeader
              title={
                <Typography variant="h5">
                  Next open sale
                </Typography>
              }
              align="left"
              disableGutter
          />
        </Grid>
        <Grid
            item
            container
            justify="flex-start"
            alignItems="flex-start"
            xs={12}
            md={6}
        >
          <Image
              src={afterTokenSaleImageUrl}
              alt="Genesis NFT"
              style={{ width: '100%', height:'100%' }}
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
                <CustomizedProgressBars saleDate={SALE_DATE} isStart={true}/>
              </Grid>
              <Grid item xs={9}>
                <SectionHeader
                    title={
                      <span>
                        <div>
                          <Typography variant="caption" className={classes.tag} >
                            Governance NFT
                          </Typography>
                          <Typography variant="caption" className={classes.tag} >
                            Only Paint payable
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
                          <strong>{afterTokenSaleSubject}</strong>
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
                      {afterTokenSaleSubject}
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
                      September 15 at 21:00 KST
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <SectionHeader
                    title={
                      <span>
                        <Typography component="span" variant="body1" color="textSecondary">
                          Minimum price
                        </Typography>{' '}
                        <Typography component="span" variant="h6" color="textPrimary">
                          <strong>200000</strong>
                        </Typography>{' '}
                        <Typography component="span" variant="body1" color="textSecondary">
                          PAINT
                        </Typography>
                      </span>
                    }
                    align="left"
                    disableGutter
                    titleVariant="h3"
                />
              </Grid>
              <Grid item xs={12} align="center">
                <br />
                <Button variant="contained" color="primary" size="large"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open("https://docs.google.com/forms/d/1u6HITfQuZtRA44cI0ICj6yvpTl6XwL0TnG5W0klB1nA/edit", '_blank');
                        }}
                        fullWidth
                        disabled={!afterTokenSale}>
                  Register
                </Button>
              </Grid>
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
                                  hidden={isMp4Url(nftInfo.image_url)}
                                  style={{height:'100%', width: '100%'}}
                                  alt="Genesis NFT"
                                  className={classes.image}
                                  data-aos="flip-left"
                                  data-aos-easing="ease-out-cubic"
                                  data-aos-duration="2000"
                              />

                              <ReactPlayer
                                  url={nftInfo.image_url}
                                  hidden={!isMp4Url(nftInfo.image_url)}
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
                            >
                              <Grid item xs={12}>
                                <SectionHeader
                                    title={
                                      <span>
                                        <Typography variant="subtitle1" color={"textSecondary"} hidden={(nftInfo.token_type === TOKEN_TYPE_PAINT_NFT ? false : true)}>
                                          Utility NFT
                                        </Typography>
                                        <Typography variant="subtitle1" color={"textSecondary"} hidden={(nftInfo.token_type === TOKEN_TYPE_CANVAS_NFT ? false : true)}>
                                          Governance NFT
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
                                        stake
                                      </Button>
                                      {' '}
                                      <Button onClick={() => confirmtUnstaking(nftInfo.nft_chain_id)}
                                              disabled={state.get(KEY_IS_DISABLED_UNSTAKING + nftInfo.nft_chain_id)}>
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
      >
        <Grid item xs={12} style={{marginBottom: '15px'}}>
          <SectionHeader
              title={
                <Typography variant="h5">
                  Staking
                </Typography>
              }
              align="left"
              disableGutter
          />
        </Grid>
        <Grid item xs={12} style={{marginBottom: '30px'}}>
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.deepOrange[900]}` }}>
            <Grid container spacing={isMd ? 5 : 1}>
              <Grid item xs={6} md={6} align={"left"}>
                <Typography component="span" variant="h5" style={{color: `${colors.deepOrange[900]}`}}>
                  NFT Staking (PAINT)
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} align={"right"}>
                <Button variant="outlined" color="primary" size="large" onClick={() => claim(TOKEN_TYPE_PAINT_NFT)} disabled={isDisabledPaintClaim}>
                  Claim
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} align="left">
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Next snapshot date : { snapshotPaintStatus }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Total number of NFT locked : { balanceOfTotalPaintStakedNft }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    PAINT : 0x83e031005ecb771b7ff900b3c7b0bdde7f521c08
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography component="span" variant="h6">
                  Token Drop Balance
                </Typography>
              </Grid>
              <Grid
                  item xs={12}
              >
                <Grid
                    container
                    xs={12}
                    alignContent="flex-start"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
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
              </Grid>
            </Grid>
          </CardBase>
        </Grid>

        <br/>
        <br/>

        <Grid item xs={12} style={{marginBottom: '30px'}}>
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.green[900]}` }}>
            <Grid container spacing={isMd ? 5 : 1}>
              <Grid item xs={6} md={6} align={"left"}>
                <Typography component="span" variant="h5" style={{color: `${colors.green[900]}`}}>
                  NFT Staking (CANVAS)
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} align={"right"}>
                <Button variant="outlined" color="primary" size="large" onClick={() => claim(TOKEN_TYPE_CANVAS_NFT)} disabled={isDisabledCanvasNftClaim}>
                  Claim
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} align="left">
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Next snapshot date : { snapshotCanvasNftStatus }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Total number of NFT locked : { balanceOfTotalCanvasNft }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    CANVAS : 0x863ad391091ae0e87b850c2bb7bfc7597c79c93f
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography component="span" variant="h6">
                  Token Drop Balance
                </Typography>
              </Grid>
              <Grid
                  item xs={12}
              >
                <Grid
                    container
                    xs={12}
                    alignContent="flex-start"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                  <Grid item>
                    <Image src={CanvasToken}
                           style={{ width: '120px', height:'120px' }}/>
                  </Grid>
                  <Grid item
                        alignItems=""
                        justify="center">
                    <Typography component="span" variant="subtitle1">
                      Canvas Token : { balanceOfRewardCanvasNft }
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>

        <Grid item xs={12}>
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.deepPurple[900]}` }}>
            <Grid container spacing={isMd ? 5 : 1}>
              <Grid item xs={6} md={6} align={"left"}>
                <Typography component="span" variant="h5" style={{color: `${colors.deepPurple[900]}`}}>
                  PAINT/ETH LP Staking
                </Typography>
              </Grid>
              <Grid item xs={6} md={6} align={"right"}>
                <ButtonGroup size="small" color="primary" aria-label="large outlined primary button group" disabled={isDisabledLP}>
                  <Button variant="outlined" color="primary" size="large" onClick={requestStakingPaintEthLp} disabled={isDisabledStakingPaintEthLp}>
                    Stake
                  </Button>
                  <Button variant="outlined" color="primary" size="large" onClick={() => confirmtUnstaking(-1)} disabled={isDisabledUnstakingPaintEthLp}>
                    Unstake
                  </Button>
                  <Button variant="outlined" color="primary" size="large" onClick={() => claim(TOKEN_TYPE_CANVAS_PAINT_ETH_LP)} disabled={isDisabledPaintEthLpClaim}>
                    Claim
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid item xs={12} md={12} align={"left"}>
                <Typography component="span" variant="overline" color="error">
                  The mobile meta mask is currently under maintenance.
                  <br/>
                  Currently, only desktop meta mask is available.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} align="left">
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Next snapshot date : { snapshotCanvasStatus }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Total number of LP locked : { balanceOfTotalLpStakedNft }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={12}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    CANVAS : 0x863ad391091ae0e87b850c2bb7bfc7597c79c93f
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <Typography component="span" variant="h6">
                  Your LP Token Balance
                </Typography>
              </Grid>
              <Grid
                  item xs={12}
              >
                <Paper className={classes.paperSub}>
                  <Typography component="span" variant="subtitle1">
                    Your PAINT/ETH LP : { balanceOfPaintEthLp }
                  </Typography>
                  <br/>
                  <Typography component="span" variant="subtitle1">
                    Staked PAINT/ETH LP : {state.get(KEY_STAKED_PAINT_ETH_LP_AMOUNT)}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography component="span" variant="h6">
                  Token Drop Balance
                </Typography>
              </Grid>
              <Grid
                  item xs={12}
              >
                <Grid
                    container
                    xs={12}
                    alignContent="flex-start"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                  <Grid item>
                    <Image src={CanvasToken}
                           style={{ width: '120px', height:'120px' }}/>
                  </Grid>
                  <Grid item>
                    <Typography component="span" variant="subtitle1">
                      Canvas Token : { balanceOfRewardPaintEthLp }
                    </Typography>
                  </Grid>
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
                <Button variant="contained" color="primary" size="large" onClick={checkRewardStatusPaint} fullWidth disabled={false}>
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
            { stakingDialogContext }
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
        <DialogTitle id="alert-dialog-slide-title">{"Unstaking"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Unstaking is in progress
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
            You can't unstake your NFT.
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
      <Dialog
          open={openUnstakingConfirmDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setOpenUnstakingConfirmDialog(false)}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Confirm unstaking your NFT "}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to unstaking?
          </DialogContentText>
          <DialogActions>
            <Button onClick={() => {
              requestUnstaking(state.get(KEY_IN_PROGRESS_UNSTAKING_NFT_CHAIN_ID));
              setOpenUnstakingConfirmDialog(false);
            }} color="primary">
              Confirm
            </Button>
            <Button onClick={() => setOpenUnstakingConfirmDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </DialogContent>
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
