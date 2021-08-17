import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    tabTitle: {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '20px',
      lineHeight: '28px',
      color: '#FFFFFF',
      margin: 0,
      padding: 0,
      marginBottom: '20px',
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        height: '100%',
        left: '-32px',
        top: '-5px',
        border: '4px solid #72F34B',
      }
    },
    tabContent: {
      padding: '20px 32px',
      boxSizing: 'border-box',
      background: '#2E2E2E',
      borderRadius: '4px',
    },
    tabHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '5px',
      '& .filter': {
        display: 'flex',
        gap: '8px',
      },
      '& .search': {

      }
    },
    tabBody: {

    },

  };
});

export default useStyles;

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

export const useSearchBoxStyles = makeStyles((theme: any) => {
  return {
    div: {

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

export const useTableStyles = makeStyles((theme: any) => {
  return {
    wrapperTable: {
      border: '1px solid #44454B',
      borderBottom: 'none',
      borderRadius: '4px',
      boxSizing: 'border-box',

    },
    table: {
      border: 'none',
      position: 'relative',
      '& thead tr th': {
        padding: '14px 19px',
        background: '#171717',
        border: 'none',
      }
    },
    textGreen: {
      color: '#72F34B',
    },
    textRed: {
      color: '#F24B4B'
    },
    groupBtn: {
      display: 'flex',
      gap: '6px',
    },
    btnAction: {
      fontFamily: 'Firs Neue',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '12px',
      lineHeight: '20px',
      textTransform: 'unset',
      '&:hover': {
        border: 'unset',
        background: 'unset',
      }
    },
    btnDetail: {
      border: '1px solid #72F34B',
      color: '#72F34B',
      '&:hover': {
        border: '1px solid #72F34B',
      }

    },
    btnView: {
      border: '1px solid #72F34B',
      background: '#72F34B',
      color: '#000000',
      '&:hover': {
        background: '#72F34B',
        color: '#000000',
        border: '1px solid #72F34B',
      }
    },

  };
});

export const useCardStyles = makeStyles((theme: any) => {
  return {
    tabCardTitle: {
      display: 'flex',
      gap: '10px',
      '& .text': {
        '& h2, & h6': {
          margin: 0,
          padding: 0,
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',

        },
        '& h2': {
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '28px',
          color: '#FFFFFF',
        },
        '& h6': {
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '16px',
          color: '#AEAEAE'
        }
      }
    },
    cards: {
      display: 'grid',
      gap: '8px',
      gridTemplateColumns: 'repeat(auto-fit, 166px)',


    },
    card: {
      padding: '10px',
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '5px',
      position: 'relative',
      background: '#171717',
      boxSizing: 'border-box',
      borderRadius: '4px',
      border: '1px solid #28481E',
      '&::before, &::after': {
        content: '""',
        height: '3px',
        width: '39px',
        position: 'absolute',
        background: '#458531',
        top: '3.6px',
      },
      '&::before': {
        left: '18px',
        transform: 'skew(-40deg)'
      },
      '&::after': {
        right: '18px',
        transform: 'skew( 40deg )'
      },

      '& .img-hidden, & .img-shown': {
        width: '146px',
        height: '215px',
        cursor: 'pointer',
      },

      '& .img-hidden': {
        position: 'relative',
        background: '#0A0A0A',
        '& .question': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      },
      '& .img-shown': {
        '& img': {
          width: '100%',
          height: '100%',
        }
      },
      '& .info': {
        paddingLeft: '4px',
        paddingRight: '4px',
        '& h4, & h5': {
          margin: 0,
          padding: 0,
          fontFamily: 'Firs Neue',
          fontStyle: 'normal',
          color: '#FFFFFF',
        },
        '& h4': {
          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '24px',
        },
        '& h5': {
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '20px',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',

          '& img': {
            width: '14px',
            height: '14px',
          }
        }
      }
    }

  };
});
