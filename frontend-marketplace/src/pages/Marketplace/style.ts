import { makeStyles } from "@material-ui/styles";
import { typeDisplayFlex } from "@styles/CommonStyle";

const useStyles = makeStyles((theme: any) => ({
    page: {

        [theme.breakpoints.down('xs')]: {
            padding: '28px 32px',
        },
        '& .content-page': {
            width: '100%',
            maxWidth: '1240px',
            margin: 'auto',
            padding: '28px 0px',
        }
    },
    banner: {
        minHeight: '608px',
        background: '#000',
        position: 'relative',
        boxSizing: 'border-box',
        '& .btn-arrow': {
            position: 'absolute',
            top: '50%',
            width: '32px',
            height: '32px',
            outline: 'none',
            border: 'none',
            backdropFilter: 'blur(80px)',
            borderRadius: '50%',
            transform: 'matrix(-1, 0, 0, 1, 0, 0)',

            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.3)',
            transition: '.3s',
            '&:hover': {
                background: '#fff',
            }
        },
        '& .btn-prev': {
            left: '80px',
            transform: 'translate(0, -50%)'
        },
        '& .btn-next': {
            right: '80px',
            transform: 'translate(0, -50%)'
        },
        '& .desc': {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            '& .img-banner': {
                width: '100%',
                height: '100%',
                '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }
            },
            '& .infor': {
                position: 'absolute',
                bottom: '60px',
                left: '112px',
                width: '360px',
                padding: '24px',
                borderRadius: '2px',
                background: 'rgba(174, 174, 174, 0.3)',
                '& h3': {
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '18px',
                    fontFamily: 'Firs Neue',
                    lineHeight: '23px',
                    color: '#fff',
                    marginBottom: '6px',
                },
                '& p': {
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '12px',
                    fontFamily: 'Helvetica',
                    lineHeight: '20px',
                    color: '#fff'
                }
            }
        }
    },
    header: {
        marginBottom: '12px',
        '& .title': {
            marginBottom: '22px',
            '& h3': {
                fontFamily: 'Firs Neue',
                fontSize: '28px',
                lineHeight: '36px',
                fontStyle: 'normal',
                fontWeight: 'bold',
                color: '#fff',
            }
        },
        '& .filter': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            justifyContent: 'space-between',
            '& .item': {
                ...typeDisplayFlex,
                flexWrap: 'wrap',
                gap: '10px',
                '& .switch': {
                },
                '& .input-search': {
                    maxWidth: '280px',
                    width: '100%',
                }
            },
            '& .item:nth-child(even)': {
                justifyContent: 'flex-end',
            }
        }
    },
    content: {

    },
    section: {
        marginBottom: '80px',
        '&:last-child': {
            marginBottom: 'unset',
        },
        '& .header': {
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gap: '20px',
            justifyContent: 'space-between',
            '& h3': {
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '28px',
                fontFamily: 'Firs Neue',
                lineHeight: '36px',
                color: '#fff',
                marginBottom: '32px',
            },
            '& .filter': {
                display: 'flex',
                gap: '8px',
            },
            '& .slide-actions': {
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'auto auto',

                '& button': {
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    outline: 'none',
                    border: '1px solid #686868',
                    background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
                    display: 'grid',
                    placeItems: 'center',
                }
            }
        }
    },
    hostCollections: {
        display: 'flex',
        gap: '20px',
        overflow: 'auto',
        paddingBottom: '10px',
        '& .collection': {
            width: '295px',
            minWidth: '295px',
            padding: '11px',
            background: ' radial-gradient(102.65% 160.75% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(70, 144, 213, 0) 100%)',
            borderRadius: '4px',
            backgroundBlendMode: 'overlay, normal',
            filter: 'drop-shadow(2px 16px 19px rgba(0, 0, 0, 0.09))',
            border: '1px solid #686868',
            backdropFilter: 'blur(80px)',
            '& .img': {
                position: 'relative',
                width: '100%',
                height: '100px',
                background: '#000',
                marginBottom: '31px',
                '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                },
                '& .icon': {
                    position: 'absolute',
                    bottom: '-21px',
                    left: '50%',
                    width: '42px',
                    height: '42px',
                    transform: 'translate(-50%)'
                }
            },
            '& .infor': {
                '& h3': {
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '18px',
                    fontFamily: 'Firs Neue',
                    lineHeight: '23px',
                    color: '#fff',
                    marginBottom: '6px',
                    textAlign: 'center',
                },
                '& p': {
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '12px',
                    fontFamily: 'Helvetica',
                    lineHeight: '20px',
                    color: '#fff',
                    textAlign: 'center',
                }
            }
        }
    },
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 295px)',
        gap: '20px',
        placeContent: 'center',
        transition: '.3s',
    },
    card: {
        padding: '20px',
        borderRadius: '4px',
        background: 'radial-gradient(102.65% 160.75% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(70, 144, 213, 0) 100%)',
        border: '1px solid #515151',
        transition: '.3s',
        cursor: 'pointer',
        position: 'relative',
        '&.active, &:hover': {
            border: '1px solid #72F34B',
        },
        '& .btn-buy': {
            borderRadius: '20px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '8px 10px',
            height: 'fit-content',
            minWidth: '150px',
            textTransform: 'unset',
            opacity: 0,
            transition: '.3s',
        },
        '&:hover .btn-buy': {
            opacity: 1,
        }
    },
    cardImg: {
        width: '255px',
        height: '250px',
        background: '#000',
        marginBottom: '10px',
        padding: '10px',
        display: 'grid',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '15px',
        '& img': {
            width: '100%',
            height: '100%',
        },
    },
    cardBody: {
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        '& h3': {
            fontFamily: 'Firs Neue',
            fontSize: '20px',
            lineHeight: '28px',
            fontStyle: 'normal',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '6px',
        },
        '& .network': {
            ...typeDisplayFlex,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '7px',
            '& .exchange-rate': {
                ...typeDisplayFlex,
                alignItems: 'center',
                gap: '3px',
                '& .current': {
                    fontFamily: 'Firs Neue',
                    fontSize: '14px',
                    lineHeight: '24px',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    color: '#72F34B',
                },
                '& .seperate, & .usd': {
                    fontFamily: 'Firs Neue',
                    fontSize: '10px',
                    lineHeight: '12px',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    color: '#FFFFFF',
                }
            },
            '& .icon': {
                '& img': {
                    width: '18px',
                    height: '18px',
                }
            }
        },
        '& .tags': {
            ...typeDisplayFlex,
            flexWrap: 'wrap',
            gap: '6px',
            '& span': {
                display: 'block',
                padding: '2px 8px',
                fontFamily: 'Firs Neue',
                fontSize: '14px',
                lineHeight: '24px',
                fontStyle: 'normal',
                fontWeight: 'normal',
                color: '#FFFFFF',
                background: '#2E2E2E',
                borderRadius: '4px',
            }
        }
    },
    cardFooter: {
        paddingTop: '16px',
        ...typeDisplayFlex,
        justifyContent: 'space-between',
        alignItems: 'center',
        '& .logo': {
            ...typeDisplayFlex,
            alignItems: 'center',
            '& img': {
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                marginRight: '4px',
            },
            '& span': {
                fontFamily: 'Firs Neue',
                fontSize: '12px',
                lineHeight: '16px',
                fontStyle: 'normal',
                fontWeight: 'normal',
                color: '#FFFFFF',
            }
        },
        '& .interactions': {
            ...typeDisplayFlex,
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            '& .item': {
                '& svg': {
                    marginRight: '6px',
                },
                '& span': {
                    fontFamily: 'Firs Neue',
                    fontSize: '12px',
                    lineHeight: '14px',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    color: '#FFFFFF',
                }
            }
        }
    },
    btnFilter: {
        ...typeDisplayFlex,
        fontFamily: 'Firs Neue',
        fontSize: '14px',
        lineHeight: '24px',
        fontStyle: 'normal',
        fontWeight: 600,
        color: '#fff',
        textTransform: 'unset',
        background: '#2E2E2E',
        borderRadius: '4px',
        padding: '6px 14px',
        '& svg': {
            marginRight: '6px',
        },
        '&:hover': {
            background: '#2E2E2E',
        }
    },
    labelSwitch: {
        fontFamily: 'Firs Neue',
        fontSize: '14px',
        lineHeight: '24px',
        fontStyle: 'normal',
        fontWeight: 600,
        color: '#fff',
    },
    bgSwitch: {
        opacity: 'unset !important',
        background: '#5F5F62 !important',
        '&.checked': {
            background: '#72F34B !important'
        }
    },
    colorSwitch: {
        color: '#FFFFFF !important'
    }
}));

export default useStyles;
