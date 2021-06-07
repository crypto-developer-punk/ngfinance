import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Button,
  Typography,
  colors,
  FormControl,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
import { Image, Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import GenesisNFT from '../../../../assets/images/main/genesis_nft.jpg';
import {CardBase, DescriptionListIcon} from "../../../../components/organisms";
import InputLabel from '@material-ui/core/InputLabel';
import Bnb from "../../../../assets/images/main/bnb.svg";

const useStyles = makeStyles(theme => ({
  image: {
    boxShadow:
      '25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
    borderRadius: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 500,
    },
  },
}));

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

  const PRICE_BNB_PER_NFT = 0.9;
  const [amountNft, setAmountNft] = React.useState(1);
  const [summarizedBnb, setSummarizedBnb] = React.useState(PRICE_BNB_PER_NFT);
  // const [priceBnbByDollar, setPriceBnbByDollar] = React.useState(300);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleChange = event => {
    setAmountNft(event.target.value);
    setSummarizedBnb(PRICE_BNB_PER_NFT * event.target.value);
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
                    align="left"
                    disableGutter
                    titleVariant="h3"
                />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.inputContainer}>
                  <FormControl fullWidth className={classes.margin} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        type="number"
                        value={amountNft}
                        inputProps={{ min: 0, max: 999999999 }}
                        // startAdornment={<InputAdornment position="end">BNB</InputAdornment>}
                        labelWidth={60}
                        onChange={handleChange}
                    />
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} align="center">
                <Typography component="span" variant="inherit" color="textSecondary">
                  Approx. {amountNft} NFT = {summarizedBnb} BNB
                </Typography>
              </Grid>
              <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" size="large">
                  Register now
                </Button>
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
