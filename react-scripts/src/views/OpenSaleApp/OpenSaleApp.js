import React from 'react';
import { inject, observer } from "mobx-react";
import { makeStyles } from '@material-ui/core/styles';
import { colors, Grid, Button } from '@material-ui/core';
import { Section } from "components/organisms";
import { useWeb3React } from "@web3-react/core";

import requestWeb3 from 'api/requestWeb3';
import WithBase from 'with/WithBase';

import { CurrentOpenedAuctionSection, NextOpenSaleSection } from './sections';
import { useDelayedWeb3React } from 'myutil';

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

const OpenSaleApp = props => {
  const classes = useStyles();

  const { ready, chainId, account, active, library } = useDelayedWeb3React();

  const { store } = props;

  React.useEffect(()=>{
    if (!ready)
      return;
    async function initStore() {
      requestWeb3.reinitializeWithProvider(library.provider);
      try {
        await store.asyncInitWebThreeContext();
      } catch (err) {
        props.showErrorDialog(err);
      }
    }
    if (active)
      initStore();
    else
      store.clearWebThreeContext();
  }, [ready, chainId, account, active]);

  return (
    <div className={classes.shape}>
      <Section className={classes.pagePaddingTop}>
        <Grid
          container
          justify="space-between"
          spacing={4}
        >
          {/* FIXME: 추후 옥션 진행시 수정 */}
          {/*<CurrentOpenedAuctionSection {...props}/>*/}
          <NextOpenSaleSection {...props} />
        </Grid>        
      </Section>
    </div>
  );
};

export default inject(({store}) => ({
  store: store,
}))(observer(WithBase(OpenSaleApp)));