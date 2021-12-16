import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    formButtonUpdatePool: {
        backgroundColor: '#FFCC00',
        boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
        borderRadius: 10,
        padding: '14px 0px',
        border: 'none',
        display: 'inline-block',
        width: '100%',
        color: 'white',
        fontWeight: 600,
        fontSize: 14,
        marginTop: 25,
        marginBottom: 60,
        marginLeft: 10,
        marginRight: 10,
        cursor: 'pointer',
        transition: '.2s all ease-in',

        '&:hover': {
            boxShadow: '0px 15px 20px rgba(0, 0, 0, .1)',
            transform: 'translateY(-7px)'
        },
        '&:focus': {
            outline: 'none'
        }
    },
    infoBox: {
        backgroundColor: 'white',
        boxShadow: `0px 0px 15px rgba(0, 0, 0, 0.1)`,
        borderRadius: 10,
        padding: '20px 25px 30px 25px',
        marginTop: 20
    },
    infoTitle: {

    },
    formControl: {
        padding: 10,
        width: '50%',
        position: 'relative',
    },
    formControlFullWidth: {
        padding: 10,
        width: '100%',
        position: 'relative',
    },
    formControlFull: {
        padding: 10,
        marginTop: 10,
        minHeight: 300,
        width: '100%',
        position: 'relative',
    },
    formControlLabel: {
        fontSize: 14,
        fontWeight: 'bolder',
        letterSpacing: '0.25px',
        color: '#363636'
    },
    formSelect: {
        marginTop: 7,
        height: 50
    },
    textEditor: {
        height: 220
    },
    formErrorMessage: {
        marginTop: 7,
        color: 'red',
    },
    formControlInput: {
        display: 'block',
        border: '1px solid #DFDFDF',
        width: '100%',
        padding: '8px',
        borderRadius: 5,
        marginTop: 5,
        backgroundColor: 'white',
        transition: '.1s all ease-in',

        '&:focus': {
            borderColor: '#FFCC00',
            outline: 'none'
        }
    },
    formControlInline: {
      padding: 10,
      width: '50%',
      display: 'flex',
      alignItems: 'center',
      verticalAlign: 'middle'
    },
    infoForm: {
        display: 'flex',
        marginTop: 20,
        flexWrap: 'wrap',
        width: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    headerRight: {
        display: 'flex',
    },
    tableContainer: {
        padding: '30px 20px',
        borderRadius: 10,
        boxShadow: 'none',
        marginTop: 25
    },
    table: {
        fontFamily: 'Roboto',
        fontWeight: 500,
        fontSize: 14,
        backgroundColor: 'white',
    },
    tableHeader: {
        padding: '0px 0px 25px 30px',
        color: '#363636',
        fontWeight: 600
    },
    tableBody: {
        '& > .MuiTableRow-root:last-child': {
            borderBottom: '1px solid #E5E5E5'
        },
        '& > .MuiTableRow-root:nth-child(odd)': {
            backgroundColor: 'white'
        },
    },
    pagination: {
        marginTop: 30,
        fontSize: 12,
        fontWeight: 400,
        '& .MuiPagination-ul': {
            justifyContent: 'center',
        },
        '& .MuiPaginationItem-page.Mui-selected': {
            backgroundColor: '#FFCC00'
        }
    },
}));

export default useStyles;
