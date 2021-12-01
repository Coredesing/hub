import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: any) => ({
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 295px)',
        gap: '15px',
        // placeContent: 'center',
        transition: '.3s',
        padding: '32px 0px',
    },
    heading: {
        color: '#fff',
        fontSize: '28px',
        fontFamily: 'Firs Neue',
        fontWeight: 600,
        marginBottom: '20px',
    }
}));

export default useStyles;
