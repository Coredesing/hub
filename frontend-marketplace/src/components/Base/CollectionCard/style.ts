import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: any) => ({

    collection: {
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
    },

}));

export default useStyles;