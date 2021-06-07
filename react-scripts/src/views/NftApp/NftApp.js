import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {colors} from '@material-ui/core';
import {Section} from 'components/organisms';
import {Hero,} from './components';
import EndHero from "../DesignCompany/components/EndHero";

const useStyles = makeStyles(theme => ({
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
  sectionNoPaddingTop: {
    paddingTop: 0,
  },
  shape: {
    background: theme.palette.alternate.main,
    borderBottomRightRadius: '50%',
    borderBottom: `1px solid ${colors.grey[200]}`,
  },
}));

const NftApp = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.shape}>
        <Section className={classes.pagePaddingTop}>
          <Hero />
        </Section>
        <Section className={classes.pagePaddingTop}>
          <EndHero />
        </Section>
        {/*<Section className={classes.pagePaddingTop}>*/}
        {/*  <EndHeroShape />*/}
        {/*</Section>*/}
        {/*<Section className={classes.sectionNoPaddingTop}>*/}
        {/*  <Reviews data={reviews} />*/}
        {/*</Section>*/}
        {/*<Section className={classes.sectionNoPaddingTop}>*/}
        {/*  <Hub />*/}
        {/*</Section>*/}

      </div>
      {/*<Section narrow>*/}
      {/*  <Support data={support} />*/}
      {/*</Section>*/}
      {/*<SectionAlternate>*/}
      {/*  <Customization />*/}
      {/*</SectionAlternate>*/}
      {/*<Section>*/}
      {/*  <Partners data={integrations} />*/}
      {/*</Section>*/}
      {/*<SectionAlternate innerNarrowed>*/}
      {/*  <Pricings />*/}
      {/*</SectionAlternate>*/}
      {/*<Section>*/}
      {/*  <Download data={[]} />*/}
      {/*</Section>*/}
      {/*<Divider />*/}
    </div>
  );
};

export default NftApp;
