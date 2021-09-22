import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import Skeleton from '@material-ui/lab/Skeleton';
import FileRow from './FileRow'
import useStyles from './style';
import { getFileExportList } from "../../request/user";

const tableHeaders = ["ID", "FILE NAME", "STATUS", "DOWNLOAD", "EXPORT TIME", "ACTION"];

const ExportFile: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [failure, setFailure] = useState(false);

    const handlePaginationChange = (event: any, page: number) => {
        setCurrentPage(page);
    };

    const getFileExportListInfo = async () => {
        try {
            setLoading(true);
            const resObject = await getFileExportList({ page: currentPage });
            if (resObject.status === 200) {
                setFiles(resObject.data.data);
                setLastPage(resObject.data.lastPage);
                setFailure(false);
            } else {
                setFailure(true);
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setFailure(true);
        }
    }

    useEffect(() => {
        getFileExportListInfo();
    }, [currentPage]);

    return (
        <TableContainer component={Paper} className={classes.tableContainer}>
            {
                loading ? (
                    [...Array(10)].map((num, index) => (
                        <div key={index}>
                            <Skeleton className={classes.skeleton} width={'100%'} />
                        </div>
                    ))) : (
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
                                files && files.length > 0 && files.map((file: any, index: number) => (
                                    <FileRow key={file.id} file={file} />
                                ))
                            }
                        </TableBody>
                    </Table>
                )}
            {
                failure ? <p className={classes.errorMessage}>{failure}</p> : ((!files || files.length === 0) && !loading) ? <p className={classes.noDataMessage}>There is no data</p> : (
                    <>
                        {files && lastPage > 1 && <Pagination page={currentPage} className={classes.pagination} count={lastPage} onChange={handlePaginationChange} />}
                    </>
                )
            }
        </TableContainer>
    )
};

export default ExportFile;