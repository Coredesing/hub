import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme: any) => ({
    cards: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, 295px)',
        gap: '20px',
        placeContent: 'center',
        transition: '.3s',
    },
}));

export default useStyles;
