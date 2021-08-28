import { makeStyles } from '@material-ui/core';
import { typeDisplayFlex } from '../../../styles/CommonStyle';

const useStyles = makeStyles((theme: any) => ({
    partnerCard: {
        width: '201px',
        height: '142.5px',
        [theme.breakpoints.down("xs")]: {
            width: "auto",
            height: '111px',
        },
        borderRadius: '2px',
        position: 'relative',
        overflow: 'hidden',

        '& .img, & img': {
            width: '100%',
            height: '100%',
            transition: '.5s',
            borderRadius: "4px",
            objectFit: "cover",
        },

        '& .info': {
            position: 'absolute',
            opacity: 0,
            top: '100%',
            left: 0,
            bottom: 0,
            right: 0,
            padding: '12px 10px',
            transition: '.5s',
            ...typeDisplayFlex,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            '& h4': {
                fontFamily: 'Firs Neue',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '28px',
                textAlign: 'left',
                color: '#fff',
                mixBlendMode: 'normal',
                marginBottom: '4px',
            },
            // '& h5': {
            //     fontFamily: 'Firs Neue',
            //     fontStyle: 'normal',
            //     fontWeight: 'normal',
            //     fontSize: '14px',
            //     lineHeight: '22px',
            //     textAlign: 'left',
            //     color: '#D1D1D1',
            //     mixBlendMode: 'normal',
            //     marginBottom: '8px',
            //     overflow: 'hidden',
            //     textOverflow: 'ellipsis',
            //     height: '44px',
            //     maxWidth: '201px',
            //     display: '-webkit-box',
            //     '-webkit-line-clamp': 2,
            //     '-webkit-box-orient': 'vertical',
            // },

            '& a': {
                fontFamily: 'Firs Neue',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '24px',
                textAlign: 'left',
                color: '#72F34B',
                ...typeDisplayFlex,
                gap: '2px',
                alignItems: 'center',
            }

        },

        '&:hover .img': {
            opacity: '.3'
        },

        '&:hover .info': {
            top: 0,
            opacity: 1,

        }
    }
}));

export default useStyles;
