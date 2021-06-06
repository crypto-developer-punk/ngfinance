import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import { Section, SectionAlternate } from 'components/organisms';

import {
    About,
    Features,
    Hero,
    Integrations,
    Pricings,
    Reviews, Roadmap,
    Subscription, Tokeneconomics, Team
} from './components';

import { integrations, reviews, team, backer } from './data';
import {partners} from "../DesignCompany/data";
import {Partners} from "../DesignCompany/components";
import Backer from "./components/Backer";
import Background from "../../assets/images/main/header_background.jpg";
import {HeroSimpleBackground} from "../../components/organisms";
import EndHero from "./components/EndHero";

const useStyles = makeStyles(theme => ({
  hero: {
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(-9),
    },
  },
  sectionAlternate: {
    background: 'transparent',
    backgroundImage: `linear-gradient(180deg, ${theme.palette.alternate.main} 100%, ${theme.palette.background.paper} 0%)`,
    [theme.breakpoints.up('md')]: {
      backgroundImage: `linear-gradient(180deg, ${theme.palette.alternate.main} 50%, ${theme.palette.background.paper} 0%)`,
    }
  },
  backerSection: {
    background: theme.palette.primary.main,
  },
  sectionSubscription: {
    paddingTop: 0,
  },
}));

const DesignCompany = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero data-aos="fade-up" className={classes.hero} />
      <Divider/>
      <Section>
          <Partners data={partners} />
      </Section>
      <SectionAlternate className={classes.sectionAlternate}>
        <About />
      </SectionAlternate>
        <Divider/>
        <Section>
            <Roadmap />
        </Section>
        <Divider/>
        <Section>
            <Tokeneconomics />
        </Section>
        <Divider />
        <Section>
            <Team data={team} className={classes.contentSection} />
        </Section>
        <SectionAlternate className={classes.backerSection}>
            <Backer data={backer} />
        </SectionAlternate>
        <EndHero />
      <Divider />
    </div>
  );
};

export default DesignCompany;
