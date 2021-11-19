import { makeStyles } from '@material-ui/core';

export const useSelectBoxStyles = makeStyles((theme: any) => {
  return {
    formControl: {
      minWidth: 120,
      outline: 'none',
      '& > label': {
        transform: 'translate(14px, 10px) scale(1)',
        color: '#FFFFFF',
        fontSize: '14px',
        lineHeight: '22px',
      }
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    select: {
      height: '44px',
      minWidth: 120,
      cursor: 'pointer',
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '22px',
      color: '#FFFFFF',
      margin: 0,
      padding: '8px 12px',
      paddingRight: '30px',
      position: 'relative',
      background: '#171717',
      borderRadius: '4px',
      border: '1px solid #44454B',
      boxSizing: 'border-box',
      outline: 'none',
      '-moz-appearance': 'none', /* Firefox */
      ' -webkit-appearance': 'none', /* Safari and Chrome */
      appearance: 'none',
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: 'calc(100% - 12px)',
      backgroundPositionY: '50%',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg width='12' height='7' viewBox='0 0 12 7' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M5.99998 6.54545C5.78492 6.54545 5.56988 6.46688 5.40591 6.31006L0.24617 1.37271C-0.0820567 1.05863 -0.0820567 0.549412 0.24617 0.235462C0.574264 -0.0784874 1.10632 -0.0784874 1.43458 0.235462L5.99998 4.6043L10.5654 0.235615C10.8936 -0.0783349 11.4256 -0.0783349 11.7537 0.235615C12.0821 0.549564 12.0821 1.05879 11.7537 1.37286L6.59405 6.31021C6.43 6.46706 6.21497 6.54545 5.99998 6.54545Z' fill='white'/></svg>")`,
      
      '& svg': {
        // display: 'none',
        opacity: 0,
      },
      '& fieldset': {
        borderColor: '#44454B !important',
        borderWidth: '1px !important',
        border: '1px solid #44454B',
        '& legend': {
          color: '#FFFFFF !important',
        }
      }
    },

  };
});
