import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    LotteryWinners: {
      // background: '#303035',
      // borderRadius: 12,
      // padding: '28px 28px',
      // marginBottom: 12,
      // color: '#FFFFFF',
      width: "100%",

      // [theme?.breakpoints?.down('md')]: {
      //   padding: '28px 20px',
      //   width: "100%",
      // },
    },

    title: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 20,

      [theme?.breakpoints?.down('sm')]: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: '24px',
      },
    },

    title2: {
      fontFamily: 'DM Sans',
      fontSeight: '500',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 6,
    },

    LotteryWinnersDesc: {
      marginTop: 15,
      marginBottom: 16,
      font: 'normal normal normal 14px/24px Helvetica'
    },

    LotteryWinnersMessage: {
      marginBottom: 16,
      font: 'normal normal normal 14px/24px Helvetica',
      fontWeight: 'bold',
      fontSize: 15,
      color: '#8db4ff'
    },

    table: {
      '& .MuiTableBody-root td': {
        font: 'normal normal normal 14px/24px Helvetica'
      }
    },

    tableContainer: {
      width: '100%',
      background: '#222228',
      border: '1px solid #44454B',
      marginTop: 20,
      borderRadius: 8,

      '& th, & td': {
        fontFamily: 'Helvetica',
        fontSize: 16,
        lineHeight: '24px',
        color: '#FFFFFF',
      },

      '& th': {
        [theme?.breakpoints?.down('sm')]: {
          fontSize: 14,
          lineHeight: '20px',
        },
      },

      '& .MuiTableCell-root': {
        borderBottom: '1px solid #44454B',

        '&:first-child': {
          textAlign: 'center',
        }
      }
    },

    tableHeaderWrapper: {
      background: '#191920',
      borderRadius: '8px 8px 0px 0px',

      '& th': {
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
        color: '#FFFFFF',
        [theme?.breakpoints?.down('sm')]: {
          fontSize: 14,
          fontFamily: 'DM Sans',
          fontWeight: 'bold',
        },
      },
      
      '& tr th:first-child': {
        width: 80,
        textAlign: 'center',
      }
    },

    tableHeader: {
    },

    tableSearchWrapper: {
      maxWidth: '100%',
      position: 'relative',
      background: '#222228',
      border: '1px solid #44454B',
      borderRadius: 8,

      '& input': {
        fontFamily: 'Helvetica',
        fontSize: 16,
        lineHeight: '24px',
        color: '#AEAEAE',
        height: '48px',
        padding: '0 50px 0 20px',
        width: '100%'
      },

      '& input #placeholder': {
        color: 'rgba(153, 153, 153, 0.5)',
        font: 'normal normal normal 14px/24px Helvetica!important'
      },

    },

    tableSearchIcon: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: 'translateY(-50%)'
    },

    tableSearch: {
      background: 'transparent',
      padding: '14px 0px 14px 12px',
      border: 'none',
      color: 'white',
      width: '80%',

      '&:focus': {
        outline: 'none'
      },

      '&::placeholder': {
        color: '#999999',
        fontWeight:  400,
        fontSize: 15
      }
    },

    pagination: {
      '& *': {
        color: 'white'
      }
    }
  };
});

export default useStyles;
