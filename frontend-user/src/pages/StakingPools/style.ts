import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    wrapper: {
      backgroundImage: 'url(/images/bg_layout.svg)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% auto',
      backgroundPosition: '0px 80px',
      display: 'flex',
      // flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      // alignContent: 'center',
      minHeight: 'calc(100vh - 145px)',
      color: '#FFF',
      fontFamily: 'DM Sans',
      position: 'relative',
      paddingTop: 90,

      '& .content': {
        width: '1120px',
        [theme.breakpoints.down('xs')]: {
          // padding: '20px 24px',
          width: '90%'
        }
      },
      '& .controller-area': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        [theme.breakpoints.down('xs')]: {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
        // justifyContent: 'space-between',
        
        marginBottom: '20px',


        '& .controller-area__right': {
          display: 'flex',
          flexDirection: 'row',
          maxWidth: '100%',
          marginLeft: 'auto',
          // '& :not(:first-child)': {
          //   marginLeft: '20px',
          //   [theme.breakpoints.down('xs')]: {
          //     marginLeft: '15px',
          //   },
          // },
        },

        '& .controller-area__search': {
          position: 'relative',
          width: '180px',
          maxWidth: '100%',
          height: '42px',
    
          '& input': {
            background: '#222228',
            border: '1px solid #44454B',
            boxSizing: 'border-box',
            borderRadius: '4px',
            outline: 'none',
            color: '#fff',
            width: '100%',
            height: '42px',
            padding: '10px 30px 10px 10px'
          },
          '& input:placeholder': {
            font: 'normal normal normal 14px/24px Helvetica',
            color: 'rgba(153, 153, 153, 0.5)'
          },
          '& img': {
            position: 'absolute',
            right: '12px',
            transform: 'translateY(-50%)',
            top: '50%',
          }
        },

        '& select': {
          textOverflow: 'ellipsis',
          maxWidth: '100%',
          backgroundColor: '#222228',
          width: '220px',
          height: '42px',
          border: '1px solid #44454B',
          outline: 'none',
          borderRadius: '4px',
          color: '#FFF',
          padding: '0 12px',
          position: 'relative',
        },

        '& .form-control-label': {
          [theme.breakpoints.down('xs')]: {
            maxWidth: '47.5%',
          },
          '&:not(:first-child)': {
            marginLeft: '20px',
            [theme.breakpoints.down('xs')]: {
              marginLeft: '15px',
            },
          },
          display: 'flex',
          flexDirection: 'column',
          '& span': {
            fontWeight: 700,
            color: '#FFFFFF',
            marginBottom: '8px'
          }
        }
      },

      '& .pool-area': {
        width: '1120px',
        background: '#222228',
        padding: '15px 21px',
        borderRadius: '24px',
        [theme.breakpoints.down('xs')]: {
          padding: '10px 0px',
          borderRadius: '12px',
          width: '100%'
        }
      },


      message: {
        color: 'white',
        fontSize: 14,
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '1040px',
        maxWidth: 'calc(100vw - 80px)',
        transform: 'translateX(-50%)',
        padding: '12px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#591425',
        marginBottom: 15,
        borderRadius: '8px',
      },



      // legacy
      '& .modal-content': {
        width: '1120px',
        background: '#38383F',
        borderRadius: '12px',
        padding: '48px 56px',
        [theme.breakpoints.down('xs')]: {
          padding: '20px 24px',
          width: '90%'
        }
      },
      '& .modal-content__body': {
        padding: 0,
        marginTop: '30px',
        marginBottom: '20px',
        '& select': {
          backgroundColor: '#222228',
          width: '100%',
          height: '46px',
          border: '1px solid #44454B',
          outline: 'none',
          borderRadius: '4px',
          color: '#FFF',
          padding: '0 12px',
          position: 'relative',
        },
      },

      '& .modal-content .title': {
        fontFamily: 'DM Sans',
        fontSize: '28px',
        lineHeight: '32px',
        fontWeight: 'bold',
        marginBottom: '8px',
        textAlign: 'center',

        '& span': {
          color: '#6398FF'
        }
      },

      '& .modal-content__foot': {
        marginTop: '36px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '16px',

        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'stretch'
        },

        '& .btn': {
          padding: '12px',
          flex: '0 0 49%',
          borderRadius: '60px',
          color: 'white',
          font: 'normal normal bold 14px/18px DM Sans',
          background: '#727272',
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          [theme.breakpoints.down('sm')]: {
            margin: '4px !important'
          },

          '&:first-child': {
            background: '#3232DC'
          },

          '&.disabled': {
            opacity: '0.42',
            cursor: 'no-drop',
            pointerEvents: 'none'
          },

          '& p': {
            padding: 0,

            '& span': {
              margin: 0
            }
          }
        }
      }
    },
    description: {
      font: 'normal normal normal 14px/18px DM Sans',
      color: '#FFF',
      textAlign: 'center',
      marginTop: '16px',
      marginBottom: '32px'
    },

    loader: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loaderText: {
      fontWeight: 700,
      marginTop: 20,
      color: "#999999",
      font: 'normal normal bold 14px/18px DM Sans'
    },

    group: {
      marginTop: '16px',

      '& .input-group': {
        background: '#222228',
        border: '1px solid #44454B',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
      },

      '& input': {
        color: '#fff',
        background: '#222228',
        border: 'none',
        outline: 'none',
        padding: '6px 8px',
        flex: 1,
        fontSize: '16px',
        lineHeight: '24px'
      },
      '& button#btn-max-deposit': {
        font: 'normal normal bold 12px/14px DM Sans',
        color: '#FFF',
        backgroundColor: '#6398FF',
        borderRadius: '4px',
        width: 'auto',
        padding: '4px 10px',
        marginRight: '6px',
        cursor: 'pointer'
      },
      '& .balance': {
        color: '#FFF',
        font: 'normal normal 500 16px/24px DM Sans',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '4px',

        [theme.breakpoints.down('sm')]: {
          textAlign: 'left',
          flexDirection: 'column'
        },

        '& span:last-child': {
          fontWeight: 'bold',
          fontSize: '20px',
          lineHeight: '24px',
          color: '#6398FF',

          [theme.breakpoints.down('sm')]: {
            marginTop: 4
          },
        }
      },
      '& .subtitle': {
        color: '#FFF !important',
        font: 'normal normal 500 16px/24px DM Sans !important',
        margin: '19px 4px 6px'
      }
    },
    stages: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',

      '& .stage': {
        flex: '0 0 49%',
        padding: '6px',
        textAlign: 'center',
        borderBottom: '2px solid #C4C4C4',
        color: 'white',
        fontFamily: 'DM Sans',
        fontWeight: 500,
        fontSize: '16px',
        lineHeight: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        '& img': {
          marginRight: '8px'
        }
      },

      '& .stage.active': {
        color: '#6398FF',
        borderBottomColor: '#6398FF'
      }
    },
    message: {
      color: 'white',
      fontSize: 14,
      position: 'absolute',
      top: 0,
      left: '50%',
      width: '1120px',
      // maxWidth: 'calc(100vw - 80px)',
      transform: 'translateX(-50%)',
      padding: '12px 10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#591425',
      marginBottom: 15,
      borderRadius: '8px',
      [theme.breakpoints.down('xs')]: {
        borderRadius: '12px',
        width: '90%'
      }
    },
    messageDuration: {
      color: 'white',
      fontSize: 14,
      width: '100%',
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      background: '#591425',
      marginBottom: 15,
      borderRadius: '8px',
    }
  };
});

export const useSwitchStyle = makeStyles((theme) => {
  return {
    root: {
      width: 38,
      height: 21,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 2,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#3232DC',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#3232DC',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 18,
      height: 18,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid #5F5F62`,
      backgroundColor: '#5F5F62',
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }
});

export default useStyles;
