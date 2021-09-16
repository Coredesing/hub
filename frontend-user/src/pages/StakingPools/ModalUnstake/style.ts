import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    modalStake: {
      '& .MuiPaper-root': {
        [theme.breakpoints.down('xs')]: {
          margin: '10px'
        },
      },
      '& .modal-content': {
        backgroundColor: '#38383F',
        width: '380px',
        padding: '40px 40px 20px',
        [theme.breakpoints.down('xs')]: {
          padding: '40px 20px 20px',
        },
        borderRadius: '12px',
        color: '#FFFFFF'
      },
      '& .modal-content__head .title': {
        margin: '0 auto',
        fontSize: '24px',
        fontWeight: 700
      },
      '& .modal-content__body': {
        padding: '0',
        margin: '20px 0',
        overflowX: 'hidden',

        '& .token-type': {
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '16px',
          fontWeight: 500,
          alignItems: 'center',
          marginBottom: '14px',
        },
        '& .token-detail': {
          display: 'flex',
          alignItems: 'center'
        },
        '& .token-logo': {
          width: '22px',
          height: '22px',
          borderRadius: '28px',
          margin: '0 5px',
        },

        '& .input-group': {
          background: '#222228',
          padding: '0 10px',
          borderRadius: '4px'
        },
        '& .input-group input': {
          cursor: 'default',
          padding: '0'
        },
        '& .token-balance': {
          color: '#AEAEAE',
          marginTop: '5px'
        },
        '& .subtitle': {
          marginBottom: '5px',
          fontWeight: 700,
          color: '#FFFFFF'
        }
      },
      '& .modal-content__foot': {
        borderTop: '1px solid #727272',
        padding: '16px 0px 0px'
      },
    },
    notice: {
      font: 'normal normal bold 14px/18px DM Sans',
      color: '#FFF',
      marginTop: '30px'
    },
    [theme.breakpoints.down('xs')]: {
      modalTransaction: {
        '& .modal-content__body': {
          padding: '0'
        }
      }
    }
  };
});

export default useStyles;
