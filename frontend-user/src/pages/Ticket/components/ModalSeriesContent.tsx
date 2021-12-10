import React, { useCallback, useEffect, useRef, useState } from 'react'
import CustomModal from '@base-components/CustomModal';
import { makeStyles, Box, Button } from '@material-ui/core';
// import clsx from 'clsx';
import '../style.css'
// import { numberWithCommas } from '@utils/formatNumber';
const useStyles = makeStyles((theme) => ({
    headerModal: {

    },
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
        // maxWidth: '440px',
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

            '& .content-body': {
                maxWidth: '320px',
                [theme.breakpoints.down('xs')]: {
                    minHeight: '296px',
                    height: 'fit-content'
                },
                '& .header': {
                    display: 'grid',
                    // gridTemplateColumns: 'minmax(50px, 100px) 1px minmax(50px, 100px)',
                    // justifyContent: 'space-between',
                    marginBottom: '8px',
                    placeContent: 'center',
                },
                '& .wrapper-img': {
                    // padding: '30px 30px',
                    background: '#000',
                    display: 'grid',
                    alignItems: 'center',
                    placeContent: 'center',
                    position: 'relative',
                    // height: '100%',
                    // minHeight: '360px',
                    [theme.breakpoints.down('xs')]: {
                        // padding: '20px 30px',
                    },
                    '& .wrapperVideo': {
                        width: '320px',
                        height: '320px',
                        '& .video': {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 100,
                            display: 'block',
                            background: '#000',
                        },

                        '& video': {
                            width: '100%',
                            height: '100%',
                            zIndex: 100,
                        }
                    },
                    '& div.img': {
                        cursor: 'zoom-in',
                        minWidth: '320px',
                        height: '320px',
                        position: 'relative',
                        overflow: 'hidden',
                        // display: 'grid',
                        // placeItems: 'center',

                        [theme.breakpoints.down('xs')]: {
                            minWidth: '250px',
                            height: '250px',
                        },
                        '& button': {
                            display: 'none',
                        },
                        '&.zoom-in': {
                            transition: '.3s',
                            background: 'rgba(0, 0, 0, 0.8)',
                            cursor: 'zoom-out',
                            position: 'fixed',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            display: 'grid',
                            placeItems: 'center',
                            '& .btn-prev, & .btn-next': {
                                position: 'absolute',
                            },
                            '& .btn-prev': {
                                left: '100px',
                                [theme.breakpoints.down('sm')]: {
                                    left: '20px',
                                }
                            },
                            '& .btn-next': {
                                right: '100px',
                                [theme.breakpoints.down('sm')]: {
                                    right: '20px',
                                }
                            },
                            '& button': {
                                display: 'block',
                            },
                            '& img': {
                                maxWidth: '720px',
                                maxHeight: '640px',
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                [theme.breakpoints.down('xs')]: {
                                    maxWidth: '100%',
                                    maxHeight: '320px',
                                }
                            }
                        }
                    },
                    '& img': {
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
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
                }
            }
        }
    },
    paper: {
        // maxWidth: '440px',
    },
    btnClose: {
        position: 'absolute',
        right: '30px',
        top: '30px',
        minWidth: 'unset',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
    }
}));
type ObjectType = { [k: string]: any };
type Props = {
    open: boolean;
    onClose?: Function,
    seriesContent: ObjectType[],
    current: ObjectType,
    [k: string]: any,
}

const ModalSeriesContent = ({ open, current = {}, seriesContent, isShowRateSerie, isShowAmountSerie, ...props }: Props) => {
    const styles = useStyles();
    const [currentSerie, setCurrentSerie] = useState<ObjectType>({});

    useEffect(() => {
        current.id && setCurrentSerie(current)

    }, [current])
    const onClose = () => {
        props.onClose && props.onClose();
    }
    let isHandlingShowImg = false;
    const handleShowImg = (newSerie: ObjectType, from: 'right-to-left' | 'left-to-right') => {
        setCurrentSerie(newSerie);
        // if (isHandlingShowImg) return;
        // const wrapperImg = document.querySelector('.wrapper-img div.img');
        // isHandlingShowImg = true;
        // if (wrapperImg) {
        //     let elemImg: any = wrapperImg.querySelector('img');
        //     if (!elemImg) return;
        //     const newElmImg = document.createElement('img');
        //     newElmImg.src = newSerie.banner;
        //     if (from === 'right-to-left') {
        //         elemImg.classList.remove('r-t-l');
        //         elemImg.classList.add('h-r-t-l');
        //         newElmImg.classList.add('r-t-l')
        //     } else {
        //         elemImg.classList.remove('l-t-r')
        //         elemImg.classList.add('h-l-t-r');
        //         newElmImg.classList.add('l-t-r')
        //     }
        //     setTimeout(() => {
        //         setCurrentSerie(newSerie);
        //         try {
        //             wrapperImg.removeChild(elemImg);
        //             wrapperImg.appendChild(newElmImg);
        //         } catch (error) {
        //             console.log('err', error)
        //         }
        //         isHandlingShowImg = false;
        //     }, 200)
        // } else {
        //     setCurrentSerie(newSerie);
        // }
    }

    const onPrevSerie = (e?: any) => {
        if (e) {
            e.stopPropagation()
        }
        const idxCurr = seriesContent.findIndex(s => s.id === currentSerie.id);
        const newSerie = idxCurr === 0 ? seriesContent.slice(-1)[0] : seriesContent[idxCurr - 1];
        handleShowImg(newSerie, 'right-to-left');
    }
    const onNextSerie = (e?: any) => {
        if (e) {
            e.stopPropagation()
        }
        const idxCurr = seriesContent.findIndex(s => s.id === currentSerie.id);
        const newSerie = idxCurr === seriesContent.length - 1 ? seriesContent[0] : seriesContent[idxCurr + 1];
        handleShowImg(newSerie, 'left-to-right');
    }

    const onZoom = (e: any) => {
        e.stopPropagation();
        const img = document.querySelector('.wrapper-img div.img');
        if (img) {
            if (img.classList.contains('zoom-in')) {
                img.classList.remove('zoom-in');
            } else {
                img.classList.add('zoom-in');
            }
        }
    }

    let imgRef = useRef() as any;
    let wrapVideoRef = useRef() as any;

    const onKeyUp = useCallback((e: any) => {
        if (!open) {
            return;
        }
        if (e.key === 'ArrowLeft') {
            onPrevSerie()
        }
        if (e.key === 'ArrowRight') {
            onNextSerie()
        }
    }, [open, currentSerie]);

    useEffect(() => {
        window.onkeyup = onKeyUp;
    }, [onKeyUp])


    return (
        <CustomModal open={open} onClose={onClose} classes={{ paper: styles.paper }}>
            <Box className={styles.headerModal}>
                <h3 className="text-white">{currentSerie.name}</h3>
            </Box>
            <Box className={styles.bodyModal}>
                <Box>
                    <Box className="content">
                        <span className="prev" onClick={onPrevSerie}>
                            <svg width="20" height="9" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.11586 4.14412L4.56019 0.0931301C4.68368 -0.00716257 4.81867 -0.0264591 4.9653 0.0352813C5.11176 0.0971028 5.1853 0.208908 5.1853 0.371023V2.96363H19.6296C19.7377 2.96363 19.8265 2.99829 19.8959 3.06774C19.9652 3.13714 20 3.22592 20 3.33391V5.55608C20 5.66404 19.9653 5.75282 19.8959 5.82214C19.8264 5.89154 19.7376 5.9262 19.6297 5.9262H5.18522V8.51877C5.18522 8.6733 5.11156 8.78511 4.96518 8.85435C4.81843 8.91633 4.68343 8.8929 4.55995 8.78511L0.115616 4.68758C0.0384712 4.61048 0 4.51805 0 4.40993C0 4.30988 0.0387135 4.22126 0.11586 4.14412Z" fill="#72F34B" />
                            </svg>
                        </span>
                        <Box className="content-body">
                            <Box className="header" style={isShowRateSerie && isShowAmountSerie ? { justifyContent: 'space-between', gridTemplateColumns: 'auto auto' } : {}}>
                                {/* <Box className={styles.boxItem}>
                                <label>Amount</label>
                                <span>{numberWithCommas(currentSerie.amount)}</span>
                            </Box>
                            <Box className={styles.boxItem}>
                                <span className="line"></span>
                            </Box> */}
                                {
                                    isShowRateSerie &&
                                    <Box className={styles.boxItem}>
                                        <label className="text-center">Rare</label>
                                        <span className="text-center">{currentSerie.rate}%</span>
                                    </Box>
                                }
                                {
                                    isShowAmountSerie &&
                                    <Box className={styles.boxItem}>
                                        <label className="text-center">Amount</label>
                                        <span className="text-center">{currentSerie.amount}</span>
                                    </Box>
                                }
                            </Box>
                            <Box className="wrapper-img" >
                                {
                                    currentSerie.video && <div className="wrapperVideo" ref={wrapVideoRef} style={{ display: 'none' }} >
                                        <div className="video">
                                            <video
                                                preload="auto"
                                                autoPlay
                                                loop
                                                muted
                                                controls
                                                key={currentSerie.video}
                                                ref={(video) => {
                                                    if (!video) return;
                                                    if (imgRef?.current) {
                                                        imgRef.current.style.display = 'grid';
                                                        if (imgRef.current.classList.contains('zoom-in')) {
                                                            imgRef.current.classList.remove('zoom-in')
                                                        }
                                                    }
                                                    if (wrapVideoRef.current) {
                                                        wrapVideoRef.current.style.display = 'none'
                                                    }
                                                    video.onloadeddata = function () {
                                                        setTimeout(() => {
                                                            if (wrapVideoRef.current) {
                                                                wrapVideoRef.current.style.display = 'block'
                                                            }
                                                            if (imgRef?.current) {
                                                                imgRef.current.style.display = 'none';
                                                            }
                                                            video.play();
                                                        }, 500)
                                                    }
                                                }}
                                            >
                                                <source src={currentSerie.video} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
                                }
                                <div className="img" onClick={onZoom} ref={imgRef}>
                                    <Button autoFocus onClick={onZoom} color="primary" className={styles.btnClose}>
                                        <img src={'/images/icons/close.svg'} alt="" />
                                    </Button>
                                    <Button className="btn-prev" onClick={onPrevSerie}>
                                        <svg width="40" height="40" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M0.11586 4.14412L4.56019 0.0931301C4.68368 -0.00716257 4.81867 -0.0264591 4.9653 0.0352813C5.11176 0.0971028 5.1853 0.208908 5.1853 0.371023V2.96363H19.6296C19.7377 2.96363 19.8265 2.99829 19.8959 3.06774C19.9652 3.13714 20 3.22592 20 3.33391V5.55608C20 5.66404 19.9653 5.75282 19.8959 5.82214C19.8264 5.89154 19.7376 5.9262 19.6297 5.9262H5.18522V8.51877C5.18522 8.6733 5.11156 8.78511 4.96518 8.85435C4.81843 8.91633 4.68343 8.8929 4.55995 8.78511L0.115616 4.68758C0.0384712 4.61048 0 4.51805 0 4.40993C0 4.30988 0.0387135 4.22126 0.11586 4.14412Z" fill="#72F34B" />
                                        </svg>
                                    </Button>
                                    <img src={currentSerie.banner} key={currentSerie.banner} alt="" />
                                    <Button className="btn-next" onClick={onNextSerie}>
                                        <svg width="40" height="40" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.8841 4.14412L15.4398 0.0931301C15.3163 -0.00716257 15.1813 -0.0264591 15.0347 0.0352813C14.8882 0.0971028 14.8147 0.208908 14.8147 0.371023V2.96363H0.370361C0.262285 2.96363 0.173506 2.99829 0.104144 3.06774C0.0348227 3.13714 0 3.22592 0 3.33391V5.55608C0 5.66404 0.0346606 5.75282 0.104103 5.82214C0.173627 5.89154 0.262407 5.9262 0.370321 5.9262H14.8148V8.51877C14.8148 8.6733 14.8884 8.78511 15.0348 8.85435C15.1816 8.91633 15.3166 8.8929 15.44 8.78511L19.8844 4.68758C19.9615 4.61048 20 4.51805 20 4.40993C20 4.30988 19.9613 4.22126 19.8841 4.14412Z" fill="#72F34B" />
                                        </svg>
                                    </Button>
                                </div>
                            </Box>
                        </Box>
                        <span className="next" onClick={onNextSerie}>
                            <svg width="20" height="9" viewBox="0 0 20 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.8841 4.14412L15.4398 0.0931301C15.3163 -0.00716257 15.1813 -0.0264591 15.0347 0.0352813C14.8882 0.0971028 14.8147 0.208908 14.8147 0.371023V2.96363H0.370361C0.262285 2.96363 0.173506 2.99829 0.104144 3.06774C0.0348227 3.13714 0 3.22592 0 3.33391V5.55608C0 5.66404 0.0346606 5.75282 0.104103 5.82214C0.173627 5.89154 0.262407 5.9262 0.370321 5.9262H14.8148V8.51877C14.8148 8.6733 14.8884 8.78511 15.0348 8.85435C15.1816 8.91633 15.3166 8.8929 15.44 8.78511L19.8844 4.68758C19.9615 4.61048 20 4.51805 20 4.40993C20 4.30988 19.9613 4.22126 19.8841 4.14412Z" fill="#72F34B" />
                            </svg>
                        </span>
                    </Box>
                    {
                        currentSerie.description && <Box marginTop="20px" paddingLeft="36px" paddingRight="36px" maxHeight="150px" overflow="auto" className="custom-scroll">
                            <h4 className="text-white" style={{ marginBottom: '8px', fontSize: '16px' }}>Description</h4>
                            <p className="text-white" style={{ lineHeight: '20px', fontSize: '14px', maxWidth: '320px' }}>
                                {currentSerie.description}
                            </p>
                        </Box>
                    }
                </Box>
            </Box>
        </CustomModal>
    )
}

export default ModalSeriesContent
