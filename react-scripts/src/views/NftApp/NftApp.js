import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {colors} from '@material-ui/core';
import {Section} from 'components/organisms';
import {Hero,} from './components';
import EndHero from "../NostalgiaIndex/components/EndHero";

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
  sectionNoPaddingTop: {
    paddingTop: 0,
  },
  shape: {
    background: theme.palette.alternate.main,
    borderBottomRightRadius: '50%',
    borderBottom: `1px solid ${colors.grey[200]}`,
  },
}));

const NftApp = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.shape}>
        <Section className={classes.pagePaddingTop}>
          <Hero />
        </Section>
        <Section className={classes.pagePaddingTop}>
          <EndHero />
        </Section>
      </div>
    </div>
  );
};

export default NftApp;
