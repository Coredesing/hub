import React, {useState} from 'react';
import useStyles from "../../style";
import FormControl from '@material-ui/core/FormControl';

// @ts-ignore
import ReactDataGrid from "react-data-grid";
// @ts-ignore
import DataGrid from 'react-data-grid';

function TierTableWidthDataGrid(props: any) {
  const classes = useStyles();
  const {
    register, clearErrors, errors, handleSubmit, control,
    poolDetail,
    renderError
  } = props;

  const [columns, setColumns] = useState([
    { key: "id", name: "ID", editable: true },
    { key: "title", name: "Title", editable: true },
    { key: "complete", name: "Complete", editable: true }
  ]);

  const [rows, setRows] = useState([
    { id: 0, title: "Task 1", complete: 20 },
    { id: 1, title: "Task 2", complete: 40 },
    { id: 2, title: "Task 3", complete: 60 }
  ]);

  // { fromRow, toRow, updated }
  const onGridRowsUpdated = (e: any) => {
  };

  return (
    <>
      <ReactDataGrid
        columns={columns}
        rowGetter={(i: any) => {
          // return rows[i];
          return {key: '', name: ''};
        }}
        rowsCount={3}
        enableCellSelect={true}
        // onGridRowsUpdated={onGridRowsUpdated}
      />
    </>
  );
}

export default TierTableWidthDataGrid;
