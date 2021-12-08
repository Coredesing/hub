import { makeStyles } from "@material-ui/core"

export const getVectorIcon = (color: string = '#72F34B') => {
    return <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.51762 5.47949H0.482355C0.0547937 5.47949 -0.163021 4.96319 0.143533 4.65664L4.66117 0.139006C4.84671 -0.0465398 5.15326 -0.0465398 5.33889 0.139006L9.85652 4.65664C10.163 4.96319 9.94518 5.47949 9.51762 5.47949Z" fill={color} />
    </svg>

}

type Props = {
    title?: string;
}

const useStyles = makeStyles((theme) => ({
    wrapperIcon: {
        '& img': {
            // maxWidth: '120px',
            // maxHeight: '120px',
            // width: '100%',
            // height: '100%',
            objectFit: 'contain',
        }
    }
}))

export const SuccessIcon = ({ title }: Props) => {
    const classes = useStyles();
    return <div className={classes.wrapperIcon}>
        <img src="/images/icons/success.png" alt="" />
        {title && <h4>{title}</h4>}
    </div>
}

export const FailedIcon = ({ title }: Props) => {
    const classes = useStyles();
    return <div className={classes.wrapperIcon}>
        <img src="/images/icons/fail.png" alt="" />
        {title && <h4>{title}</h4>}
    </div>
}

export const WarningIcon = ({ title }: Props) => {
    const classes = useStyles();
    return <div className={classes.wrapperIcon}>
        <img src="/images/icons/danger.png" alt="" />
        {title && <h4>{title}</h4>}
    </div>
}