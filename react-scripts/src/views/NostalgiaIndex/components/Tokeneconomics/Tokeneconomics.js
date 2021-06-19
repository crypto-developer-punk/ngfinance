import React from 'react';
import PropTypes from 'prop-types';
import {SectionHeader} from 'components/molecules';
import PieChart from "./PieChart";
import { useMediaQuery, Typography, Grid, colors } from '@material-ui/core';

const Tokeneconomics = props => {
  const { className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <SectionHeader
        data-aos="fade-up"
        title="$PAINT Token Distribution"
      />
        <Grid container spacing={2} alignItems={"center"} align={"center"}>
            <Grid item xs={12}>
                <Typography color="textSecondary" variant="h6">
                    Max Supply : 1B
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography color="textSecondary" variant="h6">
                    Token Burn : If NFTs sold, more tokens will be burned.
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <PieChart />
            </Grid>
        </Grid>
    </div>
  );
};

Tokeneconomics.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Tokeneconomics;
