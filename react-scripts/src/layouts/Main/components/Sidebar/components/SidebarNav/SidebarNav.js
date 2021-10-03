/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  Typography,
  ListItemIcon,
  Divider,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { StringHelper } from "myutil";

const useStyles = makeStyles(theme => ({
  root: {
  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  navLink: {
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
  listItemIcon: {
    minWidth: 'auto',
  },
  closeIcon: {
    justifyContent: 'flex-end',
    cursor: 'pointer',
  },
  menu: {
    display: 'flex',
  },
  menuItem: {
    marginRight: theme.spacing(8),
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
  divider: {
    width: '100%',
  },
}));

const SidebarNav = props => {
  const { pages, onClose, className, ...rest } = props;
  const classes = useStyles();

  const [activePageId, setActivePageId] = React.useState(-1);
  
  React.useEffect(() => {
    const lastItem = StringHelper.getUrlLastItem(window.location.href);
    pages.forEach((page, index) => {
      if (lastItem && page.href.includes(lastItem)) {
        setActivePageId(index);
      }
    });
  }, [window.location.href])

  return (
    <List {...rest} className={clsx(classes.root, className)}>
      <ListItem className={classes.closeIcon} onClick={() => onClose()}>
        <ListItemIcon className={classes.listItemIcon}>
          <CloseIcon fontSize="small" />
        </ListItemIcon>
      </ListItem>
      {
        pages.map((page, idx) => {
          return (
            <React.Fragment>
            <ListItem 
              key={idx}
              onClick={e => {
                e.preventDefault();
                window.location.href=page.href}
              }
              className={classes.listItem}>
              <Typography variant="h6" color="textPrimary" gutterBottom 
                style={{fontWeight: activePageId === idx ? 'bold' : 'normal'}}>
                {page.title}
              </Typography>
            </ListItem> 
            {
              idx !== pages.length &&
              <ListItem className={classes.listItem}>
                <Divider className={classes.divider} />
              </ListItem>
            }
            </React.Fragment>
          )
        })
      }
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

export default SidebarNav;
