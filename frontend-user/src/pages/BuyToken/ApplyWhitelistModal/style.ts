import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    dialog: {
      '& .MuiPaper-root': {
        background: '#020616',
        padding: 60,
        maxWidth: 540,
        width: 540,
        textAlign: 'center',

        [theme?.breakpoints?.down('sm')]: {
          padding: '30px 20px',
        },
      }
    },
    socialDialog :{
      '& .MuiPaper-root': {
        background: '#38383F',
        fontSize: '16px',
        padding: '30px 50px',
        borderRadius: '12px',
        [theme.breakpoints.down('md')]: {
          padding: '30px 20px',
        },
       
        '& .socialForm': {
          marginTop: '30px',
          '& > .row': {
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.up('md')]: {
              flexDirection: 'row',
              '& > * + *': {
                '--tw-space-x-reverse': 0,
                marginRight: 'calc(1rem * var(--tw-space-x-reverse))',
                marginLeft: 'calc(1rem * calc(1 - var(--tw-space-x-reverse)))',
              },
            },
          },

          '& .input-group': {
            display: 'block',
            width: '100%',
            marginTop: '.75rem',
  
            '& .label': {
              fontWeight: 400,
              margin: '1rem 0 .5rem'
            },
  
            '& input': {
              width: '100%',
              height: '42px',
              padding: '0 1rem',
              color: '#FFFFFF',
              background: '#222228',
              border: '1px solid #44454B',
              boxSizing: 'border-box',
              borderRadius: '4px',
            },

            '& input[type="text"]:disabled': {
              color: '#AEAEAE'
            },
          },
        }
      },
      '& .MuiDialogContent-root': {
        overflow: 'visible',
        [theme.breakpoints.up('md')]: {
          marginLeft: '1rem',
        },
        [theme.breakpoints.down('md')]: {
          padding: '0',
        },
        marginBottom: '40px'
      },

      '& .MuiDialogActions-root': {
        paddingTop: '20px',
        marginTop: '0',
        borderTop: '1px solid #44454B',

        [theme.breakpoints.down('md')]: {
          '& button': {
            width: '100%'
          }
        },
      },

      [theme.breakpoints.down('md')]: {
        '& .MuiPaper-root': {
          margin: '10px'
        },
        
        '& .MuiDialog-paperFullWidth': {
          width: 'calc(100% - 24px)'
        }
      }
    },
    socialStep: {
      display: 'flex', 
      [theme.breakpoints.up('md')]: {
        alignItems:'center', 
      },
      marginTop: '.75rem',
      position: 'relative',
    },
    socialStepNunber: {
      height: '1.5rem', 
      width: '1.5rem', 
      borderRadius: '50%', 
      backgroundColor: '#222228', 
      display: 'flex',
      position: 'absolute',
      left: '-2.5rem',
      [theme.breakpoints.down('md')]: {
        position: 'relative',
        left: '0',
        marginRight: '.5rem',
      },
      justifyContent: 'center', 
      alignItems:'center',
      fontSize: '.75rem',
      lineHeight: '.75rem',
      minWidth: '24px'
    },
    socialFollowTable: {
      [theme.breakpoints.up('sm')]: {
        tableLayout: 'fixed',
      },
      width: '100%',
      marginTop: '.5rem',
      marginBottom: '1rem',
      borderCollapse: 'collapse',
      backgroundColor: '#222228',
      borderRadius: '8px',
      overflow: 'hidden',

      '& thead': {
        backgroundColor: '#191920',
        textAlign: 'left',
      },
      '& th': {
        border: '1px solid #37373D',
        padding: '.7rem',
        [theme.breakpoints.up('md')]: {
          padding: '1rem',
        },
        
        '& span': {
          lineHeight: '24px',
          verticalAlign: 'top'
        }
      },
      '& td': {
        border: '1px solid #37373D',
        padding: '.7rem .5rem',
        [theme.breakpoints.up('md')]: {
          padding: '1rem',
        },

        '& svg': {
          marginLeft: '.3rem',

          [theme.breakpoints.up('sm')]: {
            marginLeft: 'auto',
          },
          verticalAlign: 'text-bottom'
        }
      },
      '& > tr > td + td' :{
        paddingLeft: '4rem'
      },
      '& .flex-cell': {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
          justifyContent:'flex-end'
        },
      }
    },
    socialAnchorlink :{
      color: 'rgb(99, 152, 255)',
      '&:hover': {
        textDecoration: 'underline',
        color: 'rgb(99, 152, 255)',
      }
    },
    iconToken: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      marginRight: 12,
    },
    dialogLabel: {
      font: 'normal normal normal 12px/18px Helvetica',
      textAlign: 'left'
    },
    dialogContentTypo: {
      color: 'white',
      fontSize: 16,
      marginTop: 40,
      fontWeight: 700,

      '&:first-child': {
        marginTop: 0
      }
    },
    dialogContentBlock: {
      marginTop: 20,
    },
    dialogTitle: {
      '& .MuiTypography-h6': {
        paddingBottom: 16,
        font: 'normal normal bold 18px/24px DM Sans'
      },

      '& .MuiSvgIcon-root': {
        fontSize: '1rem'
      }
    },
    dialogPrivacy: {
      display: 'flex',
      alignItems: 'center'
    },
    dialogPrivacyText: {
     fontSize: 16 
    },
    dialogPrivacyHighlight: {
      color: '#3C5EA2'
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
    dialogInput: {
      width: '100%',
      padding: '8px 15px',
      marginTop: 15,
      background: '#11152A',
      borderRadius: 4,
      border: 'none',
      color: 'white',
      font: 'normal normal normal 14px/24px Helvetica',

      '&:focus': {
        outline: 'none',
        color: 'white'
      }
    },
    dialogButton: {
      marginTop: 25,
      display: 'flex',
      width: '100%',
      background: '#3232DC',
      borderRadius: 60,
      padding: '0',
      color: 'white',
      border: 'none',
      font: 'normal normal bold 14px/18px DM Sans',
      cursor: 'pointer',
      transition: '.2s all ease-out',
      height: '42px',
      alignItems: 'center',
      justifyContent: 'center',

      '&:focus': {
        outline: 'none'
      },

      '&:hover': {
        opacity: .8,
        color: 'white'
      },

      '&:active': {
        transform: 'translateY(-3px)'
      },
    }
  };
});

export default useStyles;
