import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select, { SelectProps } from '@material-ui/core/Select';
import { useSelectBoxStyles } from './style'

interface IProps extends SelectProps {
    items?: any[],
    itemNameShowValue?: string | undefined,
    itemNameValue?: string| undefined
}

export const SelectBox = ({items = [], itemNameShowValue, itemNameValue, ...props}: IProps) => {
    const classes = useSelectBoxStyles();
    return (
        <div>
            <FormControl variant="outlined" className={classes.formControl}>
                {/* <InputLabel id="demo-simple-select-outlined-label" style={{color: '#fff'}}>Status</InputLabel> */}
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    className={classes.select}
                    {...props}
                >
                    {/* <MenuItem value="">
                        <em>None</em>
                    </MenuItem> */}
                    {items.map((item, idx) => <MenuItem key={idx} value={itemNameValue ? item[itemNameValue] : item}>{itemNameShowValue ? item[itemNameShowValue] : item}</MenuItem>)}
                </Select>
            </FormControl>
            {/* <select name="" id="" className={classes.select}>
                <option value="">All status</option>
            </select> */}
        </div>
    )
}
