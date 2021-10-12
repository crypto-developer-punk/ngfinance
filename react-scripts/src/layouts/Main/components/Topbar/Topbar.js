import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Toolbar,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  Popover,
  Typography,
  IconButton,
  Button,
  Divider,
  Grid
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Image, DarkModeToggler } from 'components/atoms';

import { inject, observer } from "mobx-react";
import { useWeb3 } from '@openzeppelin/network/react';

import Logo from 'assets/images/main/logo_topbar.svg';

import WithBase from 'with/WithBase';
import { environmentConfig } from 'myconfig';
import { StringHelper } from "myutil";
import requestWeb3 from 'api/requestWeb3';
import { assertNetworkId } from "myconstants";

var _ = require('lodash');

const useStyles = makeStyles(theme => ({
  flexGrow: {
    flexGrow: 1,
  },
  navigationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toolbar: {
    zIndex: 999,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 8),
    },
    position: 'fixed',
    background:'white',
    borderBottom: "1px solid rgb(212, 212, 212)"
  },
  innerContainer: {
    maxWidth: theme.layout.contentWidth,
    width: '100%',
    margin: '0 auto',
    padding: theme.spacing(0, 2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 8),
    },
  },
  navLink: {
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  listItem: {
    cursor: 'pointer',
    '&:hover > .menu-item, &:hover svg': {
      color: theme.palette.primary.dark,
    },
    '&.menu-item--no-dropdown': {
      paddingRight: 0,
    },
  },
  listItemActive: {
    '&> .menu-item': {
      color: theme.palette.primary.dark,
    },
  },
  listItemText: {
    flex: '0 0 auto',
    marginRight: theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  listItemButton: {
    whiteSpace: 'nowrap',
  },
  listItemIcon: {
    minWidth: 'auto',
  },
  popover: {
    padding: theme.spacing(4),
    border: theme.spacing(2),
    boxShadow: '0 0.5rem 2rem 2px rgba(116, 123, 144, 0.09)',
    minWidth: 350,
    marginTop: theme.spacing(2),
  },
  iconButton: {
    marginLeft: theme.spacing(2),
    padding: 0,
    '&:hover': {
      background: 'transparent',
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
    color: theme.palette.primary.dark,
  },
  logoContainer: {
    width: 100,
    height: 45,
    [theme.breakpoints.up('md')]: {
      width: 120,
      height: 50,
    },
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  menu: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  menuItem: {
    marginRight: theme.spacing(5),
    '&:last-child': {
      marginRight: 0,
    },
  },
  menuGroupItem: {
    paddingTop: 0,
  },
  menuGroupTitle: {
    textTransform: 'uppercase',
  },
}));

const Topbar = props => {
  //{ themeMode, themeToggler, onSidebarOpen, pages, className, store, showDialog, showErrorDialog, getDialogModeState, closeDialog}
  const classes = useStyles();
  const web3Context = useWeb3(environmentConfig.eth_network);    

  const [buttonLabel, setButtonLabel] = useState(
    window.localStorage.getItem("walletButtonLabel") || 'Connect Wallet'
  );
  const [buttonDisabled, setButtonDisabled] = useState(
    window.localStorage.getItem("walletButtonDisalbed") || true
  );

  const [activePageId, setActivePageId] = useState(-1);
  
  const { pages, store } = props;
  const { onSidebarOpen } = props;
  const { webThreeContext } = store;
  const { networkId, accounts } = web3Context;

  const toolbarCB = React.useCallback(node => {
    if (node !== null) {
      props.topbarCB && props.topbarCB({height:node.getBoundingClientRect().height});
    }
  }, []);

  React.useEffect(() => {
    const lastItem = StringHelper.getUrlLastItem(window.location.href);
    pages.forEach((page, index) => {
      if (lastItem && page.href.includes(lastItem)) {
        setActivePageId(index);
      }
    });
  }, [window.location.href])

  React.useEffect(()=> {
    requestWeb3.reinitialize();
    async function initStore() {
      await store.asyncInitWebThreeContext();
      const buttonLabel = getWalletBtnLabel();
      window.localStorage.setItem("walletButtonLabel", buttonLabel);
      setButtonLabel(buttonLabel);
      
      const buttonDisalbed = getWalletDisalbed();
      window.localStorage.setItem("walletButtonDisalbed", buttonDisalbed);
      setButtonDisabled(buttonDisalbed);
    }
    initStore();
  }, [networkId, accounts]);

  const getWalletDisalbed = () => {
    return webThreeContext.isWalletConnected || !webThreeContext.isValidNetwork;
  };

  const getWalletBtnLabel = () => {
    // return webThreeContext.isWalletConnected ? StringHelper.getElipsedHashAddress( webThreeContext.currentAccount) : "Connect Wallet";
    let walletButtonLabel = '';
    if (!webThreeContext.isWalletConnected) {
      if (!webThreeContext.isValidNetwork) 
      walletButtonLabel = "Change to mainnet";
      else 
      walletButtonLabel = "Connect Wallet";
    } else {
      walletButtonLabel = StringHelper.getElipsedHashAddress( webThreeContext.currentAccount);
    }
    return walletButtonLabel;
  };
  
  const connectToWallet = _.debounce(async(e) => {
    try {
      e.preventDefault();
      assertNetworkId(webThreeContext.networkId);
      await props.store.asyncRequestAuth();
    } catch (err) {
      props.showErrorDialog(err);
    }
  }, 300, {
    leading: true,
    trailing: false
  });

  return (
    <Toolbar disableGutters className={classes.toolbar} ref={toolbarCB}>
      <Toolbar className={classes.innerContainer}>
        <div className={classes.logoContainer}>
          <a href="/" title="Nostalgia Finance">
            <Image
              className={classes.logoImage}
              src={Logo}
              alt="Nostalgia Finance"
              lazy={false}
            />
          </a>
        </div>
        <div className={classes.flexGrow} />
        <Hidden smDown>
          <List disablePadding className={classes.navigationContainer}>
            {pages.map((page, idx) => {
              return (
                <ListItem
                  key={idx}
                  onClick={e => {
                    e.preventDefault();
                    window.location.href=page.href}
                  }
                  className={clsx(
                    classes.listItem,
                  )}
                >
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    style={{fontWeight: activePageId === idx ? 'bold' : 'normal'}}
                    className={clsx(classes.listItemText, 'menu-item')}
                  >
                    {page.title}
                  </Typography>
                </ListItem>
              )
            })}

            <ListItem className={clsx(classes.listItem, 'menu-item--no-dropdown')}>
              <Button
                variant="contained"
                color="primary"
                className={classes.listItemButton}
                onClick={connectToWallet}
                disabled={buttonDisabled}
              >
                {buttonLabel}
              </Button>
            </ListItem>
          </List>
        </Hidden>
        <Hidden mdUp>
          <Button
            variant="contained"
            color="primary"
            className={classes.listItemButton}
            onClick={connectToWallet}
            disabled={buttonDisabled}
          >
            {buttonLabel}
          </Button>
          <IconButton
            className={classes.iconButton}
            onClick={onSidebarOpen}
            aria-label="Menu"
          >
            <MenuIcon />
          </IconButton> 
        </Hidden>
      </Toolbar>
    </Toolbar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.object.isRequired,
  themeToggler: PropTypes.func.isRequired,
  themeMode: PropTypes.string.isRequired,
};

export default inject(({store}) => ({
  store: store,
}))(WithBase(observer(Topbar)));