import React from 'react';
import Button from '@material-ui/core/Button';
import {
    TableCell,
    TableContainer,
    Table as TableMui,
    TableBody,
    TableHead,
    TableRowBody,
    TableRowHead
} from '../components/Table';
import useStyles from './style';
import clsx from 'clsx';
const nftIcon = '/images/nft1.png';

function createData(name: string, type: string, status: string, owned: number, icon: string) {
    return { name, type, status, owned, icon };
}

const rows = [
    createData('Bunicorn', 'Pulbic', 'Opening', 1, nftIcon),
    createData('Bunicorn', 'Private', 'Opening', 1, nftIcon),
    createData('Bunicorn', 'Seed', 'Finished', 3, nftIcon),
];

export const Table = () => {
    const classes = useStyles();
    return (
        <TableContainer>
            <TableMui>
                <TableHead>
                    <TableRowHead>
                        <TableCell>Pool Name</TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="left">Owned</TableCell>
                        <TableCell align="left">Action</TableCell>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRowBody key={row.name}>
                            <TableCell component="th" scope="row">
                                <div>
                                    <img src={row.icon} alt="" />
                                    {row.name}
                                </div>
                            </TableCell>
                            <TableCell align="left">{row.type}</TableCell>
                            <TableCell align="left">
                                <span className={row.status === 'Opening' ? classes.textGreen : classes.textRed}>{row.status}</span>
                            </TableCell>
                            <TableCell align="left">{row.owned}</TableCell>
                            <TableCell align="left">
                                <div className={classes.groupBtn}>
                                    <Button variant="outlined" color="primary" className={clsx(classes.btnDetail, classes.btnAction)}>
                                        Pool Detail
                                    </Button>
                                    <Button variant="contained" color="primary" className={clsx(classes.btnView, classes.btnAction)}>
                                        View Tickets
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRowBody>
                    ))}
                </TableBody>
            </TableMui>
        </TableContainer>
    )
}
