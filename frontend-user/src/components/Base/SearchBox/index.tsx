import clsx from 'clsx';
import { MouseEventHandler } from 'react';
import { useSearchBoxStyles } from './style';
const searchIcon = '/images/icons/search-1.svg';

type Props = {
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    onReload?: MouseEventHandler;
    [k: string]: any;
}

export const SearchBox = ({onReload, ...props}: Props) => {
    const classes = useSearchBoxStyles();
    return (
        <div className={classes.div}>
            <form className={classes.form}>
                <input type="text" placeholder="" {...props} className={clsx(classes.input, props.className)} />
                {
                    onReload && props.value && <button onClick={onReload} className={classes.btnReload} type="button">
                        <svg style={{marginLeft: '-5px'}} width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.565 16.6331L21.5434 12.6545C21.8023 12.3957 21.8023 11.9773 21.5434 11.7185C21.2846 11.4597 20.8662 11.4597 20.6074 11.7185L16.6289 15.6971L12.6504 11.7185C12.3915 11.4597 11.9732 11.4597 11.7144 11.7185C11.4555 11.9773 11.4555 12.3957 11.7144 12.6545L15.6929 16.6331L11.7144 20.6116C11.4555 20.8704 11.4555 21.2888 11.7144 21.5476C11.8434 21.6767 12.013 21.7415 12.1824 21.7415C12.3519 21.7415 12.5214 21.6767 12.6504 21.5476L16.6289 17.5691L20.6074 21.5476C20.7365 21.6767 20.906 21.7415 21.0754 21.7415C21.2449 21.7415 21.4143 21.6767 21.5434 21.5476C21.8023 21.2888 21.8023 20.8704 21.5434 20.6116L17.565 16.6331Z" fill="#717171" />
                        </svg>
                    </button>
                }
                <img src={searchIcon} alt="" className={classes.img} />
            </form>
        </div>
    )
}
