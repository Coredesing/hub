import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: any) => ({

    collection: {
        width: '295px',
        minWidth: '295px',
        padding: '11px',
        // background: 'radial-gradient(102.65% 160.75% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(70, 144, 213, 0) 100%)',
        // background: '#686868',
        background: 'rgba(45,46,46, 0.9)',
        // background: 'radial-gradient(82.49% 167.56% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(255, 255, 255, 0) 100%)',
        border: '1px solid #686868',
        backdropFilter: 'blur(10px)',
        borderRadius: '4px',
        backgroundBlendMode: 'overlay, normal',
        filter: 'drop-shadow(2px 16px 19px rgba(0, 0, 0, 0.09))',
        transition: '.3s',
        '&.active, &:hover': {
            border: '1px solid #72F34B',
        },
        '& .img': {
            position: 'relative',
            width: '100%',
            height: '100px',
            background: '#000',
            marginBottom: '31px',
            borderRadius: '4px',
            '& img': {
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '4px',
            },
            '& .wr-icon': {
                position: 'absolute',
                bottom: '-21px',
                left: '50%',
                width: '48px',
                height: '48px',
                transform: 'translate(-50%)',
                // background: 'radial-gradient(102.65% 160.75% at 15.32% 21.04%, rgba(217, 217, 217, 0.2) 0%, rgba(231, 245, 255, 0.0447917) 77.08%, rgba(70, 144, 213, 0) 100%)',
                background: 'rgb(45,46,46)',
                borderRadius: '50%',
                display: 'grid',
                // placeContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                '& div': {
                    width: '39px',
                    height: '39px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                },
            },
            '& .icon': {
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                // background: '#000',
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
                maxHeight: '40px',
                overflow: 'hidden',
                whiteSpace: 'initial',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                '-webkit-line-clamp': 2,
                '-webkit-box-orient': 'vertical',
            }
        }
    },

}));

export default useStyles;