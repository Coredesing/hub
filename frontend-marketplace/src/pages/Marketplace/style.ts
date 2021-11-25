import { makeStyles } from "@material-ui/styles";
import { typeDisplayFlex } from "@styles/CommonStyle";

const useStyles = makeStyles((theme: any) => ({
    page: {

        // [theme.breakpoints.down('xs')]: {
        //     padding: '28px 32px',
        // },
        '& .content-page': {
            width: '100%',
            maxWidth: '1240px',
            margin: 'auto',
            padding: '28px 0px',
        }
    },
    swiperSlide: {
        '& .swiper-button-prev, & .swiper-button-next': {
            width: '32px',
            height: '32px',
            backdropFilter: 'blur(80px)',
            borderRadius: '50%',
            // transform: 'matrix(-1, 0, 0, 1, 0, 0)',
            background: 'rgba(255, 255, 255, 0.6)',
            transition: '.3s',
            '&:hover': {
                background: '#fff',
            }
        },
        '& .swiper-button-prev:after, & .swiper-button-next:after': {
            display: 'none',
        },
        '& .swiper-button-prev:before': {
            content: 'url(/images/icons/prev-icon.svg)',

        },
        '& .swiper-button-next:before': {
            content: 'url(/images/icons/next-icon.svg)',
        }
    },
    bannerSlide: {
        '& .swiper-button-prev': {
            left: '80px',
        },
        '& .swiper-button-next': {
            right: '80px',
        },
        [theme.breakpoints.down('xs')]: {
            '& .swiper-button-prev': {
                left: '20px',
            },
            '& .swiper-button-next': {
                right: '20px',
            },
        }
    },
    listCardsSlide: {
        // [theme.breakpoints.up('md')]: {
        //     '& .swiper-button-prev': {
        //         left: '10px',
        //     },
        //     '& .swiper-button-next': {
        //         right: '10px',
        //     },
        // },
        '& > a': {
            display: 'grid',
            placeContent: 'center',
        },
        '& .swiper-button-prev': {
            left: '10px',
        },
        '& .swiper-button-next': {
            right: '10px',
        },
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
                background: '#000',
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
                background: 'rgb(31 31 31 / 70%)',
                [theme.breakpoints.down('xs')]: {
                    left: 0,
                    width: '100%',
                    bottom: 0
                },
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
        [theme.breakpoints.down('xs')]: {
            padding: '0px 20px',
        }
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
                    // background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
                    background: 'rgba(255, 255, 255, 0.3)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                        background: '#eee',
                        color: '#000',
                    }
                }
            }
        }
    },
    swipeCard: {
        width: '295px !important'
    },
    hostCollections: {
        display: 'flex',
        gap: '20px',
        overflow: 'auto',
        paddingBottom: '10px',
        // '& .swiper-slide': {
        //     width: '295px !important',
        //     minWidth: '295px',

        //     [theme.breakpoints.down('xs')]: {
        //         width: '295px !important',
        //     }
        // },
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
        // gridTemplateColumns: 'repeat(auto-fit, 295px)',
        gap: '20px',
        placeContent: 'center',
        transition: '.3s',
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
    },
    btn: {
        padding: '7px 12px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        borderRadius: '4px'
    }
}));

export default useStyles;
