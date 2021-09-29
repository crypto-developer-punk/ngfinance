import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Grid,
  Typography,
} from '@material-ui/core';
import { Image, Icon } from 'components/atoms';
import { SectionHeader } from 'components/molecules';
import { Section } from "components/organisms";
import ComingSoon from "../../../../assets/images/main/coming_soon.svg";

const useStyles = makeStyles(theme => ({
  image: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: 400,
    },
  },
  searchInputContainer: {
    background: theme.palette.alternate.main,
    padding: theme.spacing(2),
    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.11)',
    borderRadius: theme.spacing(1),
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    '& .MuiOutlinedInput-notchedOutline': {
      border: '0 !important',
    },
    '& .MuiInputAdornment-positionStart': {
      marginRight: theme.spacing(2),
    },
    '& .MuiOutlinedInput-adornedStart': {
      paddingLeft: 0,
    },
    '& .MuiOutlinedInput-input': {
      padding: 0,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
  searchButton: {
    maxHeight: 45,
    minWidth: 135,
    [theme.breakpoints.down('sm')]: {
      minWidth: 'auto',
    },
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  tag: {
    padding: theme.spacing(1 / 2, 1),
    borderRadius: theme.spacing(1 / 2),
    background: theme.palette.secondary.light,
    color: 'white',
    margin: theme.spacing(0, 1, 1, 0),
    cursor: 'pointer',
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 2, 2, 0),
    },
  },
}));

const ComingNextSection = props => {
  const { data, className, ...rest } = props;
  const classes = useStyles();

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  return (
    <React.Fragment>
      <Grid container justify="space-between" spacing={isMd ? 4 : 2} data-aos={'fade-up'}>
        <Grid
          item
          container
          justify="center"
          xs={12}
          md={6}
          data-aos={'fade-up'}
        >
          <Image
            src={ComingSoon}
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12} md={6} data-aos={'fade-up'}>
          <SectionHeader
              title={
                <span>
                  Coming soon
                  <br/>
                  <Typography component="span" variant="inherit" color="primary">
                  Next NFT.
                </Typography>
              </span>
              }
              subtitle="How you use TheFront's blog cards is up to you! Our design begins with atomic elements which are easily combined to create rich blog post components."
              align={isMd ? 'left' : 'center'}
              disableGutter
              titleVariant="h3"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

ComingNextSection.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default ComingNextSection;
