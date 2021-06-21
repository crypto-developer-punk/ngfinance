import React from 'react';
import PropTypes from 'prop-types';
import {SectionHeader} from 'components/molecules';

import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import LaptopMacIcon from '@material-ui/icons/LaptopMac';
import HotelIcon from '@material-ui/icons/Hotel';
import RepeatIcon from '@material-ui/icons/Repeat';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: '6px 16px',
    },
    secondaryTail: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

const Roadmap = props => {
  const { className, ...rest } = props;
  const classes = useStyles();

        return (
    <div className={className} {...rest}>
      <SectionHeader
        title="Looking Ahead"
        data-aos="fade-up"
      />
        <Timeline align="alternate"
                  data-aos="fade-up">
            <TimelineItem>
                <TimelineOppositeContent>
                    <Typography variant="body1">
                        2021 - Q2
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="primary">
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" color={"primary"}>
                            Genesis NFT sale Q2
                        </Typography>
                        <Typography variant="body1">Sale process reveal</Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent>
                    <Typography variant="body1" color="textSecondary">
                        Q3
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot>
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" color={"primary"}>
                            Nostalgia Finance launch Q3
                        </Typography>
                        <Typography variant="body1">Official platform launch</Typography>
                    </Paper>
                    <br />
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" color={"primary"}>
                            First token drop in July Q3
                        </Typography>
                        <Typography variant="body1">$PAINT drops for staking NFTs</Typography>
                    </Paper>
                    <br />
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" color={"primary"}>
                            Physical Art auction in August Q3
                        </Typography>
                        <Typography variant="body1">First physical art reveal</Typography>
                    </Paper>
                    <br />
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineOppositeContent>
                    <Typography variant="body1" color="textSecondary">
                        Q4
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot>
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                        <Typography variant="h6" color={"primary"}>
                            Coming Soon
                        </Typography>
                    </Paper>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    </div>
  );
};

Roadmap.propTypes = {
  /**
   * External classes
   */
  className: PropTypes.string,
};

export default Roadmap;
