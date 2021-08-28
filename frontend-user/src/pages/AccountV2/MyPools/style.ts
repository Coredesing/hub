import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    pageMyPools: {
      background: '#303035',
      borderRadius: '12px',
      padding: '20px 32px',

      [theme.breakpoints.down('sm')]: {
        padding: '20px 20px',
      },
    },

    title: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 16,
      lineHeight: '24px',
      textTransform: 'uppercase',
      color: '#FFFFFF',
      marginBottom: 20,

      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        fontWeight: 500,
        marginBottom: 12,
      },
    },

    des: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#AEAEAE',
    },

    listDes: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#AEAEAE',
      listStyle: 'disc',
      paddingLeft: 25,
      marginBottom: 30,

      [theme.breakpoints.down('sm')]: {
        marginBottom: 20,
      },
    },

    headTable: {
      marginBottom: 9,
      ...typeDisplayFlex,
      justifyContent: 'space-between',

      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
      },
    },

    leftFillter: {

      [theme.breakpoints.down('sm')]: {
        marginBottom: 8,
        ...typeDisplayFlex,
        justifyContent: 'space-between',
      },
    },

    formControlSelect: {
      maxWidth: '100%',
      background: '#222228',
      border: '1px solid #44454B',
      borderRadius: 4,
      marginRight: 8,

      [theme.breakpoints.down('sm')]: {
        marginRight: 0,
      },
    },

    selectBox: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      height: 36,
      width: 160,

      '&::before, &::after': {
        display: 'none',
      },

      '& select': {
        paddingLeft: 12,
        paddingTop: 0,
        paddingBottom: 0,
        height: 22,
      },

      '& .MuiSelect-select option': {
        backgroundColor: '#222228',
      },

      '& .MuiSelect-icon': {
        color: '#FFFFFF',
        fontSize: 20,
        top: 'calc(50% - 10px)',
        right: 4,
      }
    },

    selectBoxType: {
      width: 120,
    },

    groupSearch: {
      width: '100%',
      maxWidth: 320,
      background: '#222228',
      border: '1px solid #44454B',
      borderRadius: 4,
      ...typeDisplayFlex,

      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',

        '& button': {
          minWidth: 40,
        }
      },

      '& input': {
        height: 36,
        width: '100%',
        border: 'none',
        outline: 'none',
        padding: 12,
        background: 'transparent',
        fontFamily: 'Helvetica',
        fontSize: 14,
        lineHeight: '20px',
        color: '#AEAEAE',
      }
    },

    tableContainer: {
      background: '#191920',
      boxShadow: 'none',
    },

    tableCellHead: {
      whiteSpace: 'nowrap',
      height: 48,
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFFFFF',
      background: '#191920',
      borderBottom: 'none',
    },

    tableRow: {
      background: '#222228',
    },

    tableCellBody: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',
      borderBottom: '1px solid #37373D',
      verticalAlign: 'middle',

      '& .status_pool': {
        whiteSpace: 'nowrap',
      },
      '& .canceled-whitelist': {
        color: '#D01F36',
      },
      '& .applied-whitelist': {
        color: '#9E63FF',
      },
      '& .win-whitelist': {
        color: '#FF9330',
      },
      '& .not-win-whitelist': {
        color: '#7E7E7E',
      },
      '& .swapping': {
        color: '#72F34B',
      },
      '& .filled': {
        color: '#FFD058',
      },
      '& .claimable': {
        color: '#FFD058',
      },
      '& .completed': {
        color: '#7E7E7E',
      },
      '& .none': {
        color: '#FFFFFF',
      },
    },

    nameToken: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      color: '#FFFFFF',
    },

    toDetailPool: {
      color: '#FFFFFF',

      '&:hover': {
        opacity: 0.85
      }
    },

    iconToken:{
      position: 'relative',
      top: 7,
      marginRight: 6,
      width: 24,
      height: 24,
      borderRadius: '50%',
    },

    datasMobile: {
      padding: '0 20px',
      background: '#222228',
      borderRadius: 8,
    },

    boxDataMobile: {
      padding: '20px 0',
      borderBottom: '1px solid rgb(255 255 255 / 10%)',
    },

    titleBoxMobile: {
      ...typeDisplayFlex,
      alignItems: 'center',
      marginBottom: 16,
    },

    iconTokenMobile: {
      width: 36,
      height: 36,
      marginRight: 8,
      borderRadius: '50%',
    },

    nameTokenMobile: {
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      color: '#FFFFFF',
    },

    infoMobile: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridRowGap: 18,
    },

    nameMobile: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#AEAEAE',
      marginBottom: 5,
    },

    valueMobile: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      ...typeDisplayFlex,
      alignItems: 'center',
      color: '#FFFFFF',
    },

    pagination: {
      '& *': {
        color: 'white'
      }
    },

    btnAction: {
      background: '#ebebeb',
      borderRadius: 36,
      minWidth: 140,
      height: 28,
      border: 'none',
      boxShadow: 'none',
      outline: 'none',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      textAlign: 'center',
      color: '#090B1C',
      textTransform: 'inherit',

      '&.btnCancelWhitelist': {
        background: '#D01F36',
        color: '#FFFFFF',
        cursor: 'pointer',
      },

      '&.btnPreOrder': {
        background: '#FF9330',
        color: '#090B1C',
        cursor: 'pointer',
      },

      '&.btnClaimToken': {
        background: '#FFD058',
        color: '#090B1C',
        cursor: 'pointer',
      },

      '&:disabled': {
        opacity: 0.5,
      }
    },

    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },

  };
});

export default useStyles;
