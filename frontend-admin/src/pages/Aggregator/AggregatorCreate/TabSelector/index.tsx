import * as React from 'react';
import useStyles from "./style";

export const TabSelector = ({
                                isActive,
                                children,
                                onClick,
                            }: {
    isActive: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) => {
    const classes = useStyles();
    return (
    <button
        className={ isActive ? classes.activeTab : classes.deActiveTab }
        onClick={onClick}
    >
        {children}
    </button>
)};
