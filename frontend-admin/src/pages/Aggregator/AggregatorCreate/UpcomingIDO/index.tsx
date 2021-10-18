import React, { useState, useEffect } from 'react'
import useStyles from './style';
// @ts-ignore
import DateTimePicker from 'react-datetime-picker';
import {useCommonStyle} from "../../../../styles";


const UpcomingIDO: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const commonStyle = useCommonStyle();
    const { register, errors, gameDetails, onChangeUpcomingIDO } = props

    const [upcomingIDOInfo, setUpcomingIDOInfo] = useState({
        ido_type: gameDetails?.ido_type,
        ido_date: gameDetails?.ido_date,
        ido_image: gameDetails?.ido_image,
        token_price: gameDetails?.token_price,
        network_available: gameDetails?.network_available,
        accept_currency: gameDetails?.accept_currency,
    });

    if (upcomingIDOInfo) {
        onChangeUpcomingIDO(upcomingIDOInfo)
    }
    const onChangeUpcomingType = (event: any) => {
        let newData = {...upcomingIDOInfo}
        console.log(event)
        newData.ido_type = event
        setUpcomingIDOInfo(newData)
        onChangeUpcomingIDO(newData)
    }
    const onChangeIDODate = (event: any) => {
        let newData = {...upcomingIDOInfo}
        newData.ido_date = event
        setUpcomingIDOInfo(newData)
        onChangeUpcomingIDO(newData)
    }
    const onChangeIDOImage = (event: any) => {
        let newData = {...upcomingIDOInfo}
        newData.ido_image = event.target.value
        setUpcomingIDOInfo(newData)
        onChangeUpcomingIDO(newData)
    }
    const onChangeTokenPrice = (event: any) => {
        let newData = {...upcomingIDOInfo}
        newData.token_price = event.target.value
        setUpcomingIDOInfo(newData)
        onChangeUpcomingIDO(newData)
    }
    const onChangeNetwork = (event: any) => {
        let newData = {...upcomingIDOInfo}
        newData.network_available = event
        setUpcomingIDOInfo(newData)
        onChangeUpcomingIDO(newData)
    }
    const onChangeAcceptCurrency = (event: any) => {
        let newData = {...upcomingIDOInfo}
        newData.accept_currency = event
        setUpcomingIDOInfo(newData)
        onChangeUpcomingIDO(newData)
    }

    return (
            <div>
                <div className={classes.infoForm}>
                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Type</label>
                        <label className={classes.formControlLabelCheckbox}>
                        <input
                            type="radio"
                            name={"ido-type"}
                            onChange={() => onChangeUpcomingType('launched')}
                            defaultChecked={upcomingIDOInfo.ido_type === 'launched'}
                            className={classes.formControlCheckbox}
                        />
                        Launched
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                type="radio"
                                name={"ido-type"}
                                onChange={() => onChangeUpcomingType('upcoming')}
                                defaultChecked={upcomingIDOInfo.ido_type === 'upcoming'}
                                className={classes.formControlCheckbox}
                            />
                            Upcoming IDO
                        </label>
                    </div>


                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>IDO DATE</label>
                        <br/>
                        <DateTimePicker
                            className={`${commonStyle.DateTimePicker} ${classes.formDatePicker}`}
                            monthPlaceholder="mm"
                            dayPlaceholder="dd"
                            yearPlaceholder="yy"
                            calendarIcon={<img src="/images/icon-calendar.svg" alt="" />}
                            value={upcomingIDOInfo.ido_date}
                            onChange={(date: any) => { onChangeIDODate(date) }}
                        />
                    </div>
                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>IDO Image</label>
                        <input
                            type="text"
                            placeholder={'Image Link for IDO'}
                            defaultValue={upcomingIDOInfo.ido_image}
                            onChange={onChangeIDOImage}
                            className={classes.formControlInput}
                        />
                    </div>
                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Network Available</label>
                        <br/>
                        <br/>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                type="radio"
                                name={"network"}
                                onChange={() => onChangeNetwork('Ether')}
                                defaultChecked={upcomingIDOInfo.network_available === 'Ether'}
                                className={classes.formControlCheckbox}
                            />
                            Ether
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                type="radio"
                                name={"network"}
                                onChange={() => onChangeNetwork('BSC')}
                                defaultChecked={upcomingIDOInfo.network_available === 'BSC'}
                                className={classes.formControlCheckbox}
                            />
                            BSC
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                type="radio"
                                name={"network"}
                                onChange={() => onChangeNetwork('POLYGON')}
                                defaultChecked={upcomingIDOInfo.network_available === 'POLYGON'}
                                className={classes.formControlCheckbox}
                            />
                            POLYGON
                        </label>
                        <br/>
                        <br/>
                        <label className={classes.formControlLabel}>Accept Currency</label>
                        <br/>
                        <br/>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                type="radio"
                                name={"currency"}
                                onChange={() => onChangeAcceptCurrency('USDT')}
                                defaultChecked={upcomingIDOInfo.accept_currency === 'USDT'}
                                className={classes.formControlCheckbox}
                            />
                            USDT
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                type="radio"
                                name={"currency"}
                                onChange={() => onChangeAcceptCurrency('BUSD')}
                                defaultChecked={upcomingIDOInfo.accept_currency === 'BUSD'}
                                className={classes.formControlCheckbox}
                            />
                            BUSD
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                type="radio"
                                name={"currency"}
                                onChange={() => onChangeAcceptCurrency('ETH')}
                                defaultChecked={upcomingIDOInfo.accept_currency === 'ETH'}
                                className={classes.formControlCheckbox}
                            />
                            ETH
                        </label>
                    </div>
                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Price per token</label>
                        <input
                            type="number"
                            placeholder={'Token price'}
                            defaultValue={upcomingIDOInfo.token_price}
                            onChange={onChangeTokenPrice}
                            className={classes.formControlInput}
                        />
                    </div>
                </div>
            </div>
    )
}

export default UpcomingIDO;
