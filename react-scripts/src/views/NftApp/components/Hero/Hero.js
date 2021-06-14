import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {Button, colors, FormControl, Grid, Typography} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import GenesisNFT from '../../../../assets/images/main/genesis_nft.jpg';
import {CardBase} from "../../../../components/organisms";
import TextField from '@material-ui/core/TextField';
import Eth from "../../../../assets/images/main/logo_eth.svg";
import Slider from '@material-ui/core/Slider';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import {useWeb3} from '@openzeppelin/network/react';

const addressTo = '0xD97F7985e8030AE56551eCA127887CC9f1900039';

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

const Hero = props => {
  const web3Context = useWeb3(process.env.REACT_APP_ETH_NETWORK);
  const { networkId, networkName, accounts, providerName, lib } = web3Context;

  const requestAuth = async web3Context => {
    console.log("node environment: " + process.env.NODE_ENV);
    console.log(process.env.REACT_APP_ADDRESS_TO);
    console.log(process.env.REACT_APP_ETH_NETWORK);
    try {
      await web3Context.requestAuth();
    } catch (e) {
      console.error(e);
    }
  };

  const requestTransfer = () => {
    const amountOfEth = summarizedPrice;
    const amountToSend = lib.utils.toWei(amountOfEth.toString(), 'ether'); // Convert to wei value

    console.log(amountOfEth);

    let send = lib.eth.sendTransaction({
      from: accounts[0],
      to: process.env.REACT_APP_ADDRESS_TO,
      value: amountToSend
    });

    console.log(send);
  };

  const requestAccess = () => {
    if (connectedWallet) {
      console.log("transfer crypto");
      requestTransfer(web3Context)
    } else {
      console.log("connect to wallet");
      requestAuth(web3Context);
    }
  };

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
    } else {
      setConnectButtonText("Connect Wallet");
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
          alignItems="center"
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
                        <Typography component="span" variant="h5" color="primary">
                          <b>* Genesis NFT</b>
                        </Typography>
                      </span>
                    }
                    subtitle={
                      <Typography component="span" variant="h5" color="textPrimary">
                        <i>Beginning of Nostalgia</i>
                      </Typography>
                    }
                    align="left"
                    disableGutter
                    titleVariant="h2"
                />
                <SectionHeader
                    title={
                      <span>
                        <Typography component="span" variant="h4" color="textPrimary">
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
                <Typography id="discrete-slider-small-steps" gutterBottom>
                  Amount of NFT: {amountOfNft}
                </Typography>
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
