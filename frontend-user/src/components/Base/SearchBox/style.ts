import { makeStyles } from '@material-ui/core';

export const useSearchBoxStyles = makeStyles((theme: any) => {
  return {
    div: {
      width: '100%',
    },
    form: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '8px 30px 8px 12px',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '22px',
      color: '#FFFFFF',
      margin: 0,
      position: 'relative',
      background: '#171717',
      borderRadius: '4px',
      border: '1px solid #44454B',
      boxSizing: 'border-box',
      outline: 'none',
      '&::-webkit-input-placeholder': { /* Edge */
        color: '#AEAEAE',
      },

      '&:-ms-input-placeholder': {
        color: '#AEAEAE',
      },

      '&::placeholder': {
        color: '#AEAEAE'
      }
    },
    img: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translate(0,-50%)',
    }
  };
});
