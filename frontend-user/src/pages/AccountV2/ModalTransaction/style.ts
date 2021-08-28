import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => {
  return {
    modalTransaction: {
      '& .modal-content': {
        width: '600px',
      },
      '& .modal-content__body': {
        padding: '0',

        '& .input-group': {
          background: '#11152A',
          padding: '0 10px',
          borderRadius: '4px'
        },
        '& .input-group input': {
          cursor: 'default',
          padding: '0'
        },
        '& .subtitle span': {
          textIndent: '10px',
          marginBottom: '5px'
        }
      },
      '& .modal-content__foot a': {
        ...typeDisplayFlex,
        justifyContent: 'center',
        alignItems: 'center',
        background: '#72F34B',
        borderRadius: '60px',
        height: '42px',
        width: '100%',
        color: '#FFFFFF'
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
