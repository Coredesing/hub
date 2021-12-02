import { makeStyles } from '@material-ui/core'
import { Theme } from '@material-ui/core/styles/createTheme'
import { typeDisplayFlex } from '../../../styles/CommonStyle';


const useStyles = makeStyles<Theme>(props => ({
    card: {
        padding: '20px',
        borderRadius: '4px',
        background: 'rgba(45,46,46, 0.9)',
        border: '1px solid #515151',
        transition: '.3s',
        cursor: 'pointer',
        position: 'relative',
        maxWidth: '295px',
        width: '295px',
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
        borderRadius: '4px',
        '& img': {
            width: '100%',
            height: '100%',
            borderRadius: '4px',
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
}));

export default useStyles;
