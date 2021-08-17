import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useSelectBoxStyles } from './style'


export const SelectBox = () => {
    const classes = useSelectBoxStyles();
    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label" style={{color: '#fff'}}>Status</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    //   value={age}
                    //   onChange={handleChange}
                    label="Status"
                    className={classes.select}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>All status</MenuItem>
                    <MenuItem value={20}>All status</MenuItem>
                    <MenuItem value={30}>All status</MenuItem>
                </Select>
            </FormControl>
            {/* <select name="" id="" className={classes.select}>
                <option value="">All status</option>
            </select> */}
        </div>
    )
}
