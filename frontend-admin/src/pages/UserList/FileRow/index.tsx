import React, { useState } from 'react';
import { TableCell, TableRow, Tooltip, Button } from '@material-ui/core';
import useComponentVisible from '../../../hooks/useComponentVisible';
import { downloadUserList } from '../../../request/user'

import useStyles from './style';

type FileProps = {
  id: number;
  file_name: string;
  status: string;
  download_number: number;
  created_at: number;
}

type FileRowProps = {
  file: FileProps;
}

const UserRecord: React.FC<FileRowProps> = (props: FileRowProps) => {
  const { file } = props;
  const classes = useStyles();
  const { ref } = useComponentVisible();
  const [numDownload, setNumDownload] = useState(file.download_number);

  const handleClickDownloadBtn = async () => {
    await downloadUserList(file.id, file.file_name)
    setNumDownload(numDownload + 1)
  }

  return (
    <TableRow
      ref={ref} className={classes.tableRow} key={file.id}
    >
      <TableCell className={classes.tableCell} align="left">
        {file.id}
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        {file.file_name}
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        {file.status}
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        {numDownload}
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        {file.created_at}
      </TableCell>

      <TableCell className={classes.tableCell} align="left">
        {file.status !== 'fail' && <Button disabled={file.status === 'pending'} className={classes.exportBtn} onClick={handleClickDownloadBtn}>Download</Button>}
      </TableCell>
    </TableRow>
  )

};

export default UserRecord;
