import React from 'react'

import { makeStyles } from '@material-ui/core';

const rocketIcon = '/images/icons/rocket-1.svg';

const useStyles = makeStyles(() => {
    return {
        progress: {
            height: '6px',
            width: '100%',
            background: '#565656',
            borderRadius: '2px',
            position: 'relative',
            
            '& img': {
                position: 'absolute',
                top: '-22px',
            }
        },
        showProgress: {
            position: 'absolute',
            left: 0,
            height: '6px',
            background: '#72F34B',
            boxShadow: '0px 0px 12px rgba(114, 243, 75, 0.2)',
            width: '20px'
        }
    };
});

interface IProps {
    progress: number
}

export const Progress = (props: IProps) => {
    const classes = useStyles();
    let leftImg = props.progress;
    let leftImgPx = '17px';
    if(props.progress < 5) {
        leftImg = 0;
    }
    if(props.progress >= 90) {
        leftImg = props.progress - 1;
        leftImgPx = `${17 * 2 - 2 - (100 - props.progress)}px`
    }
    return (
        <div className={classes.progress}>
            <div className={classes.showProgress} style={{width: `${props.progress || 0}%`}}></div>
            <img src={rocketIcon} alt="" style={{left: `calc(${leftImg || 0}% - ${leftImgPx})`}} />
        </div>
    )
}
