import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableMui from '@material-ui/core/Table';
import TableBodyMui from '@material-ui/core/TableBody';
import TableCellMui from '@material-ui/core/TableCell';
import TableContainerMui from '@material-ui/core/TableContainer';
import TableHeadMui from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useTableStyles } from './style';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

export const TableCell = withStyles((theme) => ({
    head: {
        backgroundColor: '#171717',
        color: theme.palette.common.white,
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '24px',
    },
    body: {
        fontSize: 14,
    },
}))(TableCellMui);

export const TableRowBody = withStyles((theme) => ({

    root: {
        background: '#2E2E2E',
        '& th div': {
            ...typeDisplayFlex,
            alignItems: 'center',
            gap: '8px',
        },
        '& td, & th ': {
            borderBottom: '1px solid #44454B',
            color: theme.palette.common.white,
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '24px',
        }
        // '&:nth-of-type(odd)': {
        //     backgroundColor: theme.palette.action.hover,
        // },
    },
}))(TableRow);

export const TableContainer = (props: any) => {
    const classes = useTableStyles();
    return <TableContainerMui component={Paper} className={classes.wrapperTable}>
        {props.children}
    </TableContainerMui>
}
export const Table = (props: any) => {
    const classes = useTableStyles();
    return <TableMui className={classes.table} aria-label="customized table">{props.children}</TableMui>
}

export const TableRowHead = TableRow;
export const TableBody = TableBodyMui;
export const TableHead = TableHeadMui;


