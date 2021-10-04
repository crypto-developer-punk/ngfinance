import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Divider } from '@material-ui/core';
import { Topbar, Footer, Sidebar } from './components';
import { ScrollTop } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
}));

const Main = ({ children }) => {
  const classes = useStyles();

  const theme = useTheme();
  const [paddingTopbarBottom, setPaddingTopbarBottom] = React.useState(window.localStorage.getItem("paddingTopbarBottom") || 64);
  const [openSidebar, setOpenSidebar] = React.useState(false);

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const pages = [
    {title: 'OPEN SALE', href: '/opensale'},
    {title: 'NFT', href: '/app'},
    {title: 'STAKING', href: '/staking'},
    {title: 'CLAIM', href: '/reward'}
  ];

  const open = isMd ? false : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} pages={pages} topbarCB={(payload)=>{
          setPaddingTopbarBottom(payload.height);
          window.localStorage.setItem("paddingTopbarBottom", payload.height);
      }}/>
      <Sidebar
        onClose={handleSidebarClose}
        open={open}
        variant="temporary"
        pages={pages}
      />
      <div style={{paddingBottom: paddingTopbarBottom}}/>
      <main>
        {children}
      </main>
      <Footer pages={pages} />
      <ScrollTop />
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  themeToggler: PropTypes.func.isRequired,
  themeMode: PropTypes.string.isRequired,
};

export default Main;
