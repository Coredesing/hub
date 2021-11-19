import React, { useEffect, useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { makeStyles, Box } from '@material-ui/core';
import clsx from 'clsx';
import '../style.css'
import { numberWithCommas } from '@utils/formatNumber';
import CountDownTimeV1 from '@base-components/CountDownTime';
import { formatNumber } from '@utils/index';

const useStyles = makeStyles((theme) => ({
    boxItem: {
        '& label': {
            fontFamily: 'Firs Neue',
            fontWeight: 'normal',
            fontStyle: 'normal',
            fontSize: '12px',
            lineHeight: '16px',
            color: '#FFFFFF',
            display: 'block',
        },
        '& span': {
            fontFamily: 'Firs Neue',
            fontWeight: 600,
            fontStyle: 'normal',
            fontSize: '16px',
            lineHeight: '22px',
            color: '#FFFFFF',
            display: 'block',
        },
        '& .line': {
            display: 'block',
            height: '100%',
            width: '1px',
            background: 'rgba(255, 255, 255, 0.2)',
        }
    },
    bodyModal: {
        maxWidth: '440px',
        '& .prev, & .next': {
            display: 'block',
            cursor: 'pointer',
        },
        '& .content': {
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: '20px auto 20px',
            alignItems: 'center',
            justifyContent: 'space-between',
            // [theme.breakpoints.down('xs')]: {
            //     gap: '0',
            // },

            '& .content-body': {
                maxWidth: '400px',
                [theme.breakpoints.down('xs')]: {
                    maxWidth: '220px',
                },
                '& .wrapper-img': {
                    // paddingTop: "30px",
                    // paddingLeft: '60px',
                    // paddingRight: '60px',
                    display: 'grid',
                    alignItems: 'center',
                    placeContent: 'center',
                    position: 'relative',
                    height: '100%',
                    // minHeight: '360px',
                    [theme.breakpoints.down('xs')]: {
                        paddingLeft: 0,
                        paddingRight: 0
                    },
                    '& div': {
                        width: '360px',
                        height: '360px',
                        position: 'relative',
                        overflow: 'hidden',
                        marginBottom: '40px',
                        zIndex: 1,
                        [theme.breakpoints.down('xs')]: {
                            width: '250px',
                            height: '250px',
                            marginBottom: '20px'
                        },
                    },
                    '& img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        position: 'relative',
                        '&.h-r-t-l': {
                            animation: `hiddenRightToLeft 200ms forwards`,
                        },
                        '&.h-l-t-r': {
                            animation: `hiddenLeftToRight 200ms forwards`,
                        },
                        '&.r-t-l': {
                            animation: `leftToRight 300ms forwards`,
                        },
                        '&.l-t-r': {
                            animation: `rightToLeft 300ms forwards`,
                        },
                    },
                    '& .box-name': {
                        fontFamily: "Firs Neue",
                        fontWeight: 600,
                        fontStyle: "normal",
                        fontSize: "20px",
                        lineHeight: "24px",
                        color: "#fff",
                        mixBlendMode: "normal",
                        display: 'block',
                        textAlign: 'center',
                    },
                    '& .box-id': {
                        fontFamily: "Firs Neue",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#fff",
                        mixBlendMode: "normal",
                        display: 'block',
                        textAlign: 'center',
                    },
                },
                "& .wrapper-countdown": {
                    height: '84px',
                    width: '100%',
                    marginTop: '30px',
                    [theme.breakpoints.down('xs')]: {
                        marginTop: 0,
                    },
                    "& .countdown": {
                        background: "rgba(0,0,0,0.4)",
                        width: "100%",
                        // zIndex: 10,
                        fontFamily: "Space Ranger",
                        "& .time .number": {
                            transform: "skew(-20deg)",
                        },
                        [theme.breakpoints.down('xs')]: {
                            paddingLeft: '10px',
                            paddingRight: '10px'
                        },
                    },
                }
            }
        }
    },
    paper: {
        maxWidth: '480px',
        // maxHeight: '480px',
        padding: 0,
        borderRadius: '4px',
        backgroundColor: '#2E2E2E',
        [theme.breakpoints.down('sm')]: {
            maxHeight: '440px',
        },
        // [theme.breakpoints.down('xs')]: {
        //     maxWidth: '300px',
        //     maxHeight: '300px',
        // },
        '& > .MuiDialogContent-root': {
            display: 'grid',
            alignItems: 'center',
            [theme.breakpoints.down('xs')]: {
                padding: '8px 8px',
            }
        }
    }
}));
type ObjectType = { [k: string]: any };
type Props = {
    open: boolean;
    onClose?: Function,
    boxesContent: ObjectType[],
    current: ObjectType,
    [k: string]: any,
}

const ModalBoxCollection = ({ open, current = {}, boxesContent, ...props }: Props) => {
    const styles = useStyles();
    const [currentBox, setCurrentBox] = useState<ObjectType>({});

    useEffect(() => {
        'idCollection' in current && setCurrentBox(current)

    }, [current])
    const onClose = () => {
        props.onClose && props.onClose();
    }
    let isHandlingShowImg = false;
    const handleShowImg = (newBox: ObjectType, from: 'right-to-left' | 'left-to-right') => {
        if (isHandlingShowImg) return;
        const wrapperImg = document.querySelector('.wrapper-img div');
        isHandlingShowImg = true;
        if (wrapperImg) {
            let elemImg: any = wrapperImg.querySelector('img');
            if (!elemImg) return;
            const newElmImg = document.createElement('img');
            newElmImg.src = newBox.icon;
            if (from === 'right-to-left') {
                elemImg.classList.remove('r-t-l');
                elemImg.classList.add('h-r-t-l');
                newElmImg.classList.add('r-t-l')
            } else {
                elemImg.classList.remove('l-t-r')
                elemImg.classList.add('h-l-t-r');
                newElmImg.classList.add('l-t-r')
            }
            setTimeout(() => {
                setCurrentBox(newBox);
                wrapperImg.removeChild(elemImg);
                wrapperImg.appendChild(newElmImg);
                isHandlingShowImg = false;
            }, 200)

        }
    }

    const onPrevSerie = () => {
        const idxCurr = boxesContent.findIndex(s => s.idCollection === currentBox.idCollection);
        const newBox = idxCurr === 0 ? boxesContent.slice(-1)[0] : boxesContent[idxCurr - 1];
        handleShowImg(newBox, 'right-to-left');
    }
    const onNextSerie = () => {
        const idxCurr = boxesContent.findIndex(s => s.idCollection === currentBox.idCollection);
        const newBox = idxCurr === boxesContent.length - 1 ? boxesContent[0] : boxesContent[idxCurr + 1];
        handleShowImg(newBox, 'left-to-right');
    }

    return (
        <CustomModal open={open} onClose={onClose} classes={{ paper: styles.paper }}>
            {/* <Box className={styles.headerModal}>
                <h3 className="text-white">{currentBox.name} Amount</h3>
            </Box> */}
            <Box className={styles.bodyModal}>
                <Box className="content">
                    <span className="prev" onClick={onPrevSerie}>
                        <svg width="20" height="9" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.11586 4.14412L4.56019 0.0931301C4.68368 -0.00716257 4.81867 -0.0264591 4.9653 0.0352813C5.11176 0.0971028 5.1853 0.208908 5.1853 0.371023V2.96363H19.6296C19.7377 2.96363 19.8265 2.99829 19.8959 3.06774C19.9652 3.13714 20 3.22592 20 3.33391V5.55608C20 5.66404 19.9653 5.75282 19.8959 5.82214C19.8264 5.89154 19.7376 5.9262 19.6297 5.9262H5.18522V8.51877C5.18522 8.6733 5.11156 8.78511 4.96518 8.85435C4.81843 8.91633 4.68343 8.8929 4.55995 8.78511L0.115616 4.68758C0.0384712 4.61048 0 4.51805 0 4.40993C0 4.30988 0.0387135 4.22126 0.11586 4.14412Z" fill="#72F34B" />
                        </svg>
                    </span>
                    <Box className="content-body">
                        <Box className="wrapper-img" >
                            <div>
                                <img src={currentBox.icon} alt="" />
                            </div>
                            <span className="box-name">{currentBox.name}</span>
                            <span className="box-id">#{formatNumber(currentBox.idCollection, 3)}</span>
                        </Box>
                        {/* <Box className="wrapper-countdown">
                            <CountDownTimeV1
                                time={{ date1: 1633885200000, date2: 1633666793845 }}
                                className="countdown"
                            />
                        </Box> */}
                    </Box>
                    <span className="next" onClick={onNextSerie}>
                        <svg width="20" height="9" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.8841 4.14412L15.4398 0.0931301C15.3163 -0.00716257 15.1813 -0.0264591 15.0347 0.0352813C14.8882 0.0971028 14.8147 0.208908 14.8147 0.371023V2.96363H0.370361C0.262285 2.96363 0.173506 2.99829 0.104144 3.06774C0.0348227 3.13714 0 3.22592 0 3.33391V5.55608C0 5.66404 0.0346606 5.75282 0.104103 5.82214C0.173627 5.89154 0.262407 5.9262 0.370321 5.9262H14.8148V8.51877C14.8148 8.6733 14.8884 8.78511 15.0348 8.85435C15.1816 8.91633 15.3166 8.8929 15.44 8.78511L19.8844 4.68758C19.9615 4.61048 20 4.51805 20 4.40993C20 4.30988 19.9613 4.22126 19.8841 4.14412Z" fill="#72F34B" />
                        </svg>
                    </span>
                </Box>
            </Box>
        </CustomModal>
    )
}

export default ModalBoxCollection
