import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    cardCompletedSales: {
      overflow: 'hidden',
      height: '100%',
      background: '#222228',
      borderRadius: 24,
      padding: 20,
      marginBottom: 12,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, calc(33% - 6.5px))',
      gap: 15,

      [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '100%',
        padding: '24px 20px',
      },
    },

    leftCard: {
      gap: 12,
      display: 'grid',
      gridTemplateColumns: '68px calc(100% - 68px - 12px)',
    },

    introCard: {
      display: 'flex',
      flexDirection: 'column',
    },

    midCard: {

    },

    rightCard: {

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
      display: 'flex',
      flexDirection: 'column',
    },

    icon : {
      width: 68,
      height: 68,
      overflow: 'hidden',
      borderRadius: 12,
      marginRight: 12,

      [theme.breakpoints.down('md')]: {
        width: 68,
        height: 68,
      },
    },

    title: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: '24px',
      color: '#FFFFFF',
      marginTop: 10,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },

    name: {
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '20px',
      color: '#AEAEAE',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: 15,

      [theme.breakpoints.down('md')]: {
        fontSize: 14,
      },
    },

    cardActiveHeaderRight: {

    },

    listStatus: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },

    listInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10,
    },

    itemInfo: {
      display: 'flex',
      flexDirection: 'column',
    },

    nameInfo: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#AEAEAE',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: 12,
    },

    valueInfo: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 20,
      lineHeight: '24px',
      color: '#FFFFFF',
    },

    poolStatus: {
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: '16px',
      textAlign: 'center',
      color: '#FFD058',
      padding: '4px 10px',
      borderRadius: 4,
      height: 24,
      textTransform: 'uppercase',

      '&.tba': {
        color: '#9E63FF'
      },
      '&.up-comming': {
        color: '#6398FF'
      },
      '&.joining': {
        color: '#12A064'
      },
      '&.in-progress': {
        color: '#FFDE30'
      },
      '&.filled': {
        color: '#ff1493'
      },
      '&.ended': {
        color: '#D01F36',
      },
      '&.closed': {
        color: '#D01F36'
      },
      '&.claimable': {
        color: '#FFD058'
      },
      '&.none': {
        color: '#FF9330'
      },
      '&.time': {
        color: '#FF9330'
      },
    },

    poolStatusWarning: {
      marginRight: 8,
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 12,
      lineHeight: '16px',
      textAlign: 'center',
      color: '#FFFFFF',
      padding: '4px 12px',
      borderRadius: 4,
      background: '#38383D',
      height: 24,
      textTransform: 'uppercase',
    },

    progressArea: {
    },

    titleProgressArea: {
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: '20px',
      color: '#AEAEAE',

      [theme.breakpoints.down('md')]: {
        fontSize: 14,
      },
    },

    progress: {
      display: 'block',
      width: '100%',
      height: 4,
      background: '#44454B',
      borderRadius: 20,
      marginTop: 7,
      marginBottom: 7,
    },

    currentProgress: {
      height: 4,
      background: '#D01F36',
      boxShadow: '0px 4px 8px rgba(208, 31, 54, 0.4)',
      borderRadius: 20,
      display: 'block',
      transition: '2s',
      position: 'relative',

      '&.inactive': {
        width: '0 !important',
      }
    },

    progressInfo: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: '20px',
      color: '#FFFFFF',

      '& span': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

        '&:last-child': {
          fontFamily: 'Helvetica',
          fontWeight: 'normal',
          color: '#AEAEAE',
        }
      }
    },

    iconCoin: {
      width: 20,
      height: 20,
      borderRadius: '50%',
    },

    headProgressArea: {
      display: 'flex',
      justifyContent: 'space-between',
    },

    claimTime: {
      border: '2px solid #D01F36',
      borderRadius: 60,
      fontFamily: 'DM Sans',
      fontWeight: 'bold',
      fontSize: 18,
      lineHeight: '24px',
      textAlign: 'center',
      color: '#D01F36',
      height: 32,
      padding: '4px 13px',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      flexDirection: 'row',
      position: 'relative',
      marginTop: -10,

      '& img': {
        marginRight: 10,
        position: 'relative',
        top: -1,
      }
    },

    iconCurrentProgress: {
      top: -10,
      right: -5,
      position: 'absolute',
      width: 23,
    }
  };
});

export default useStyles;
