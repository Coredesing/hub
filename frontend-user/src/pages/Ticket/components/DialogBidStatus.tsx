import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { ButtonGreen } from './ButtonGreen';
import { useWeb3React } from '@web3-react/core';
import { numberWithCommas } from '../../../utils/formatNumber';

const closeIcon = '/images/icons/close.svg';
const useStyles = makeStyles({
    paper: {
        maxWidth: '340px',
        minWidth: '300px',
        width: '100%',
        position: 'relative',
        background: '#171717',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        padding: '20px 10px',

    },
    btnClose: {
        position: 'absolute',
        right: '6px',
        top: '6px',
        minWidth: 'unset',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
    },
    content: {
        marginTop: '45px',
    },
    title: {
        marginBottom: '28px',
        '& h3': {
            textAlign: 'center',
            fontSize: '24px',
            lineHeight: '36px',
            fontFamily: 'inherit',
            color: '#fff'
        },
        '& h5': {
            textAlign: 'center',
            fontSize: '14px',
            lineHeight: '22px',
            marginTop: '4px',
            fontFamily: 'inherit',
            color: '#fff',
            fontWeight: 'normal',
        }
    },
    wrapperStatus: {
        textAlign: 'center',
        marginBottom: '18px',
        '& img': {
            width: '60px',
            height: '60px'
        }
    },
    mb0: {
        marginBottom: '0px !important',
    },
    btnConfirm: {
        width: '100%'
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '9px',
        '&:last-child': {
            marginBottom: 'unset',
        },
        '& .label': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontSize: '14px',
            lineHeight: '22px',
        },
        '& .text': {
            fontFamily: 'Firs Neue',
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '22px',
        },
        '& .text.has-icon': {
            position: 'relative',
            paddingLeft: '22px',
            '& .icon': {
                marginRight: '6px',
                width: '16px',
                height: '16px',
                position: 'absolute',
                left: 0,
                top: '2px',
            }
        },
        '& .bold': {
            fontWeight: 600,
        },
        '& .text-green': {
            color: '#72F34B'
        },
        '& .text-white': {
            color: '#fff'
        }
    },

})

export type StatusType = 'success' | 'failed' | 'processing';

type Props = {
    open: boolean,
    bidInfo?: { [k: string]: any },
    status?: StatusType,
    title?: string,
    subTitle?: string,
    [k: string]: any
}
const TicketBidModal = ({ open, status, title, subTitle, bidInfo, ...props }: Props) => {
    const { library, account } = useWeb3React();
    const classes = useStyles();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        props?.onClose();
    };

    const getStatusIcon = (status?: StatusType) => {
        const list = {
            processing: '/images/icons/spinner.gif',
            success: '/images/icons/success.svg',
            failed: '/images/icons/failed.svg',
        };
        return status && list[status];
    }
    return (
        <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
            classes={{
                paper: classes.paper
            }}
        >
            <Button autoFocus onClick={handleClose} color="primary" className={classes.btnClose}>
                <img src={closeIcon} alt="" />
            </Button>
            <DialogContent className={classes.content}>
                <div className={classes.wrapperStatus}>
                    {status && <img src={getStatusIcon(status)} alt="" />}
                </div>
                <div className={classes.title}>
                    <h3>{title}</h3>
                    <h5>{subTitle}</h5>
                </div>
                {
                    status !== 'failed' && <>
                        <div className={classes.item}>
                            <span className="label text-white ">YOUR STAKE</span>
                            <span className="text has-icon text-white bold">
                                <img className="rounded icon" src={`/images/icons/${(bidInfo?.symbol || '').toLowerCase()}.png`} onError={(e: any) => {
                                    e.target.onerror = null;
                                    e.target.src = bidInfo?.token_images;
                                }}
                                    alt="" />
                                {props.data?.value && numberWithCommas(props.data.value, 6)} {bidInfo?.symbol}
                            </span>
                        </div>
                        {/* <div className={classes.item}>
                            <span className="label text-white ">TOTAL BID</span>
                            <span className="text text-green bold">
                                0.1 ETH
                            </span>
                        </div> */}
                    </>
                }
            </DialogContent>
            <DialogActions>
                <ButtonGreen onClick={handleClose} className={classes.btnConfirm} disabled={!account}>
                    OK
                </ButtonGreen>
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(TicketBidModal);