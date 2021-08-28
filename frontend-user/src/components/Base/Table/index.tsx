import { withStyles } from "@material-ui/core/styles";
import TableMui from "@material-ui/core/Table";
import TableBodyMui from "@material-ui/core/TableBody";
import TableCellMui from "@material-ui/core/TableCell";
import TableContainerMui from "@material-ui/core/TableContainer";
import TableHeadMui from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useTableStyles } from "./style";
import clsx from "clsx";
import useWindowSize from "../../../hooks/useWindowSize";
import { typeDisplayFlex } from "../../../styles/CommonStyle";

export const TableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#171717",
    color: theme.palette.common.white,
    fontFamily: "Firs Neue",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "24px",
  },
  body: {
    fontSize: 14,
  },
}))(TableCellMui);

export const TableRowBody = withStyles((theme) => ({
  root: {
    background: "#2E2E2E",
    "& th div": {
      ...typeDisplayFlex,
      alignItems: "center",
      gap: "8px",
    },
    "& td, & th ": {
      borderBottom: "1px solid #44454B",
      color: theme.palette.common.white,
      fontFamily: "Firs Neue",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "24px",
    },
    // '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.action.hover,
    // },
  },
}))(TableRow);

export const TableContainer = ({ children, ...props }: any) => {
  const classes = useTableStyles();
  const [width] = useWindowSize();

  return (
    <TableContainerMui
      component={Paper}
      {...props}
      className={clsx(classes.wrapperTable, props.className)}
      style={{ maxWidth: width - 50, ...(props.style && typeof props.style === 'object' ? props.style : {}) }}
    >
      {children}
    </TableContainerMui>
  );
};
export const Table = ({ children, ...props }: any) => {
  const classes = useTableStyles();
  return (
    <TableMui
      {...props}
      aria-label="customized table"
      className={clsx(classes.table, props.className)}
    >
      {children}
    </TableMui>
  );
};

export const TableRowHead = TableRow;
export const TableBody = TableBodyMui;
export const TableHead = TableHeadMui;

interface ISortLabel {
  order?: "asc" | "desc" | null;
  children?: any;
  [k: string]: any;
}
export const TableSortLabel = ({ children, order, ...props }: ISortLabel) => {
  const classes = useTableStyles();
  return (
    <div className={classes.labelSort}>
      {children}
      <span {...props} className={clsx(classes.sortIcon, props.className)}>
        <svg
          width="10"
          height="5"
          viewBox="0 0 10 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.18221 4.90904H8.81846C8.96619 4.90904 9.09407 4.8551 9.20199 4.74713C9.30984 4.63919 9.36399 4.51137 9.36399 4.36363C9.36399 4.2159 9.30987 4.08814 9.20199 3.98005L5.38385 0.161911C5.27597 0.0540898 5.14817 0 5.00035 0C4.85253 0 4.72474 0.0540898 4.61677 0.161911L0.79863 3.98005C0.690659 4.08802 0.636719 4.2159 0.636719 4.36363C0.636719 4.51134 0.690659 4.63919 0.79863 4.74713C0.90672 4.8551 1.03451 4.90904 1.18221 4.90904Z"
            fill={`${order === "asc" ? "#AEAEAE" : "#3e3e3e"}`}
          />
        </svg>

        <svg
          width="10"
          height="5"
          viewBox="0 0 10 5"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.81846 0.0910492H1.18221C1.03439 0.0910492 0.906601 0.14502 0.79863 0.252871C0.690659 0.360842 0.636719 0.488633 0.636719 0.636366C0.636719 0.784098 0.690659 0.911979 0.79863 1.01989L4.61677 4.83797C4.72486 4.94594 4.85265 5 5.00035 5C5.14805 5 5.27597 4.94594 5.38385 4.83797L9.20199 1.01986C9.30984 0.911979 9.36399 0.784097 9.36399 0.636336C9.36399 0.488633 9.30987 0.360842 9.20199 0.252841C9.0941 0.1449 8.96619 0.0910492 8.81846 0.0910492Z"
            fill={`${order === "desc" ? "#AEAEAE" : "#3e3e3e"}`}
          />
        </svg>
      </span>
    </div>
  );
};
