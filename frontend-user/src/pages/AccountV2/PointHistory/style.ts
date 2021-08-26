import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    tabPointHistory: {
    },

    w25: {
      width: '25%',
    },

    w50: {
      width: '50%',
    },
    
    minW124: {
      minWidth: 124,
    },

    tableContainer: {
      background: '#191920',
      boxShadow: 'none',
    },

    color6398FF: {
      color: '#72F34B',
    },

    stakedTx: {
      width: 64,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
    },

    unStakedTx: {
      width: 170,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'block',
      cursor: 'pointer',
    },

    iconInfo: {
      top: 2,
      left: 3,
      position: 'relative',
    },

    infoTab: {

    },

    intemInfoTab: {
      marginBottom: 18,
      display: 'flex',
      flexWrap: 'wrap',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      color: '#FFFFFF',

      [theme.breakpoints.down('sm')]: {
        justifyContent: 'space-between',
        marginBottom: 20,
      },
    },

    nameInfoTab: {
      width: 190,
      paddingRight: 10,
      fontWeight: 'bold',
      fontSize: 14,
      color: '#AEAEAE',
    },

    valueInfoTab: {

    },

    headTabTable: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      
      [theme.breakpoints.down('sm')]: {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },

    leftHeadTabTable: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',
      
      [theme.breakpoints.down('sm')]: {
        marginBottom: 18,
      },
    },

    rightHeadTabTable: {
      display: 'flex',
      alignItems: 'center',
    },

    boxChecked: {
      display: 'block',
      position: 'relative',
      paddingLeft: 22,
      cursor: 'pointer',
      userSelect: 'none',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      marginLeft: 16,
      
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,

        '&:first-child': {
          display: 'none',
        }
      },

      '& input': {
        position: 'absolute',
        opacity: 0,
        cursor: 'pointer',
        height: 0,
        width: 0,
      },

      '& .checkmark': {
        position: 'absolute',
        top: 2,
        left: 0,
        height: 16,
        width: 16,
        backgroundColor: '#444449',
        border: '1px solid #58585A',
        borderRadius: 4,

        '&:after': {
          content: '""',
          left: 4,
          top: 2,
          width: 4,
          height: 7,
          border: 'solid white',
          borderWidth: '0 2px 2px 0',
          transform: 'rotate(45deg)',
          position: 'absolute',
          display: 'none',
        },

        '&.checked': {
          backgroundColor: '#2196F3 !important',
          display: 'block',
  
          '&:after': {
            display: 'block !important',
          },
        }
      },
    },

    tableHead: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',

      '& .MuiTableCell-head' :{
        color: '#AEAEAE',
      }
    },

    dadText: {
      height: 42,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',
    },

    cellHeadDad: {
      padding: 0,
      verticalAlign: 'top',
      border: '1px solid #37373D',
    },

    childText: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    cellHeadChild: {
      height: 58,
      padding: '0 2px',
      border: 'none',
      verticalAlign: 'middle',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',
      borderTop: '1px solid #37373D',
      borderRight: '1px solid #37373D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',

      '&:last-child': {
        borderRight: 'none',
      }
    },
    
    tableRow: {
      background: '#222228',
    },

    cellBodyDad: {
      padding: 0,
      border: '1px solid #37373D',
    },

    cellBodyChild: {
      height: 46,
      padding: '0 2px',
      border: 'none',
      verticalAlign: 'middle',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      borderRight: '1px solid #37373D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteWpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',

      '&.hidden': {
        border: '1px solid #2B4881',
      },

      '&:last-child': {
        borderRight: 'none',
      }
    },

    boxHistory: {
      marginTop: -2,
      border: '1px solid #2B4881',
      position: 'relative',
      marginBottom: -1,
  
    },

    tableRowHistory: {
      '& th': {
        height: 38,
        borderBottom: '1px solid #37373D',
        fontFamily: 'DM Sans',
        fontWeight: 'bold',
        fontSize: 12,
        lineHeight: '16px',
        color: '#FFFFFF',
      },
      '& td': {
        height: 34,
        borderTop: 'none',
        borderBottom: 'none',
        fontFamily: 'Helvetica',
        fontSize: 12,
        lineHeight: '18px',
        color: '#FFFFFF',
      }
    },

    btnShow: {
      color: '#FFFFFF',
      fontSize: 17,
    },

    btnHidden: {
      color: '#72F34B',
      fontSize: 17,
    },

    tableMobile: {
      background: '#222228',
      borderRadius: 8,
      padding: '8px 12px',
    },

    rowMobile: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      borderBottom: '1px solid rgb(255 255 255 / 10%)',
      padding: '12px 0',

      '&:last-child': {
        borderBottom: 'none',
      }
    },

    cellMobile: {

    },

    nameCellMobile: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',
      marginBottom: 8,
    },

    valueCellMobile: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',

      "& a": {
        color: '#72F34B',
        cursor: 'pointer',
      }
    },

    pagination: {
      '& *': {
        color: 'white'
      }
    },
    
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    
  };
});

export default useStyles;
