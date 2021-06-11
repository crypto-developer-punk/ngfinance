import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Button, colors, FormControl, Grid, Typography, useMediaQuery} from '@material-ui/core';
import {Image} from 'components/atoms';
import {SectionHeader} from 'components/molecules';
import GenesisNFT from '../../../../assets/images/main/genesis_nft.jpg';
import {CardBase} from "../../../../components/organisms";
import TextField from '@material-ui/core/TextField';
import Bnb from "../../../../assets/images/main/bnb.svg";
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import FlagIcon from './FlagIcon.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import axios from "axios";

import { useWeb3 } from '@openzeppelin/network/react';

const web3 = require("web3");

const addressTo = '0xD97F7985e8030AE56551eCA127887CC9f1900039';
const infuraProjectId = '21eb3ec799a74ff1b65bb39818d7af45';

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

const Hero = props => {
  // Ether
  // const web3Context = useWeb3('http://127.0.0.1:7545');
  const web3Context = useWeb3(`wss://rinkeby.infura.io/ws/v3/${infuraProjectId}`);
  const { networkId, networkName, accounts, providerName, lib } = web3Context;

  const requestAuth = async web3Context => {
    try {
      await web3Context.requestAuth();
    } catch (e) {
      console.error(e);
    }
  };

  const requestTransferBnb = () => {
    let tokenAddress = "0x83f65d524ba6362ec70a91779f9e005e061f9337";

    // Use BigNumber
    let decimals = lib.utils.toBN(18);
    let amount = lib.utils.toBN(amountOfNft);

    let minABI = [
      // transfer
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "type": "function"
      }
    ];

    // Get ERC20 Token contract instance
    let contract = new lib.eth.Contract(minABI, tokenAddress);
    // calculate ERC20 token amount
    let value = amount.mul(lib.utils.toBN(10).pow(decimals));
    // call transfer function
    contract.methods.transfer(addressTo, value).send({from: accounts[0]})
        .on('transactionHash', function(hash){
          console.log(hash);
        });
  };

  const requestTransferEth = () => {
    const amountOfEth = summarizedPrice;
    const amountToSend = lib.utils.toWei(amountOfEth.toString(), 'ether'); // Convert to wei value

    console.log(amountOfEth);

    let send = lib.eth.sendTransaction({
      from: accounts[0],
      to: addressTo,
      value: amountToSend
    });

    console.log(send);
  };

  const requestTransfer = () => {
    if (selectedCurrency === "BNB") {
      console.log("send to BNB");
      requestTransferBnb();
    } else {
      console.log("send to ETH");
      requestTransferEth();
    }
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

  const PRICE_BNB_PER_NFT = 0.9;
  const [priceOfEthPerNft, setPriceOfEthPerNft] = React.useState(0);
  const [amountOfNft, setAmountNft] = React.useState(1);
  const [summarizedPrice, setSummarizedPrice] = React.useState(PRICE_BNB_PER_NFT);

  const [countries] = React.useState([
    { code: 'BNB', title: 'BNB' },
    { code: 'ETH', title: 'ETHEREUM' }
  ]);
  const [toggleContents, setToggleContents] = React.useState('Select Payment Method');
  const [selectedCurrency, setSelectedCurrency] = React.useState("BNB");

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  React.useEffect(() => {
    const getPriceOfEthPerNft = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BNBETH');
        let priceOfBnbEth = response.data.price;
        let summarizedPrice = priceOfBnbEth * PRICE_BNB_PER_NFT;

        setPriceOfEthPerNft(summarizedPrice);
      } catch (e) {
        console.error(e);
      }
    };

    getBalance();
    getPriceOfEthPerNft();
  }, [accounts, getBalance, networkId]);

  const handleChange = event => {
    setAmountNft(event.target.value);
    setSummarizedPrice(calcSummarizedPrice(selectedCurrency, event.target.value));
  };

  const handleSelect = event => {
    const { code, title } = countries.find(
        ({ code }) => event === code
    );

    setSelectedCurrency(event);
    setSummarizedPrice(calcSummarizedPrice(event, amountOfNft));

    setToggleContents(
        <>
          <FlagIcon code={code} /> {title}
        </>
    );
  };

  const calcSummarizedPrice = (currencyType, nftAmount) => {
    let priceOfBnb = PRICE_BNB_PER_NFT * nftAmount;
    let priceOfEth = priceOfEthPerNft * nftAmount;

    if (currencyType === "ETH") {
      return priceOfEth;
    }
    return priceOfBnb;
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
            alignItems="center"
            xs={12}
            md={6}
            data-aos={'fade-up'}
        >
          <Image
              src={GenesisNFT}
              alt="TheFront Company"
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
                          <strong>0.9</strong>
                        </Typography>{' '}
                        <Typography component="span" variant="body1" color="textSecondary">
                          BNB
                          <span style={{paddingLeft: '10px'}}>
                            <Image
                                src={Bnb}
                                style={{height:'20px', width: '20px'}}
                            />
                          </span>
                        </Typography>
                      </span>
                    }
                    subtitle={
                      <>
                        <Typography variant="body1" color="textSecondary">
                          (={priceOfEthPerNft} ETH)
                        </Typography>
                      </>
                    }
                    align="left"
                    disableGutter
                    titleVariant="h3"
                />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.inputContainer} >
                  <Form>
                    <Dropdown
                        onSelect={handleSelect}
                    >
                      <Dropdown.Toggle
                          style={{ width: "100%" }}
                          variant="secondary"
                          className="text-left"
                      >
                        {toggleContents}
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ width: "100%" }}>
                        {countries.map(({ code, title }) => (
                            <Dropdown.Item key={code} eventKey={code}>
                              <FlagIcon code={code} /> {title}
                            </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.inputContainer}>
                  <FormControl fullWidth className={classes.margin}>
                    <TextField
                        id="standard-basic" label="NFT Amount" variant="standard"
                        type="number"
                        inputProps={{ min: 0, max: 999999999 }}
                        onChange={handleChange}
                    />
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography component="span" variant="inherit" color="textSecondary">
                  Approx. {amountOfNft} NFT = {summarizedPrice} {selectedCurrency}
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
