import React from 'react';
import { inject, observer } from "mobx-react";
import {makeStyles} from '@material-ui/core/styles';
import {colors, Grid} from '@material-ui/core';
import {Section} from "components/organisms";
import WithBase from 'with/WithBase';

import {CurrentOpenedAuctionSection, NextOpenSaleSection} from './sections';

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

const AuctionApp = props => {
  
  const classes = useStyles();

  return (
    <div className={classes.shape}>
      <Section className={classes.pagePaddingTop}>
        <Grid
          container
          justify="space-between"
          spacing={4}
        >
          <CurrentOpenedAuctionSection {...props}/>
          <NextOpenSaleSection {...props} />
        </Grid>        
      </Section>
    </div>
  );
};

export default inject(({store}) => ({
  store: store,
}))(observer(WithBase(AuctionApp)));