import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { CardBase, Section } from "components/organisms";
import { Button, ButtonGroup, colors, Grid, Typography, Divider, Paper, useMediaQuery } from '@material-ui/core';
import { StringHelper } from 'myutil';
import { Image } from 'components/atoms';

const useStyles = makeStyles(theme => ({
  image: {
    boxShadow:
      '25px 60px 125px -25px rgba(80,102,144,.1), 16px 40px 75px -40px rgba(0,0,0,.2)',
    borderRadius: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      maxWidth: 500,
    },
  },
  tag: {
    padding: theme.spacing(1 / 2, 1),
    borderRadius: theme.spacing(1 / 2),
    background: theme.palette.secondary.main,
    color: 'black',
    margin: theme.spacing(0, 1, 1, 0),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 1, 1, 0),
    },
  },
  gridItemMain: {
    marginTop: theme.spacing(1)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: 'white',
    background: '#2E3348CC'
  },
  paperSub: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: 'white',
    background: '#2E3348CC'
  },
}));

const TokenBoard = props => {
  const classes = useStyles();
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  const {
    title, 
    subTitle, 
    stakingButtonComponents, 
    lpTokenBalanceComponents, 
    snapShotTimeStr, 
    totalValueLockedTitle, 
    totalValueLockedNftAmount, 
    apyLabel,
    hashAddressLabel, 
    balanceOfReward, 
    dropTokenImage, 
    dropTokenName,
    apyTooltip
  } = props;

  const uuid = StringHelper.uuidv4();

  return (
    <React.Fragment>
       <Grid
          item
          container
          justify="flex-start"
          alignItems="flex-start"
          xs={12}
          md={12}
          data-aos={'fade-up'}
        >
        <Grid item xs={12} style={{marginBottom: '30px'}}>
          <CardBase liftUp variant="outlined" align="left" withShadow
                    style={{ borderTop: `5px solid ${colors.deepPurple[900]}` }}>
            <Grid container spacing={isMd ? 5 : 2}>
              <Grid item container xs={12} justify="center" alignItems="center">
              <Grid item xs={6} md={6} align={"left"}>
                {title}
              </Grid>
              <Grid item xs={6} md={6} align={"right"}>
                {stakingButtonComponents}
              </Grid>
              </Grid>
              { subTitle && 
                <Grid item xs={12} md={12} align={"left"}>
                    {subTitle}
                </Grid>
              }
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={6} align="left">
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    Next snapshot date : { snapShotTimeStr }
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    {totalValueLockedTitle} : { totalValueLockedNftAmount }
                  </Typography>
                </Paper>
              </Grid>
              {
                <Grid item xs={12} md={12}>
                  <a data-tip data-for={uuid}>
                    <Paper className={classes.paper}>
                    <Typography component="span" variant="subtitle1">
                      <div style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {apyLabel}
                      <ReactTooltip id={uuid} type="warning" effect="solid">
                        <span>{apyTooltip}</span>
                      </ReactTooltip>
                      </div>
                    </Typography>
                    </Paper>
                  </a>
                </Grid>
              }
              <Grid item xs={12} md={12}>
                <Paper className={classes.paper}>
                  <Typography component="span" variant="subtitle1">
                    <div style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                    {hashAddressLabel}
                    </div>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              {lpTokenBalanceComponents}
              <Grid item xs={12}>
                <Typography component="span" variant="h6">
                  Token Drop Balance
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid
                    container
                    xs={12}
                    alignContent="flex-start"
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                >
                  <Grid item>
                    <Image src={dropTokenImage}
                          style={{ width: '120px', height:'120px' }}/>
                  </Grid>
                  <Grid item
                      alignItems=""
                      justify="center">
                    <Typography component="span" variant="subtitle1">
                      {dropTokenName} : { balanceOfReward }
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardBase>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default TokenBoard;