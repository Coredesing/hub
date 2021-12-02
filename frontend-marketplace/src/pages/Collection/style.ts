import { makeStyles } from "@material-ui/styles";
import { typeDisplayFlex } from "@styles/CommonStyle";

const useStyles = makeStyles((theme: any) => ({
    page: {

        '& .content-page': {
            padding: '28px 84px',
            [theme.breakpoints.down('xs')]: {
                padding: '28px 32px',
            },
            width: '100%',
            maxWidth: '1240px',
            margin: 'auto',
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
            [theme.breakpoints.down('xs')]: {
                gridTemplateColumns: '1fr',
            },
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
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 295px)',
        gap: '20px',
        // placeContent: 'center',
        transition: '.3s',
    },
    card: {
        padding: '20px',
        borderRadius: '20px',
        background: 'linear-gradient(180deg, rgba(81, 81, 81, 0.43) 0%, rgba(81, 81, 81, 0) 100%)',
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
        padding: '6px 16px',
        borderRadius: '22px',
        '&.active': {
            background: '#72F34B',
            color: '#000',
        },
        '& svg': {
            marginRight: '6px',
        },
        '&:hover': {
            background: '#72F34B',
            color: '#000',
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
    },
    banner: {

        '& .wrapper-banner': {
            marginBottom: '84px',
            position: 'relative',
            '& .img-banner': {
                height: '340px',
                width: '100%',
                // background: '100%',
                background: '#171717',
                border: '1px solid #686868',

                '& img': {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                },
            },
            '& .icon': {
                width: '132px',
                height: '132px',
                borderRadius: '50%',
                background: '#171717',
                overflow: 'hidden',
                position: 'absolute',
                left: '50%',
                transform: 'translate(-50%)',
                bottom: '-60px',
                zIndex: 1000,
                display: 'grid',
                placeItems: 'center',
                '& img': {
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    objectFit: 'contain',
                }
            }
        },
        '& .infor': {
            '& h3': {
                fontFamily: 'Firs Neue',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '28px',
                lineHeight: '36px',
                marginBottom: '8px',
                textAlign: 'center',
            },
            '& .desc': {
                display: 'grid',
                justifyContent: 'center',
                '& p': {
                    fontFamily: 'Helvetica',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    fontSize: '16px',
                    lineHeight: '22px',
                    marginBottom: '24px',
                    textAlign: 'center',
                    color: '#AEAEAE',
                    maxWidth: '755px',
                }
            },
            '& .socials': {
                ...typeDisplayFlex,
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
            }
        },
    }
}));

export default useStyles;
