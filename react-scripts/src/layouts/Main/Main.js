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

const Main = ({ children, themeToggler, themeMode }) => {
  const classes = useStyles();

  const theme = useTheme();
  const [paddingTopbarBottom, setPaddingTopbarBottom] = React.useState(window.localStorage.getItem("paddingTopbarBottom") || 64);

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const pages = [
    {title: 'OPEN SALE', href: '/opensale'},
    {title: 'STAKING', href: '/app'},
    {title: 'CLAIM', href: '/reward'}
  ];

  return (
    <div
      className={clsx({
        [classes.root]: true,
      })}
    >
      <Topbar pages={pages} topbarCB={(payload)=>{
          setPaddingTopbarBottom(payload.height);
          window.localStorage.setItem("paddingTopbarBottom", payload.height);
      }}/>
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
