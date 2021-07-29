import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    sectionBuyTokenPoolDetails: {
      // background: '#303035',
      // borderRadius: 12,
      // padding: '28px 28px',
      // marginBottom: 12,
      // color: '#FFFFFF',
      // fontFamily: 'DM Sans',

      // [theme?.breakpoints?.down('sm')]: {
      //   padding: '28px 20px',
      // },
    },

    topSection: {
      display: 'flex',
      justifyContent: 'space-between',

      [theme?.breakpoints?.down('sm')]: {
        flexDirection: 'column',
        alignContent: 'center',
      },
    },

    title: {
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      marginBottom: 20,
      textTransform: 'uppercase',

      [theme?.breakpoints?.down('sm')]: {
        textAlign: 'center',
        marginBottom: 16,
      },
    },

    rightTopSection: {
      display: 'flex',
    },

    itemSocsial: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      marginRight: 10,

      '&:hover': {
        opacity: 0.8
      },
    },

    midSection: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },

    listContent: {
      width: '50%',
      paddingRight: 10,
      
      [theme?.breakpoints?.down('sm')]: {
        width: '100%',
        paddingRight: 0,
      },
    },

    itemListContent: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      marginBottom: 14,
      
      [theme?.breakpoints?.down('sm')]: {
        fontSize: 14,
        lineHeight: '20px',
        flexWrap: 'nowrap',
        alignItems: 'flex-start',
      },

      '& a': {
        color: '#FFFFFF',
        display: 'flex',
        flexWrap: 'wrap',
        wordBreak: 'break-word',
      }
    },

    iconBrank: {
      marginLeft: 5,
    },

    nameItemListContent: {
      minWidth: 140,
      marginRight: 12,
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',
      
      [theme?.breakpoints?.down('sm')]: {
        width: 130,
        minWidth: 130,
        fontSize: 14,
      },
    },

    titleBot: {
      lineHeight: '24px',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      color: '#AEAEAE',
      marginBottom: 6,
    },

    botSection: {
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
    },

    btnOpenModal: {
      color: '#6398FF',
      textDecoration: 'underline',
      cursor: 'pointer',
    },

    modalTiers: {

      '& .MuiDialog-paper': {
        width: 1200,
        maxWidth: '100%',
        background: '#38383F',
        borderRadius: '12px',
      }
    },

    headerModal: {
      padding: 40,
      paddingBottom: 0,
      position: 'relative',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 28,
      lineHeight: '32px',
      color: '#FFFFFF',

      [theme?.breakpoints?.down('sm')]: {
        fontSize: 20,
        lineHeight: '24px',
        alignContent: 'center',
        paddingTop: 36,
        paddingLeft: 20,
        paddingRight: 20,
      },
    },

    btnCloseModal: {
      position: 'absolute',
      top: 12,
      right: 12,
      cursor: 'pointer',

      '&:hover': {
        opacity: 0.8
      }
    },

    modalContentTiers: {
      maxWidth: '100%',
    },

    contentModal: {
      padding: 40,
      paddingTop: 0,

      [theme?.breakpoints?.down('sm')]: {
        padding: 20,
        maxHeight: 'calc(100vh - 150px)',
      },
    },

    table: {
      background: '#222228',
      border: '1px solid #37373D',
      borderRadius: 8,
      '& .MuiTableBody-root td': {
        font: 'normal normal normal 14px/24px Helvetica'
      }
    },

    iconTable: {
      position: 'relative',
      top: 5,
      marginLeft: 5,
      width: 20,
      height: 21,

      [theme?.breakpoints?.down('sm')]: {
        width: 15,
        height: 15,
      },
    },

    tableContainer: {
      maxWidth: '100%',
      width: '100%',
      background: 'transparent',
      color: '#999999',
      marginTop: 20,

      [theme.breakpoints.down('sm')]: {
        marginTop: 0,
      },

      '& th, & td': {
        borderTop: '1px solid #37373D',
        borderBottom: 0,
        fontFamily: 'Helvetica',
        fontSize: 16,
        lineHeight: '24px',
        color: '#FFFFFF',
        paddingLeft: 40,
      },

      '& .MuiTableCell-root': {
        borderTop: '1px solid #37373D',
        borderBottom: 0,
      }
    },
    
    tableHeaderWrapper: {
      backgroundColor: '#191920',
      borderRadius: '8px 8px 0px 0px',

      '& th': {
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: 16,
        lineHeight: '24px',
        color: '#FFFFFF',
      }
    },

    tableHeader: {
      color: 'white !important' as any,
      fontWeight: 700,
      fontSize: 15,
      '& > span': {
        display: 'inline-block',
      },
      [theme.breakpoints.down('xs')]: {
        '& > span': {
          // width: '120px',
          display: 'inline-block'
        }
      },
      [theme.breakpoints.down('md')]: {
        '& > span': {
          width: '120px',
        }
      },
    },
    
    boxTierMobile: {
      marginBottom: 20,
      borderBottom: '1px solid #44454B',

      "&:last-child":{
        borderBottom: 0,
      }
    },

    nameItemTierMobile: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',
      marginBottom: 8,
    },

    valueItemTierMobile: {
      fonFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
    },

    itemTierMobile: {
      marginBottom: 20,
    }
  };
});

export default useStyles;