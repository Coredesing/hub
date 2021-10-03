import React, {useEffect, useState} from 'react';
import useStyles from "../../style";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button, makeStyles} from "@material-ui/core";
import {renderErrorCreatePool} from "../../../../utils/validate";
import CreateEditSeriesContentForm from "./CreateEditSeriesContentForm";

const useStylesTable = makeStyles({
  table: {
    minWidth: 650,
  },
});

const createData = (id: number, name: any, amount: any, rate: number) => {
  return { id, name, amount, rate };
};

const createDefaultTiers = () => {
  return [];
};

function SeriesContentTable(props: any) {
  const classes = useStyles();
  const classesTable = useStylesTable();
  const {
    register, watch, setValue, control, errors,
    poolDetail,
  } = props;
  const renderError = renderErrorCreatePool;
  const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
  const [editData, setEditData] = useState({});
  const [editRow, setEditRow] = useState(0);
  const [isEdit, setIsEdit] = useState(true);
  const [rows, setRows] = useState(createDefaultTiers());

  useEffect(() => {
    if (poolDetail && poolDetail.seriesContentConfig) {
      setRows(poolDetail.seriesContentConfig);
    }
  }, [poolDetail]);

  const openPopupEdit = (e: any, row: any, index: number) => {
    setEditData(row);
    setEditRow(index);
    setIsEdit(true);
    setIsOpenEditPopup(true);
  };

  const openPopupCreate = (e: any) => {
    setEditData({});
    setEditRow(-1);
    setIsEdit(false);
    setIsOpenEditPopup(true);
  };

  const handleCreateUpdateData = (responseData: any) => {
    console.log('responseData', editRow, responseData);
    if (isEdit && editRow !== -1) {
      // Update
      // @ts-ignore
      rows[editRow] = responseData;
    } else {
      // Create
      // @ts-ignore
      rows.push(responseData);
    }
    setValue('seriesContentConfig', rows);
    setIsOpenEditPopup(false);
  };

  const deleteRecord = (e: any, row: any, index: number) => {
    console.log('ROW: ', row, index);
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Do you want delete this record ?')) {
      return false;
    }

    const newRows = [...rows];
    if (index > -1) {
      newRows.splice(index, 1);
    }
    setRows(newRows);
    setValue('seriesContentConfig', JSON.stringify(newRows));
  };

  return (
    <>
      {isOpenEditPopup &&
        <CreateEditSeriesContentForm
          isOpenEditPopup={isOpenEditPopup}
          setIsOpenEditPopup={setIsOpenEditPopup}
          renderError={renderError}
          editData={editData}
          isEdit={isEdit}
          handleCreateUpdateData={handleCreateUpdateData}
        />
      }
      <div><label className={classes.exchangeRateTitle}>Series Content Configuration</label></div>

      <div className={classes.formControl}>
        <Button
          variant="contained"
          color="primary"
          onClick={openPopupCreate}
        >Create</Button>
      </div>

      <TableContainer component={Paper}>
        <Table className={classesTable.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.rate}%</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => openPopupEdit(e, row, index)}
                    >Edit</Button>

                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(e) => deleteRecord(e, row, index)}
                      style={{marginLeft: 10, marginTop: 0}}
                    >Delete</Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <input
        type="hidden"
        name="seriesContentConfig"
        value={JSON.stringify(rows)}
        ref={register({
          // required: true
        })}
      />
    </>
  );
}

export default SeriesContentTable;
