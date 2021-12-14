import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useStyles from './style';
import DefaultLayout from "../../components/Layout/DefaultLayout";
import Button from "../../components/Base/ButtonLink";
import {adminRoute} from "../../utils";
import {deleteCollection, getCollections, setShowCollection} from "../../store/actions/collections";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import Pagination from "@material-ui/lab/Pagination";
import {Switch} from "antd";
import SearchForm from '../UserList/SearchForm';

const Collections: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { collection_info, loading, failure } = useSelector(( state: any ) => state.collection_info);
    const [currentPage, setCurrentPage] = useState(1);
    const [query, setQuery] = useState('');
    const collectionInfo = collection_info?.data?.data
    const lastPage = collection_info?.data?.lastPage;
    const tableHeaders = ["ID", "Created at", "Name", "Type", "Priority", "Is Show", "Actions"];
    const handlePaginationChange = (event: any, page: number) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        const loadCollections = (param: number, search?: any) => {
            dispatch(getCollections(null, param, search))
        }
        loadCollections(currentPage, query);
    }, [currentPage, dispatch, query]);

    const removeGame = (id:number) => {
        const r = window.confirm("Do you really want to delete?");
        if(r){
            dispatch(deleteCollection(id))
        }
    }

    const handleSearch = (event: any) => {
        setCurrentPage(1);
        setQuery(event.target.value);
    };

    const onChangeShowHide = (value:boolean, id:any) => {
        dispatch(setShowCollection(id,value))
    }

    return (
        <DefaultLayout>
            <div className={classes.header}>
                <div className="header-left">
                    <Button to={adminRoute('/collections/add')} text={'Add Colection'} icon={'icon_plus.svg'} />
                </div>
                <SearchForm
                    seachValue={query}
                    handleSearch={handleSearch}
                    placeholder='Search'
                />
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
                                            <TableCell align={"left"} key={index} className={classes.tableHeader}>{tableHeader}</TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableBody}>
                                {
                                    collectionInfo && collectionInfo.length > 0 && collectionInfo.map((item: any, index: number) =>  (
                                        <TableRow key={index}>
                                            <TableCell >{ item.id }</TableCell>
                                            <TableCell >{ item.created_at }</TableCell>
                                            <TableCell >{ item.name }</TableCell>
                                            <TableCell >{ item.type }</TableCell>
                                            <TableCell >{ item.priority }</TableCell>
                                            <TableCell align={'left'}><Switch
                                                onChange={ async (switchValue) => {
                                                    onChangeShowHide(switchValue, item.id);
                                                }}
                                                defaultChecked={item.is_show}
                                                checkedChildren="Show"
                                                unCheckedChildren="Hide"
                                            /></TableCell>
                                            <TableCell style={{display: 'flex'}}>
                                                <Button text={'Edit'}
                                                    to={adminRoute('/collections/' + item.id)}
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
                    failure ? <p className={classes.errorMessage}>{failure}</p> : ((!collectionInfo || collectionInfo.length === 0) && !loading)  ? <p className={classes.noDataMessage}>There is no data</p> : (
                        <>
                            {collectionInfo && lastPage > 1 && <Pagination page={currentPage} className={classes.pagination} count={lastPage} onChange={handlePaginationChange} />}
                        </>
                    )
                }
            </TableContainer>
        </DefaultLayout>
    )
}

export default Collections;
