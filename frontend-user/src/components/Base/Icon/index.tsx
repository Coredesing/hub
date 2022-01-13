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

export const BulletListIcon = ({ color = '#6C6D71', className, ...props }: { color?: string, className?: string, [k: string]: any }) => {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <path d="M15 0H7C6.4 0 6 0.4 6 1V3C6 3.6 6.4 4 7 4H15C15.6 4 16 3.6 16 3V1C16 0.4 15.6 0 15 0Z" fill={color} />
        <path d="M15 6H7C6.4 6 6 6.4 6 7V9C6 9.6 6.4 10 7 10H15C15.6 10 16 9.6 16 9V7C16 6.4 15.6 6 15 6Z" fill={color} />
        <path d="M15 12H7C6.4 12 6 12.4 6 13V15C6 15.6 6.4 16 7 16H15C15.6 16 16 15.6 16 15V13C16 12.4 15.6 12 15 12Z" fill={color} />
        <path d="M3 0H1C0.4 0 0 0.4 0 1V3C0 3.6 0.4 4 1 4H3C3.6 4 4 3.6 4 3V1C4 0.4 3.6 0 3 0Z" fill={color} />
        <path d="M3 6H1C0.4 6 0 6.4 0 7V9C0 9.6 0.4 10 1 10H3C3.6 10 4 9.6 4 9V7C4 6.4 3.6 6 3 6Z" fill={color} />
        <path d="M3 12H1C0.4 12 0 12.4 0 13V15C0 15.6 0.4 16 1 16H3C3.6 16 4 15.6 4 15V13C4 12.4 3.6 12 3 12Z" fill={color} />
    </svg>
}

export const GridIcon = ({ color = '#6C6D71', className, ...props }: { color?: string, className?: string, [k: string]: any  }) => {
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <path d="M6 0H1C0.4 0 0 0.4 0 1V6C0 6.6 0.4 7 1 7H6C6.6 7 7 6.6 7 6V1C7 0.4 6.6 0 6 0Z" fill={color} />
        <path d="M15 0H10C9.4 0 9 0.4 9 1V6C9 6.6 9.4 7 10 7H15C15.6 7 16 6.6 16 6V1C16 0.4 15.6 0 15 0Z" fill={color} />
        <path d="M6 9H1C0.4 9 0 9.4 0 10V15C0 15.6 0.4 16 1 16H6C6.6 16 7 15.6 7 15V10C7 9.4 6.6 9 6 9Z" fill={color} />
        <path d="M15 9H10C9.4 9 9 9.4 9 10V15C9 15.6 9.4 16 10 16H15C15.6 16 16 15.6 16 15V10C16 9.4 15.6 9 15 9Z" fill={color} />
    </svg>
}