import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    paginationNav: {
        marginTop: '32px',
        marginBottom: '10px',
        background: 'transparent',
    },
    ulPagination: {
        color: '#AEAEAE',
        '& li div': {
            color: '#AEAEAE',
        },
        '& button': {
            background: 'transparent',
            color: '#AEAEAE',
            fontSize: '14px',
            lineHeight: '24px',
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontWeight: 600,

            '&[aria-label^="page"]': {
                background: '#72F34B',
                color: '#000000',
                '&:hover': {
                    background: '#4fa934',
                }
            }
        }
    }
}));