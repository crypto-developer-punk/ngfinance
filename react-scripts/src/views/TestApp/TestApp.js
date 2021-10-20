import React from 'react';
import { inject, observer } from "mobx-react";
import {makeStyles} from '@material-ui/core/styles';
import {colors, Grid} from '@material-ui/core';
import {Section} from "components/organisms";
import {useWeb3} from '@openzeppelin/network/react';

import {environmentConfig} from 'myconfig';
import requestWeb3 from 'api/requestWeb3';
import WithBase from 'with/WithBase';
// import {ComingNextSection, NftStakingSection, LPStakingSection} from './sections';

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


const TestApp = props => {
  const classes = useStyles();
  const web3Context = useWeb3(environmentConfig.eth_network);    

  const { networkId, accounts } = web3Context;
  const { store } = props;

  React.useEffect(() => {
    requestWeb3.reinitialize();
    async function initStore() {
      try {
        await store.asyncInitWebThreeContext();
      } catch (err) {
        props.showErrorDialog(err);
      }
    }
    initStore();
  }, [networkId, accounts]);

  return (
    <div className={classes.shape}>
      <Section className={classes.pagePaddingTop}>
        <Grid
          container
          justify="space-between"
          spacing={4}
        >
          {/* <NftStakingSection  {...props} /> */}
        </Grid>
      </Section>
    </div>
  );
};

export default inject(({store}) => ({
  store: store,
}))(observer(WithBase(TestApp)));