import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Button, colors, Typography} from '@material-ui/core';
import { SectionHeader, IconAlternate } from 'components/molecules';
import { CardBase, DescriptionListIcon } from 'components/organisms';
import { Image } from 'components/atoms';

const WhatWeDo = props => {
  const { data, className, ...rest } = props;

  return (
    <div className={className} data-aos="fade-up" {...rest}>
      <SectionHeader
          title="What we do"
          subtitle={
              <span>
                  Nostalgia Finance is NFT based Defi protocol where you can simply stake your NFTs and earn drops of {' '}
                  <Typography color="primary" variant="inherit" component="span">$PAINT</Typography>
                  {' '}
                  every week.
                  <br />
                Harvest your rewards with a single click from your wallet.
                <br /><br />
                Enjoy Defi without any complex procedures such as liquidity providing.
                <br />
                No need to endure impermanent loss.
              </span>
          }
          ctaGroup={[
              <Button color="primary" variant="contained" size="large"
                      onClick={(e) => {
                          e.preventDefault();
                          window.open("https://drive.google.com/file/d/1Eh2TB-0U1chmfb8E7692OrL-rzu217wP/view?usp=sharing", '_blank');
                      }}>
                  Lite PAPER
              </Button>,
          ]}
          fadeUp />
      <Grid container spacing={2}>
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
                    // <IconAlternate
                    //   fontIconClass={item.icon}
                    //   color={colors.indigo}
                    // />
                    <Image
                        src={item.img}
                        alt={item.title}
                        lazyProps={{
                            width: '100%',
                            height: '100%',
                        }}
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
