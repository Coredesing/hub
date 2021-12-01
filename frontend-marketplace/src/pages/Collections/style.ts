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
    content: {},
    collections: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        overflow: 'auto',
        paddingBottom: '10px',
    },

}));

export default useStyles;