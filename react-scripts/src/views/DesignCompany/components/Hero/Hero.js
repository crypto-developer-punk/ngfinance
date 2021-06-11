import React from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { SectionHeader, TypedText } from 'components/molecules';
import { Section, HeroSimpleBackground } from 'components/organisms';
import { makeStyles } from "@material-ui/core/styles";
import Background from '../../../../assets/images/main/header_background.jpg';
import {Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    textWhite: {
        color: "#2d3748",
    },
    textTitle: {
        // color: 'white',
        fontWeight: 900,
    },
    textSubTitle: {
        fontWeight: 900,
    },
    leftSideContent: {
        '& .section-header__cta-container': {
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'column',
                '& .section-header__cta-item-wrapper': {
                    width: '100%',
                    '&:last-child': {
                        marginLeft: 0,
                        marginTop: theme.spacing(1),
                    },
                    '& .MuiButtonBase-root': {
                        width: '100%',
                    },
                },
            },
        }
    },
    heroShaped: {
        '& .hero-shaped__image': {
            backgroundColor: theme.palette.alternate.main,
        },
        [theme.breakpoints.down('sm')]: {
            '& .hero-shaped__image': {
                position: 'relative',
            },
            '& .hero-shaped__wrapper': {
                flexDirection: 'column',
            },
        },
    },
    imageAnimation: {
        background: `url("https://assets.maccarianagency.com/the-front/web-screens/home/home-hero-bg-light.png")`,
        backgroundRepeat: 'repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: '400px auto',
        animation: `$slideshow 50s linear infinite`,
        width: '600%',
        height: '600%',
        backgroundColor: theme.palette.alternate.dark,
        top: '-25%',
        left: '-100%',
        position: 'absolute',
        [theme.breakpoints.up('sm')]: {
            backgroundSize: '800px auto',
        }
    },
    imageAnimationDark: {
        background: `url("https://assets.maccarianagency.com/the-front/web-screens/home/home-hero-bg-dark.png")`,
    },
    '@keyframes slideshow': {
        '0%': {
            transform: 'rotate(-13deg) translateY(-25%)',
        },
        '100%': {
            transform: 'rotate(-13deg) translateY(-80%)',
        },
    },
}));

const Hero = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

    const title = (
        <Typography variant="h2" component="span" className={classes.textTitle}>
            We bring you
            <br/>
            <TypedText
                component="span"
                variant="h2"
                color="primary"
                className={classes.textSubTitle}
                typedProps={{
                    strings: [
                        'Real Art',
                        'NFT',
                        'DeFi',
                        'Nostalgia',
                    ],
                    typeSpeed: 60,
                    loop: true,
                }}
            />
        </Typography>
    );

  return (
    <div className={className} {...rest}>
      <HeroSimpleBackground backgroundImage={Background}>
        <Section narrow>
          <SectionHeader
            title={title}
            titleVariant="h3"
            subtitle={
                <span className={classes.textWhite}>
                    Nostalgia Finance is NFT Based Defi system that you can simply stake your specific NFT we drop fixed qty of "$PAINT" every week.
                    <br />
                    you can easily harvest with connected wallet by single click. anyone can freely enjoy our defi platform without difficult options like LPing, IL
                </span>
            }
            ctaGroup={[
                <Button color="primary" variant="contained" size="large"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href="app";
                        }}>
                    Genesis NFT
                </Button>,
                <Button color="default" variant="contained" size="large"
                        onClick={(e) => {
                            e.preventDefault();
                            window.open("https://t.me/official_nostalgia", '_blank');
                        }}>
                    Join community
                </Button>,
            ]}
            disableGutter
          />
        </Section>
      </HeroSimpleBackground>
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
