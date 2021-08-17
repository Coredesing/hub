import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableMui from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useTableStyles } from './style';
import clsx from 'clsx';
const nftIcon = '/images/nft1.png';

const StyledTableCell = withStyles((theme) => ({
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
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({

    root: {
        background: '#2E2E2E',
        '& th div': {
            display: 'flex',
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

function createData(name: string, type: string, status: string, owned: number, icon: string) {
    return { name, type, status, owned, icon };
}

const rows = [
    createData('Bunicorn', 'Pulbic', 'Opening', 1, nftIcon),
    createData('Bunicorn', 'Private', 'Opening', 1, nftIcon),
    createData('Bunicorn', 'Seed', 'Finished', 3, nftIcon),
];

export const Table = () => {
    const classes = useTableStyles();
    return (
        <TableContainer component={Paper} className={classes.wrapperTable}>
            <TableMui className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Pool Name</StyledTableCell>
                        <StyledTableCell align="left">Type</StyledTableCell>
                        <StyledTableCell align="left">Status</StyledTableCell>
                        <StyledTableCell align="left">Owned</StyledTableCell>
                        <StyledTableCell align="left">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={row.name}>
                            <StyledTableCell component="th" scope="row">
                                <div>
                                    <img src={row.icon} alt="" />
                                    {row.name}
                                </div>
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.type}</StyledTableCell>
                            <StyledTableCell align="left">
                                <span className={row.status === 'Opening' ? classes.textGreen : classes.textRed}>{row.status}</span>
                            </StyledTableCell>
                            <StyledTableCell align="left">{row.owned}</StyledTableCell>
                            <StyledTableCell align="left">
                                <div className={classes.groupBtn}>
                                    <Button variant="outlined" color="primary" className={clsx(classes.btnDetail, classes.btnAction)}>
                                    Pool Detail
                                    </Button>
                                    <Button variant="contained" color="primary" className={clsx(classes.btnView, classes.btnAction)}>
                                    View Tickets
                                    </Button>
                                </div>
                            </StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </TableMui>
        </TableContainer>
    )
}
