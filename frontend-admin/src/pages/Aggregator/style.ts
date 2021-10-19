import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
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
    skeleton: {
        padding: '25px 0px',
        marginTop: 10
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
    removeButton: {
        backgroundColor: '#cd2d00',
        boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
        borderRadius: 10,
        padding: '10px 0px',
        border: 'none',
        display: 'inline-block',
        width: 80,
        color: 'white',
        fontWeight: 600,
        fontSize: 14,
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
    editButton: {
        backgroundColor: '#0074cd',
        boxShadow: '0px 0px 30px rgba(243, 203, 25, 0.15)',
        borderRadius: 10,
        height: 40,
        border: 'none',
        display: 'inline-block',
        width: 80,
        color: 'white',
        fontWeight: 600,
        fontSize: 14,
        marginRight: 5,
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
    noDataMessage: {
        fontWeight: 500,
        marginTop: 30,
        textAlign: 'center',
        fontSize: 15
    },
    errorMessage: {
        fontWeight: 500,
        marginTop: 30,
        textAlign: 'center',
        fontSize: 15,
        color: 'red'
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
