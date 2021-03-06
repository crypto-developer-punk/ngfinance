import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Divider} from '@material-ui/core';
import {Section, SectionAlternate} from 'components/organisms';

import {About, Hero, Partners, Roadmap, Team, Tokeneconomics} from './components';

import {backer, partners, team, services} from './data';
import Backer from "./components/Backer";
import EndHero from "./components/EndHero";
import Config from '../../config.json';
import ReactGA from 'react-ga';
import WhatWeDo from "./components/WhatWeDo";

ReactGA.initialize(Config.ga_code);
ReactGA.pageview(window.location.pathname + window.location.search);

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
    background: '#0c133e',
  },
  sectionSubscription: {
    paddingTop: 0,
  },
}));

const NostalgiaIndex = () => {
  const classes = useStyles();

  return (
    <div>
      <Hero data-aos="fade-up" className={classes.hero} />
      <Divider/>
      <Section>
          <Partners data={partners} />
      </Section>
        <Divider/>
        <Section>
            <WhatWeDo data={services} />
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

export default NostalgiaIndex;
