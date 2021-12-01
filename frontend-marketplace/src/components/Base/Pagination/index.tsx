import PaginationMui from '@material-ui/lab/Pagination';
import React from 'react';
import { useStyles } from './style';

export const Pagination = (props: any) => {
    const classes = useStyles();
    return (
        <PaginationMui 
            shape="rounded"
            className={classes.paginationNav}
            classes={{
                ul: classes.ulPagination
            }}
            count={props.count}
            page={props.page}
            onChange={props.onChange}
        />
    )
}
export default React.memo(Pagination);