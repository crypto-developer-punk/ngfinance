import React from 'react';
import { inject, observer } from "mobx-react";
import {makeStyles} from '@material-ui/core/styles';
import {colors} from '@material-ui/core';
import {NextNftSection, ComingNextSection, OurNtfSection} from './sections';
import WithBase from 'with/WithBase';

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

const NftApp = props => {
  const classes = useStyles();

  React.useEffect(() => {
    async function initStore() {
      try {
        await props.store.asyncInitWebThreeContext();
        await props.store.asyncInitNftInfos(props.store.webThreeContext);
      } catch (err) {
        props.showErrorDialog(err);
      }
    }
    initStore();
  }, []);

  return (
    <div>
      <div className={classes.shape}>
        <NextNftSection className={classes.pagePaddingTop} {...props}/>
        <OurNtfSection className={classes.sectionNoPaddingTop} {...props} />
        <ComingNextSection className={classes.pagePaddingTop} {...props}/>
      </div>
    </div>
  );
};

export default inject(({store}) => ({
  store: store,
}))(observer(WithBase(NftApp)));
