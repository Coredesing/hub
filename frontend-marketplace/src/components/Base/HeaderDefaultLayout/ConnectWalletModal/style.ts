import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../../styles/CommonStyle';

const useStyles = makeStyles((theme) => {
  return {
    dialog: {
      '& .MuiPaper-root': {
        background: '#1C1D36',
        padding: 40,
        maxWidth: 900
      }
    },
    dialogContentTypo: {
      color: 'white',
      marginTop: 40,
      font: 'normal normal bold 16px/24px DM Sans',
      '&:first-child': {
        marginTop: 0
      }
    },
    dialogContentBlock: {
      marginTop: 20,
    },
    dialogTitle: {
      background: 'transparent !important',
      '& .MuiTypography-h6': {
        font: 'normal normal bold 28px/32px DM Sans',
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255, 255, 255 ,0.1)',
      },

      '& .MuiSvgIcon-root': {
        fontSize: '1rem'
      }
    },
    dialogPrivacy: {
      ...typeDisplayFlex,
      alignItems: 'center'
    },
    dialogPrivacyText: {
        fontFamily: 'Helvetica',
        fontSize: 14,
        lineHeight: '24px',
        color: 'rgba(255, 255, 255 ,0.6)',
    },
    dialogPrivacyHighlight: {
      color: '#4767af',
      fontWeight: 'normal',

      '&:hover': {
        color: '#4767af',
        textDecoration: 'underline',
      }
    },
    dialogCheckbox: {
      padding: 0,
      marginRight: 8,

      '& .MuiSvgIcon-root': {
        fill: 'white'
      }
    },
    dialogNetworks: {
      display: 'flex'
    },
    [theme.breakpoints.down('xs')]: {
      dialog: {
        '& .MuiPaper-root': {
          background: '#020616',
          padding: '20px',
          margin: '20px',
          maxWidth: '100%',
          width: '100%',
        },
      },
      dialogContentBlock: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        '& .MuiPaper-root': {
          padding: '20px 0'
        }
      },
      dialogPrivacy: {
        ...typeDisplayFlex,
        alignItems: 'flex-start',
        gap: 0,
      }
    }
  };
});

export default useStyles;
