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
import axios from "axios";

import Config from '../../../../config.json';

// Configuration depending on development environment
const defaultConfig = Config.development;
const environment = process.env.REACT_APP_ENV || 'development';
const environmentConfig = Config[environment];

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
      const nftBalance = Number(paidEth) / priceOfEth;

      console.log("summarized ETH: " + paidEth);
      console.log("NFT: " + nftBalance);

      setNftTxList(txList);

      return nftBalance;
    } catch (e) {
      console.error(e);
    }
  };

  const requestAuth = async web3Context => {
    console.log("REACT_APP_ENV environment: " + process.env.REACT_APP_ENV);
    console.log(environmentConfig.address_to);
    console.log(environmentConfig.eth_network);
    try {
      await web3Context.requestAuth();
    } catch (e) {
      console.error(e);
    }
  };

  const requestTransfer = async() => {
    try {
      const amountOfEth = summarizedPrice;
      const amountToSend = lib.utils.toWei(amountOfEth.toString(), 'ether'); // Convert to wei value

      setSendingTransaction(true);

      console.log("amount of ETH: " + amountOfEth);

      let send = await lib.eth.sendTransaction({
        from: accounts[0],
        to: environmentConfig.address_to,
        value: amountToSend
      }).then(ts => {
        console.log("ETH transaction result: " + ts);
        setSendingTransaction(false);
        window.location.reload();
      });
    } catch (e) {
      console.error(e);
      setSendingTransaction(false);
    }
  };

  const requestAccess = () => {
    if (connectedWallet) {
      console.log("transfer crypto");
      requestTransfer()
    } else {
      console.log("connect to wallet");
      requestAuth(web3Context);
    }
  };

  const [nftTxList, setNftTxList] = React.useState([]);
  const [sendingTransaction, setSendingTransaction] = React.useState(false);
  const [nftBalance, setNftBalance] = React.useState(0);
  const [balance, setBalance] = React.useState(0);
  const getBalance = React.useCallback(async () => {
    let connected = false;
    if (accounts && accounts.length > 0) {
      connected = true;
    }

    let balance = connected ? lib.utils.fromWei(await lib.eth.getBalance(accounts[0]), 'ether') : 'Unknown';

    console.log(connected);
    setConnectedWallet(connected);
    if (connected) {
      setConnectButtonText("Buy NFT");
      const nftBalance = await getTransactionList(PRICE_ETH_PER_NFT, accounts[0], lib);
      setNftBalance(nftBalance);
    } else {
      setConnectButtonText("Connect Wallet");
      setNftBalance(0);
    }

    setBalance(balance);
  }, [accounts, lib.eth, lib.utils]);

  const [connectedWallet, setConnectedWallet] = React.useState(false);
  const [connectButtonText, setConnectButtonText] = React.useState();
  ////////////////////

  const { className, ...rest } = props;
  const classes = useStyles();

  const PRICE_ETH_PER_NFT = 0.13;
  const [amountOfNft, setAmountNft] = React.useState(1);
  const [summarizedPrice, setSummarizedPrice] = React.useState(PRICE_ETH_PER_NFT);

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
      >
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
                    titleVariant="h2"
                />
              </Grid>
              <Grid item xs={8}>
                <SectionHeader
                    subtitle={
                      <span>
                        <div style={{ marginBottom: "18px" }}>
                          <Typography variant="caption" className={classes.tag} >
                            Genesis
                          </Typography>
                          <Typography variant="caption" className={classes.tag} >
                            NFT
                          </Typography>
                        </div>

                        <Typography component="span" variant="h5" color="textPrimary" >
                          <strong>Beginning of Nostalgia</strong>
                        </Typography>
                      </span>
                    }
                    align="left"
                    disableGutter
                    titleVariant="h2"
                />
              </Grid>
              <Grid item xs={4} align="right">
                <Image
                    src={Rarible}
                    style={{ width: '40px', height:'40px' }}
                />
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
                  Approx. {amountOfNft} NFT = {summarizedPrice} ETH
                </Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <br />
                <LinearProgress style={{marginBottom:"2px"}} hidden={!sendingTransaction}/>
                <Button variant="contained" color="primary" size="large" onClick={requestAccess} fullWidth>
                  {connectButtonText}
                </Button>
              </Grid>

              {/* Test Code - Web3 */}
              <Grid item xs={12} hidden={connectedWallet!==true}>
                <div className={classes.inputContainer}>
                  <h4>Web3 Dashboard</h4>
                  <div>
                    Network: {networkId ? `${networkId} – ${networkName}` : 'No connection'}
                  </div>
                  <div>
                    Your address: {accounts && accounts.length ? accounts[0] : 'Unknown'}
                  </div>
                  <div>
                    Your ETH balance: {balance}
                  </div>
                  <div>
                    Connected wallet: {connectedWallet}
                  </div>
                  <div>
                    Provider: {providerName}
                  </div>
                </div>
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
          <Grid item xs={12}>
            <SectionHeader
                title={
                  <Typography variant="h5">
                    YOUR NFTS
                  </Typography>
                }
                align="left"
                disableGutter
                titleVariant="h2"
            />
          </Grid>

          <Grid item xs={12}>
            <CardBase liftUp variant="outlined" align="left" withShadow
                      style={{ borderTop: `5px solid ${colors.blueGrey[500]}` }}>
              <Grid container xs={12} spacing={5} hidden={nftBalance!==0}>
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
                            There is no your NFT history.
                          </Typography>
                        </span>
                      }
                      align="left"
                      disableGutter
                      titleVariant="h2"
                  />
                </Grid>
              </Grid>
              <Grid container xs={12} spacing={5} hidden={nftBalance===0}>
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
                  <Grid item xs={11}>
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
                        titleVariant="h2"
                    />
                  </Grid>
                  <Grid item xs={1} align="right">
                    <Image
                        src={Rarible}
                        style={{ width: '40px', height:'40px' }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SectionHeader
                        title={
                          <span>
                            <Typography variant="caption" className={classes.tag} >
                              Genesis
                            </Typography>
                            <Typography variant="caption" className={classes.tag} >
                              NFT
                            </Typography>
                          </span>
                        }
                        subtitle={
                            <Typography variant="h5" color="textPrimary" >
                              <strong>Beginning of Nostalgia</strong>
                            </Typography>
                        }
                        align="left"
                        disableGutter
                        titleVariant="h2"
                    />
                    <Divider style={{marginTop: '20px'}} />
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Grid container xs={12}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" color={"primary"}>
                          Description
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <Typography variant="subtitle1">
                          설명 예정
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Grid container xs={12}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" color={"primary"}>
                          ISSUE DATE
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <Typography variant="subtitle1">
                          It will be minted at 2021/07/12
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} className={classes.gridItem}>
                    <Grid container xs={12}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" color={"primary"}>
                          TOTAL SUPPLY
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
                    <Grid container xs={12}>
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" color={"primary"}>
                          TRANSACTIONS
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={9}>
                        <Typography variant="subtitle1">
                          {nftTxList.map(function(d, idx){
                            return (<li key={idx}><a href={environmentConfig.etherscan_uri + String(d)}>{truncateString(String(d))}</a></li>)
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
