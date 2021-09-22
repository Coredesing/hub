import React from 'react'

import { makeStyles } from '@material-ui/core';
import { isNumber } from 'lodash';

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
                transition: '0.5s',
            }
        },
        showProgress: {
            position: 'absolute',
            left: 0,
            height: '6px',
            background: '#72F34B',
            boxShadow: '0px 0px 12px rgba(114, 243, 75, 0.2)',
            width: '20px',
            transition: '0.5s',
        }
    };
});

type NumberString = string;
interface IProps {
    progress: number | NumberString;
}

export const Progress = (props: IProps) => {
    const classes = useStyles();
    const progress = isNumber(+props.progress) ? +props.progress : 0;
    let leftImg = progress;
    let leftImgPx = '17px';
    if(progress < 5) {
        leftImg = 0;
    }
    if(props.progress >= 90) {
        leftImg = progress - 1;
        leftImgPx = `${17 * 2 - 2 - (100 - progress)}px`
    }
    return (
        <div className={classes.progress}>
            <div className={classes.showProgress} style={{width: `${progress || 0}%`}}></div>
            <img src={rocketIcon} alt="" style={{left: `calc(${leftImg || 0}% - ${leftImgPx})`}} />
        </div>
    )
}

export default React.memo(Progress);