import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button, colors, Typography} from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { CardBase, DescriptionListIcon } from 'components/organisms';

const WhatWeDo = props => {
  const { data, className, ...rest } = props;

  return (
    <div className={className} data-aos="fade-up" {...rest}>
      <SectionHeader title="What we do" fadeUp />
      <Grid container spacing={4}>
        {data.map((item, index) => (
          <Grid
            key={index}
            item
            container
            alignItems="center"
            direction="column"
            xs={12}
            sm={6}
            md={4}
            data-aos="fade-up"
          >
            <CardBase liftUp variant="outlined" withShadow>
              <DescriptionListIcon
                icon={
                  <IconAlternate
                    fontIconClass={item.icon}
                    color={colors.indigo}
                  />
                }
                title={item.title}
                subtitle={
                    <Typography variant="subtitle1">
                        {item.description}
                    </Typography>
                }
              />
            </CardBase>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

WhatWeDo.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
  /**
   * data to be rendered
   */
  data: PropTypes.array.isRequired,
};

export default WhatWeDo;
