import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => {
  return {
    boxCard: {

      [theme.breakpoints.down('sm')]: {
        display: 'block',
        width: '100%',
        marginBottom: 20,
      },
    },
    card: {
      borderRadius: 28,
      overflow: 'hidden',
      height: '100%',
      background: '#222228',
    },
    
    cardHeader: {
      position: 'relative',

      '& > img': {
        width: '100%',
        maxHeight: 187,
        height: 187,
        objectFit: 'cover',

        [theme.breakpoints.down('sm')]: {
          height: 180,
        },
      },

      '& .time': {
        background: '#030925',
        borderRadius: '40px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '12px',
        lineHeight: '14px',
        color: '#FFFFFF',
        padding: '6px 15px',
        height: 34,
        marginLeft: 12,
        '&.tba': {
          backgroundColor: '#9E63FF'
        },
        '&.upcoming': {
          backgroundColor: '#6398FF'
        },
        '&.joining': {
          backgroundColor: '#12A064'
        },
        '&.in-progress': {
          backgroundColor: '#FFDE30'
        },
        '&.filled': {
          backgroundColor: '#ff1493',
          color: '#fff'
        },
        '&.ended': {
          backgroundColor: '#D01F36',
          color: '#fff',
        },
        '&.closed': {
          backgroundColor: '#D01F36',
          color: '#fff'
        },
        '&.claimable': {
          backgroundColor: '#FF9330'
        },
        '&.none': {
          backgroundColor: '#FF9330',
          color: '#fff'
        },
      }
    },

    cardBodyHead: {
      display: 'Grid',
      placeContent: 'center',
      gridTemplateColumns: 'calc(100% - 24px - 5px) 24px',
      gap: 5,
    },

    network: {
      '& img': {
        width: 24,
        height: 24,
        borderRadius: '50%',
      }
    },

    btnApplied: {
      marginTop: 20,
      height: 42,
      width: '100%',
      border: 0,
      borderRadius: 60,
      background: '#38383D',
      cursor: 'pointer',
      fontFamily: 'Helvetica',
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',
      color: '#D6D6D6',
      display: 'flex',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      transition: '0.3s',

      '& img': {
        marginRight: 10,
        height: 20,
      },

      '&:hover': {
        background: '#38383D',
        opacity: 0.8,
        color: '#D6D6D6',
      },

      '& > div': {
        fontFamily: 'DM Sans',
        fontWeight: 'bold',
        fontSize: 18,
        lineHeight: '26px',
        color: '#FFFFFF',
        marginLeft: 6,
      }
    },

    listStatus: {
      position: 'absolute',
      padding: 12,
      width: '100%',
      top: 0,
      left: 0,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    poolStatusWarning: {
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: '24px',
      textAlign: 'center',
      color: '#3232DC',
      padding: '5px 15px',
      borderRadius: 10,
      background: '#FFFFFF',
      height: 34,
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
      textTransform: 'uppercase',
    },

    tooltip: {
      fontFamily: 'DM Sans',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: '24px',
      color: '#FFFFFF',
      padding: '5px 10px',
    },
    
    cardBody: {
      padding: 20,
      '& .card-content__title': {
        // display: 'Grid',
        // placeContent: 'center',
        // gridTemplateColumns: '50px calc(100% - 50px - 5px)',
        // marginBottom: 15,
        // gap: 5,

        '& img': {
          width: 50,
          height: 50,
          marginRight: 7,
          borderRadius: '50%',
        },

        '& > p': {
          fontFamily: 'DM Sans',
          fontWeight: 'bold',
          fontSize: 20,
          lineHeight: '24px',
          color: '#FFFFFF',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },

        '& > div': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%'
        },

        '& > div h3': {
          fontFamily: 'DM Sans',
          fontWeight: 'bold',
          fontSize: 24,
          lineHeight: '24px',
          color: '#FFFFFF',
          textAlign: 'left',
          marginBottom: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',

          [theme.breakpoints.down('md')]: {
            fontSize: 14,
            marginBottom: 5,
          },
        },

        '& > div p': {
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: 16,
          lineHeight: '20px',
          color: '#AEAEAE',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',

          [theme.breakpoints.down('md')]: {
            fontSize: 14,
          },
        }
      },

      '& .card-content__content': {
        display: 'flex',
        flexDirection: 'column',

        '& li': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '10px',

          '& span:first-child': {
            fontFamily: 'Helvetica',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize:  16,
            lineHeight: '24px',
            color: '#AEAEAE',
          },

          '& span:last-child': {
            fontFamily: 'DM Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: 18,
            lineHeight: '26px',
            color: '#FFFFFF',
            textAlign: 'right',
          },

          '& .total': {
            fontFamily: 'DM Sans',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize:  18,
            lineHeight: '24px',
            color: '#FFFFFF',
          },
        },
      },

      '& .token-area': {
        marginTop: '30px',
        display: 'flex',
      },
      '& .token-area > div': {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '5px 17px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '12px'
      },
      '& .token-area img': {
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        marginRight: '10px'
      },
      '& .token-area span': {
        fontFamily: 'Helvetica',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontSize: '12px',
        lineHeight: '18px',
        color: '#999999',
      },

      '& .progress-area': {
        marginTop: '30px',

        '& p': {
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#999999',
        },

        '& .progress': {
          display: 'block',
          width: '100%',
          height: '6px',
          background: '#C4C4C4',
          borderRadius: '20px',
          margin: '12px 0 8px 0',

          '& .current-progress': {
            height: '6px',
            background: '#12A064',
            borderRadius: '20px',
            display: 'block',
            transition: '2s',
            '&.inactive': {
              width: '0!important',
            }
          },
        },

        '& div': {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between'
        },

        '& div span': {
          fontFamily: 'Helvetica',
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#999999',
        },

        '& div div span:first-child': {
          fontFamily: 'DM Sans',
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '14px',
          lineHeight: '18px',
          color: '#FFFFFF',
        },
      }
    },
  };
});

export default useStyles;
