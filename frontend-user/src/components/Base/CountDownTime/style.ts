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
    }
}));

export default useStyles;