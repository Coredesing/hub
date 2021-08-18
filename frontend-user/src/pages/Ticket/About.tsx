import React from 'react';

import PropTypes from 'prop-types';
// import SwipeableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
const shareIcon = '/images/icons/share.svg';
const telegramIcon = '/images/icons/telegram-1.svg';
const twitterIcon = '/images/icons/twitter-1.svg';
const mediumIcon = '/images/icons/medium-1.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: 'transparent',
    },
    tabName: {
        fontFamily: 'Firs Neue',
        fontWeight: 600,
        fontStyle: 'normal',
        fontSize: '16px',
        lineHeight: '28px',
        color: '#72F34B',
        mixBlendMode: 'normal',
        textTransform: 'unset',
    },
    appbar: {
        background: 'unset',

    },
    tabPaneContent: {
        fontFamily: 'Firs Neue',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fontSize: '14px',
        lineHeight: '22px',
        color: '#d1d1d1',
        mixBlendMode: 'normal',
    },
    desc: {
        marginBottom: '20px',
    },
    links: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',

    },
    link: {
        display: 'grid',
        gridTemplateColumns: '80px auto',
        gap: '2px',
        alignItems: 'center',

        '& .text': {
            fontFamily: 'Firs Neue',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: '14px',
            lineHeight: '22px',
            color: '#fff',
            mixBlendMode: 'normal',
        }
    },
    weblink: {
        '& a': {
            background: '#2E2E2E',
            borderRadius: '4px',
            padding: '4px 8px',
            fontFamily: 'Firs Neue',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: '14px',
            lineHeight: '22px',
            color: '#fff',
            mixBlendMode: 'normal',
            display: 'inline-flex',
            gap: '7px'
        }
    },
    socials: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 28px)',
        gap: '10px',
        '& a': {
            display: 'grid',
            '& img': {
                width: '24px',
                height: '24px',
            }
        }
    }

}));

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const AntTabs = withStyles({
    root: {
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    indicator: {
        backgroundColor: "#72F34B",
        height: "3px",
        borderRadius: "20px",
    },
})(Tabs);

export function AboutTicket({info = {}}: any) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    const rules = [
        'Every user can only buy a maximum of 25 tickets.',
        'Each ticket can buy 100 GAFI.',
        'Total number of Mystery Boxes: 100,000,000 tickets.',
        'KYC required.',
    ]

    return (
        <div className={classes.root}>
            <AppBar className={classes.appbar} position="static">
                <AntTabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab className={classes.tabName} label="Rule Introduction" {...a11yProps(0)} />
                    <Tab className={classes.tabName} label="About project" {...a11yProps(1)} />
                </AntTabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <ul className={classes.tabPaneContent}>
                    {
                        rules.map((rule, idx) => <li key={idx}>{idx + 1}. {rule}</li>)
                    }
                </ul>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <div className={classes.desc}>
                    <p className={classes.tabPaneContent}>
                        {info.description}
                    </p>
                </div>

                <div className={classes.links}>
                    <div className={classes.link}>
                        <span className="text">Website</span>
                        <div className={classes.weblink}>
                            <a href={info.website} target="_blank" rel="noreferrer">{info.website}<img src={shareIcon} alt="" /> </a>
                        </div>
                    </div>
                    <div className={classes.link}>
                        <span className="text">Social</span>
                        <div className={classes.socials}>
                            <a href={info.socialNetworkSetting?.telegram_link} target="_blank" rel="noreferrer">
                                <img src={telegramIcon} alt="" />
                            </a>
                            <a href={info.socialNetworkSetting?.twitter_link} target="_blank" rel="noreferrer">
                                <img src={twitterIcon} alt="" />
                            </a>
                            <a href={info.socialNetworkSetting?.medium_link} target="_blank" rel="noreferrer">
                                <img src={mediumIcon} alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </div>
    );
}