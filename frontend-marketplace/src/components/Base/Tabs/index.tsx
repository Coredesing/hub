import AppBarMui from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Box, useMediaQuery, useTheme, withStyles } from '@material-ui/core';
import PropTypes from "prop-types";
import clsx from 'clsx';
import useStyles from "./style";

export function TabPanel(props: any) {
    const { children, value, index, classChidlren, className, ...other } = props;
    const style = useStyles();
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            className={clsx(className, style.tabPanel)}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
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
        "aria-controls": `full-width-tabpanel-${index}`,
    };
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

const AntTabs = withStyles({
    root: {
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    indicator: {
        backgroundColor: "#72F34B",
        height: "3px",
        borderRadius: "20px",
    },
})(Tabs);

type AppBarType = {
    onChange: (event: React.ChangeEvent<{}>, value: any) => void;
    currentTab: number;
    tabNames: string[];
    [k: string]: any;
}

export const AppBar = (props: AppBarType) => {
    const classes = useStyles();
    const theme = useTheme();
    const matchSM = useMediaQuery(theme.breakpoints.down("sm"));
    return <AppBarMui className={classes.appbar} position="static">
        <AntTabs
            centered={matchSM ? true : false}
            value={props.currentTab}
            onChange={props.onChange}
            aria-label="simple tabs"
            variant={matchSM ? "fullWidth" : "standard"}
        >
            {
                props.tabNames.map((name, idx) => <Tab
                    key={idx}
                    className={clsx(classes.tabName, { active: props.currentTab === idx })}
                    label={name}
                    {...a11yProps(idx)}
                />)
            }
        </AntTabs>
    </AppBarMui>
}


export default {
    AppBar,
    TabPanel,
}