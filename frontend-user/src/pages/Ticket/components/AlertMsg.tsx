import React from 'react'
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    alertMsg: {
        width: "100%",
        marginTop: "14px",
        "& img": {
            width: "14px",
            height: "14px",
            marginRight: "8px",
        },
        "& span": {
            fontFamily: "Firs Neue",
            fontStyle: "normal",
            fontWeight: 600,
            fontSize: "12px",
            lineHeight: "16px",
            textAlign: "left",
            color: "#F24B4B",
        },
    },
})
type Props = {
    message: string,
    [k: string]: any
}
const AlertMsg = (props: Props) => {
    const styles = useStyles();
    return (
        <div className={styles.alertMsg}>
            <img src={'/images/warning-red.svg'} alt="" />
            <span>
                {props.message}
            </span>
        </div>
    )
}

export default React.memo(AlertMsg);