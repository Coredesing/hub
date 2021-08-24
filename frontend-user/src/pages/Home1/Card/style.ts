import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: any) => ({
    cardImgUpcoming: {
        maxHeight: '220px',
        '&::before, &::after': {
            height: '6px !important',
            width: '80px !important',
        },

        '& h4': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '28px',
            textAlign: 'center',
            color: '#72F34B',
            mixBlendMode: 'normal',
            position: 'absolute',
            top: '-26px',
            left: '50%',
            transform: 'translate(-50%)',
        }
    },
}));

export default useStyles;
