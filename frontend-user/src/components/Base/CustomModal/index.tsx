import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import { typeDisplayFlex } from '@styles/CommonStyle';

const closeIcon = '/images/icons/close.svg';
const useStyles = makeStyles({
    paper: {
        maxWidth: 'unset',
        minWidth: '300px',
        position: 'relative',
        background: '#171717',
        fontFamily: 'Firs Neue',
        fontStyle: 'normal',
        fontWeight: 'normal',
        padding: '20px 10px'
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
    btnView: {
        padding: '7px 10px',
        fontFamily: 'inherit',
        background: '#72F34B',
        color: '#000',
        fontSize: '15px',
        borderRadius: '4px',
        '&:hover': {
            background: '#5ec73e',
            color: '#000',
        }
    },
    content: {
        marginTop: '45px',
        '& h3': {
            textAlign: 'center',
            fontSize: '24px',
            lineHeight: '36px',
            marginBottom: '24px',
            fontFamily: 'inherit',
            color: '#fff'
        },
        // '& h5': {
        //   textAlign: 'center',
        //   fontSize: '16px',
        //   marginBottom: '15px',
        //   fontFamily: 'inherit',
        //   color: '#fff'
        // },
        // '& p': {
        //   textAlign: 'center',
        //   fontSize: '15px',
        //   fontFamily: 'inherit',
        //   color: '#fff',
        //   padding: '10px',
        //   borderRadius: '4px',
        //   background: '#2E2E2E',
        // }
    },
    actions: {
        // display: 'grid',
        // justifyContent: 'center',
    },
    mb0: {
        marginBottom: '0px !important',
    },
    boxGroup: {
        ...typeDisplayFlex,
        justifyContent: 'space-between',
        marginBottom: '22px',
        '&:last-child': {
            marginBottom: '0px !important',
        },
        '& label': {
            fontFamily: 'Firs Neue',
            fontNormal: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#fff',
        },
        '& span': {
            fontFamily: 'Firs Neue',
            fontNormal: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#fff',
            textTransform: 'uppercase',
            '& img': {
                width: '18px',
                height: '18px',
                marginRight: '6px'
            }
        }
    },
    formGroup: {
        marginBottom: '24px',
        '& input': {
            width: '100%',
            background: '#171717',
            border: '1px solid #44454B',
            boxSizing: 'border-box',
            borderRadius: '4px',
            fontFamily: 'Firs Neue',
            fontNormal: 'normal',
            fontWeight: 'normal',
            fontSize: '14px',
            lineHeight: '22px',
            color: '#AEAEAE',
            padding: '11px 13px',
            marginBottom: '3px',
            outline: 'none'
        },
        '& span': {
            dislay: 'block',
            width: '100%',
            fontFamily: 'Firs Neue',
            fontNormal: 'normal',
            fontWeight: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            color: '#AEAEAE',
        }
    },
    btnBid: {
        textTransform: 'unset',
        width: '100%'
    }
})

type Props = {
    open: boolean,
    actions?: Element | ReactNode,
    onClose?: Function,
    [k: string]: any
}
const CustomModal = ({ open, actions, ...props }: Props) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles();

    const handleClose = () => {
        props.onClose && props.onClose();
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
                {props.children}

            </DialogContent>
            <DialogActions className={classes.actions}>
                {actions}
            </DialogActions>
        </Dialog>
    );
}

export default React.memo(CustomModal);