import React from 'react';
import PropTypes from 'prop-types';
import {SectionHeader} from 'components/molecules';
import PieChart from "./PieChart";

const Tokeneconomics = props => {
  const { className, ...rest } = props;

  return (
    <div className={className} {...rest}>
      <SectionHeader
        data-aos="fade-up"
        title="$PAINT Token Distribution"
      />
      <PieChart />
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
