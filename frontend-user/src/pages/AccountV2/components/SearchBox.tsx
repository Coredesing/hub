import React from 'react';
import clsx from 'clsx';
import { useSearchBoxStyles } from './style';
const searchIcon = '/images/icons/search-1.svg';

export const SearchBox = (props: {[k in string]: any}) => {
    const classes = useSearchBoxStyles();
    return (
        <div className={classes.div}>
            <form action="" className={classes.form}>
                <input type="text" placeholder="" {...props} className={clsx(classes.input, props.className)} />
                <img src={searchIcon} alt="" className={classes.img}/>
            </form>
        </div>
    )
}
