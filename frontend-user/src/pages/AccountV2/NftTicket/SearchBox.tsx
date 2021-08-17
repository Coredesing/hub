import React from 'react'
import { useSearchBoxStyles } from './style';
const searchIcon = '/images/icons/search-1.svg';

export const SearchBox = () => {
    const classes = useSearchBoxStyles();
    return (
        <div>
            <form action="" className={classes.form}>
                <input type="text" placeholder="Search pool name" className={classes.input}/>
                <img src={searchIcon} alt="" className={classes.img}/>
            </form>
        </div>
    )
}
