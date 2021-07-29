import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    cardActive: {
      overflow: 'hidden',
      height: '100%',
      background: '#222228',
      borderRadius: 32,
      boxShadow:' 0px 4px 20px rgba(0, 0, 0, 0.6)',
      display: 'grid',
      gridTemplateColumns: '387px 1fr',

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
      },
    },

    cardActiveBanner: {
      overflow: 'hidden',
      position: 'relative',

      '& img': {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
      },

      [theme.breakpoints.down('sm')]: {
        height: 180,
      },
    },

    cardActiveRight: {
      padding: 32,
      paddingBottom: 16,

      [theme.breakpoints.down('sm')]: {
        padding: 20,
        paddingBottom: 20,
      },
    },

    tooltip: {
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '24px',
      color: '#FFFFFF',
      padding: '5px 10px',
    },

    cardActiveHeader: {
      display: 'Grid',
      gap: 20,
      gridTemplateColumns: '150px auto',
      marginBottom: 20,

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '100px auto',
      },
    },

    cardActiveHeaderLeft: {
      marginBottom: 8,
      display: 'grid',
      gridTemplateColumns: '1fr 28px',
    },

    icon : {
      width: 110,
      height: 110,
      overflow: 'hidden',
      borderRadius: '50%',
      marginBottom: 18,

      [theme.breakpoints.down('md')]: {
        width: 70,
        height: 70,
      },
    },

    title: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 24,
      lineHeight: '28px',
      color: '#FFFFFF',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',

      [theme.breakpoints.down('sm')]: {
        fontSize: 20,
        lineHeight: '24px',
      },
    },

    name: {
      fontFamily: 'Helvetica',
      fontSize: 22,
      lineHeight: '20px',
      color: '#AEAEAE',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',

      [theme.breakpoints.down('md')]: {
        fontSize: 14,
      },
    },

    cardActiveHeaderRight: {

    },

    listStatus: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      position: 'absolute',
      top: 16,
      left: 16,
    },

    listInfo: {

    },

    itemInfo: {
      display: 'grid',
      placeContent: 'center',
      gridTemplateColumns: 'repeat(2, 1fr)',
      marginTop: 12,
      gap: 10,
    },

    nameInfo: {
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      color: '#AEAEAE',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    valueInfo: {
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 18,
      lineHeight: '26px',
      textAlign: 'right',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      justifyContent: 'flex-end',

      '&.is': {
        color: '#6398FF',
      }
    },

    poolStatus: {
      marginLeft: 12,
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',
      color: '#FFFFFF',
      padding: '5px 17px',
      border: '1px solid #44454B',
      borderRadius: 12,
      height: 34,

      [theme.breakpoints.down('md')]: {
        fontSize: 14,
      },

      '&:first-child': {
        marginLeft: 0,
      },

      '&.joining':{
        background: '#956AF6',
      },

      '&.filled': {
        backgroundColor: 'deeppink'
      },

      '&.in-progress': {
        backgroundColor: '#FFDE30'
      },

      '&.ended': {
        backgroundColor: '#D01F36'
      },

      '&.claimable': {
        backgroundColor: '#FF9330'
      },

      '&.upcoming': {
        backgroundColor: '#6398FF'
      },

      '&.tba': {
        backgroundColor: '#9E63FF'
      }
    },

    poolStatusWarning: {
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',
      color: '#3232DC',
      padding: '5px 17px',
      borderRadius: 10,
      background: '#FFFFFF',
      height: 34,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
      textTransform: 'uppercase',
    },

    progressArea: {
      marginTop: 12,
    },

    progressAreaHeader: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    titleProgressArea: {
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      color: '#AEAEAE',

      [theme.breakpoints.down('md')]: {
        fontSize: 14,
      },
    },

    progress: {
      display: 'block',
      width: '100%',
      height: 8,
      background: '#44454B',
      borderRadius: 20,
      marginTop: 17,
      marginBottom: 9,
    },

    iconCurrentProgress: {
      position: 'absolute',
      top: -14,
      right: -14,
    },

    currentProgress: {
      position: 'relative',
      height: 8,
      background: '#D01F36',
      borderRadius: 20,
      display: 'block',
      transition: '2s',
      boxShadow: '0px 4px 8px rgba(208, 31, 54, 0.4)',

      '&.inactive': {
        width: '0 !important',
      }
    },

    progressInfo: {
      display: 'flex',
      flexDirection: 'row',
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      color: '#AEAEAE',
      alignItems: 'center',

      '& span': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

        '&:first-child': {
          marginRight: 4,
          color: '#FFFFFF',
          fontSize: 14,
          fontFamily: 'DM Sans',
          fontWeight: 'Bold',
          marginTop: -3,
        }
      }
    },

    btnSwapNow: {
      width: '100%',
      height: 42,
      background: '#3232DC',
      borderRadius: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 24,
      color: '#FFFFFF',
      overflow: 'hidden',

      '&:hover': {
        color: '#FFFFFF',
        opacity: 0.8
      },

      '& img': {
        width: 20,
        marginLeft: 8,
      }
    },

    btnDetail: {
      border: '2px solid #6398FF',
      color: '#6398FF',
      background: 'transparent',

      '&:hover': {
        color: '#6398FF',
        opacity: 0.8
      },
    },

    iconCoin: {
      width: 28,
      height: 28,
      borderRadius: '50%',

      [theme.breakpoints.down('sm')]: {
        width: 24,
        height: 24,
      },
    },

    groupBtnBottom: {
      display: 'grid',
      gap: 30,
      gridTemplateColumns: '1fr 1fr',
      marginTop: 25,

      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '1fr',
        gap: 12,
      },
    },

    endIn: {
      display: 'flex',
      width: '100%',
      background: '#38383D',
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      height: 42,
    },

    endInText: {
      fontSize: 16,
      lineHeight: '24px',
      color: '#AEAEAE',
      marginRight: 6,
    },

    endInTextClaimable: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '18px',
      color: '#FFD058',
      textTransform: 'uppercase',
    },

    endInCountdown: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: '26px',
      color: '#FFFFFF',
    },
  };
});

export default useStyles;
