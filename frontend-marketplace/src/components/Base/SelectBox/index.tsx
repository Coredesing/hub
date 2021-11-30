import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select, { SelectProps } from '@material-ui/core/Select';
import clsx from 'clsx';
import { useSelectBoxStyles } from './style'

interface IProps extends SelectProps {
    items?: any[],
    itemNameShowValue?: string | undefined,
    itemNameValue?: string| undefined,
    classesCustom?: {
        formControl: string
    },
    [k: string]: any,
}

const SelectBox = ({items = [], itemNameShowValue, itemNameValue, classesCustom, ...props}: IProps) => {
    const styles = useSelectBoxStyles();
    return (
        <div>
            <FormControl variant="outlined" className={clsx(styles.formControl, classesCustom?.formControl)}>
                {/* <InputLabel id="demo-simple-select-outlined-label" style={{color: '#fff'}}>Status</InputLabel> */}
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    className={styles.select}
                    {...props}
                >
                    {/* <MenuItem value="">
                        <em>None</em>
                    </MenuItem> */}
                    {items.map((item, idx) => <MenuItem key={idx} value={itemNameValue ? item[itemNameValue] : item}>{itemNameShowValue ? item[itemNameShowValue] : item}</MenuItem>)}
                </Select>
            </FormControl>
        </div>
    )
}
export default SelectBox