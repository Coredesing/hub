import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    contact: {
      background: '#72F34B',
      padding: '0px calc((100% - 800px) / 2)',
      paddingTop: '80px',
      paddingBottom: '52px',
      position: 'relative',
      '& h3': {
        fontFamily: 'Space Ranger',
        color: '#0A0A0A',
        fontSize: '72px',
        lineHeight: '60px',
        fontWeight: 'bold',
        letterSpacing: '0.02em',
        textAlign: 'center',
        marginBottom: '28px',
        position: 'relative',
      },

      '& .rectangle': {
        top: '50px',
        left: 0
      }
    },
    contactForm: {
      textAlign: 'center',
      marginBottom: '16px',
      [theme.breakpoints.down('xs')]: {
        paddingLeft: '32px',
        paddingRight: '32px',
        '& form': {
          display: 'grid',
          gap: '5px'
        }
      },
    },
    inputForm: {
      background: '#fff',
      color: '#0A0A0A',
      fontStyle: 'normal',
      fontFamily: 'Firs Neue',
      fontSize: '18px',
      fontWeight: 'normal',
      lineHeight: '28px',
      mixBlendMode: 'normal',
      height: '56px',
      width: '380px',
      borderRight: 'unset',
      borderTopRightRadius: 'unset',
      borderBottomRightRadius: 'unset',
      '& > div': {
        borderRadius: 'unset',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    btnForm: {
      background: '#0A0A0A',
      color: '#72F34B',
      height: '56px',
      width: '180px',
      borderTopLeftRadius: 'unset',
      borderBottomLeftRadius: 'unset',
      borderLeft: 'unset',
      borderRadius: 'unset',
      '&:hover': {
        background: '#0A0A0A',
        color: '#72F34B',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    alertMsg: {
      width: '100%',
      marginTop: '14px',
      '& img, & svg': {
        width: '14px',
        height: '14px',
        marginRight: '8px'
      },
      '& span': {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 600,
        fontSize: '18px',
        lineHeight: '28px',
        textAlign: 'left',
      },
      '&.error span': {
        color: '#F24B4B',
      },
      '&.success span': {
        color: '#0A0A0A',
      }
    }
  };
});

export default useStyles
