import Tabs from "@material-ui/core/Tabs";
import Box from '@material-ui/core/Box';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import AppBarMui from "@material-ui/core/AppBar";
import TabMui from "@material-ui/core/Tab";

export const AppBar = AppBarMui;
export const Tab = TabMui;

export function TabPanel(props: any) {
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

export function a11yProps(index: any) {
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

export const AntTabs = withStyles({
    root: {
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    indicator: {
        backgroundColor: "#72F34B",
        height: "3px",
        borderRadius: "20px",
    },
})(Tabs);
