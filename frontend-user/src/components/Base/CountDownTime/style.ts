import { makeStyles } from "@material-ui/core";
import { typeDisplayFlex } from "@styles/CommonStyle";

export const useStyles = makeStyles((theme: any) => ({
    cardBodyClock: {
        "& .times": {
            ...typeDisplayFlex,
            justifyContent: "space-around",
            gap: "12px",
            background: "#2E2E2E",
            borderRadius: "4px",

            "& .dot": {
                display: "block",
                marginTop: "8px",
                fontFamily: "Firs Neue",
                fontStyle: "normal",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: "28px",
                color: "#fff",
            },

            "& .time": {
                // display: 'grid',
                // gap: '1px',
                display: "block",
                textAlign: "center",
                width: "60px",
                paddingTop: "6px",
                paddingBottom: "6px",

                [theme.breakpoints.down('xs')]: {
                    width: "40px",
                },

                "& .number, & .text": {
                    fontStyle: "normal",
                    mixBlendMode: "normal",
                    display: "block",
                },
                "& .number": {
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: "24px",
                    lineHeight: "36px",
                    fontFamily: "Firs Neue",
                    [theme.breakpoints.down('xs')]: {
                        fontSize: "16px",
                        lineHeight: "28px",
                    },
                },
                "& .text": {
                    color: "#D1D1D1",
                    fontWeight: "600",
                    fontSize: "8px",
                    lineHeight: "12px",
                    fontFamily: "Hanken Grotesk",
                    textTransform: "uppercase",
                },
            },
        },
    },
    boxTimeV2: {
        display: 'grid',
        gap: '5px',
        padding: '7px 2px',
        background: '#171717',
        minHeight: '42px',
        fontSize: '16px',
        [theme.breakpoints.down('xs')]: {
            fontSize: '14px'
        },
        '&.vertical': {
            gridTemplateColumns: '1fr',
            placeContent: 'center',
            placeItems: 'center',
        },
        '&.horizontal': {
            gridTemplateColumns: 'auto auto',
            placeContent: 'center',
            placeItems: 'center',
        }
    },
    text: {
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        color: ' #fff',
        fontWeight: 'normal',
        fontSize: '12px',
        // lineHeight: '16px',
        mixBlendMode: 'normal',
        textTransform: 'uppercase'
    },
    timeEnd: {
        ...typeDisplayFlex,
        alignItems: 'center',
        // padding: '3px 8px',
        borderRadius: '4px',
        // background: '#2E2E2E',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        color: ' #fff',
        fontWeight: 600,
        fontSize: 'inherit',
        // lineHeight: '28px',
        mixBlendMode: 'normal',
        '& .sp1': {
            display: 'block',
            marginRight: '6px'
        }
    },
    boxTitleTimeV2: {
        display: 'grid',
        gridTemplateColumns: '12px auto',
        gap: '2px',
        alignItems: 'center'
    }
}));

export default useStyles;