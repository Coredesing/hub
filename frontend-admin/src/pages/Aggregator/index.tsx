import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from './style';
import DefaultLayout from "../../components/Layout/DefaultLayout";
import Button from "../../components/Base/ButtonLink";
import {adminRoute} from "../../utils";
import {deleteAggregator, getAggregator} from "../../store/actions/aggregator";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Pagination from "@material-ui/lab/Pagination";

const Aggregator: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { game_info, loading, failure } = useSelector(( state: any ) => state.game_info);
    const [currentPage, setCurrentPage] = useState(1);
    const gameInfo = game_info?.data?.data
    const tableHeaders = ["Created at", "Game Name", "Category", "Hashtags", "Actions"];
    const handlePaginationChange = (event: any, page: number) => {
        setCurrentPage(page);
    }
    useEffect(() => {
        loadAggregator();
    }, []);

    const loadAggregator = () => {
        dispatch(getAggregator(null))
    }
    const removeGame = (id:number) => {
        const r = window.confirm("Do you really want to delete?");
        if(r){
            dispatch(deleteAggregator(id))
        }
    }
    return (
        <DefaultLayout>
            <div className={classes.header}>
                <div className="header-left">
                    <Button to={adminRoute('/aggregator/add')} text={'Add New Game'} icon={'icon_plus.svg'} />
                </div>
            </div>
            <TableContainer component={Paper} className={classes.tableContainer}>
                {
                    loading ? (
                        [...Array(10)].map((num, index) => (
                            <div key={index}>
                                <Skeleton className={classes.skeleton} width={'100%'} />
                            </div>
                        ))):  (
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    {
                                        tableHeaders.map((tableHeader: string, index: number) => (
                                            <TableCell key={index} className={classes.tableHeader}>{tableHeader}</TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableBody}>
                                {
                                    gameInfo && gameInfo.length > 0 && gameInfo.map((item: any, index: number) =>  (
                                        <TableRow key={index}>
                                            <TableCell >{ item.created_at }</TableCell>
                                            <TableCell >{ item.game_name }</TableCell>
                                            <TableCell >{ item.category }</TableCell>
                                            <TableCell >{ item.hashtags }</TableCell>
                                            <TableCell >
                                                <Button text={'Edit'}
                                                    to={adminRoute('/aggregator/' + item.id)}
                                                    className={classes.editButton}
                                                />
                                                <button
                                                    className={classes.removeButton}
                                                    onClick={() => removeGame(item.id)}
                                                >Remove</button></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )}
                {
                    failure ? <p className={classes.errorMessage}>{failure}</p> : ((!gameInfo || gameInfo.length === 0) && !loading)  ? <p className={classes.noDataMessage}>There is no data</p> : (
                        <>
                            {gameInfo && Math.ceil(gameInfo.length / 10 ) > 1 && <Pagination page={currentPage} className={classes.pagination} count={Math.ceil(gameInfo.length / 10 )} onChange={handlePaginationChange} />}
                        </>
                    )
                }
            </TableContainer>
        </DefaultLayout>
    )
}

export default Aggregator;
