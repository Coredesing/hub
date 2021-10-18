import React, { useState, useEffect } from 'react'
import useStyles from './style';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {renderErrorCreateAggregator} from "../../../../utils/validate";

const DisplaySettings: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const { register, errors, gameDetails, onChangeDisplaySettings } = props
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    }
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const [displaySettings, setDisplaySettings] = useState({
        intro_video: gameDetails?.intro_video,
        upload_video: gameDetails?.upload_video,
        screen_shots_1: gameDetails?.screen_shots_1,
        screen_shots_2: gameDetails?.screen_shots_2,
        screen_shots_3: gameDetails?.screen_shots_3,
        screen_shots_4: gameDetails?.screen_shots_4,
        screen_shots_5: gameDetails?.screen_shots_5,
        game_pc_link: gameDetails?.game_pc_link,
        ios_link: gameDetails?.ios_link,
        android_link: gameDetails?.android_link,
        web_game_link: gameDetails?.web_game_link,
        display_area: gameDetails?.display_area,
        verified: gameDetails?.verified,
        top_favourite_link: gameDetails?.top_favourite_link,
    });
    const onChangeIntroVideo = (event: any) => {
        let newData = {...displaySettings}
        newData.intro_video = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeUploadVideo = (event: any) => {
        let newData = {...displaySettings}
        newData.upload_video = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeScreenShots1 = (event: any) => {
        let newData = {...displaySettings}
        newData.screen_shots_1 = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeScreenShots2 = (event: any) => {
        let newData = {...displaySettings}
        newData.screen_shots_2 = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeScreenShots3 = (event: any) => {
        let newData = {...displaySettings}
        newData.screen_shots_3 = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeScreenShots4 = (event: any) => {
        let newData = {...displaySettings}
        newData.screen_shots_4 = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeScreenShots5 = (event: any) => {
        let newData = {...displaySettings}
        newData.screen_shots_5 = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeGamePC = (event: any) => {
        let newData = {...displaySettings}
        newData.game_pc_link = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeIosLink = (event: any) => {
        let newData = {...displaySettings}
        newData.ios_link = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeAndroidLink = (event: any) => {
        let newData = {...displaySettings}
        newData.android_link = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeWebLink = (event: any) => {
        let newData = {...displaySettings}
        newData.web_game_link = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeDisplayArea = (event: any) => {
        let newData = {...displaySettings}
        if (!newData?.display_area) {
            newData.display_area = event
        } else {
            let oldData = newData.display_area.split(',')
            if (oldData.indexOf(event) > -1) {
                let buffData: any[] = []
                oldData.map((dt: any) => {
                    if (dt !== event) {
                        buffData.push(dt)
                    }
                })
                newData.display_area = buffData.join(',')
            } else {
                oldData.push(event)
                newData.display_area = oldData.join(',')
            }
        }
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeVerified = (event: any) => {
        let newData = {...displaySettings}
        if (!newData?.verified) {
            newData.verified = event
        } else {
            let oldData = newData.verified.split(',')
            if (oldData.indexOf(event) > -1) {
                let buffData: any[] = []
                oldData.map((dt: any) => {
                    if (dt !== event) {
                        buffData.push(dt)
                    }
                })
                newData.verified = buffData.join(',')
            } else {
                oldData.push(event)
                newData.verified = oldData.join(',')
            }
        }
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const onChangeTopFavourite = (event: any) => {
        let newData = {...displaySettings}
        newData.top_favourite_link = event.target.value
        setDisplaySettings(newData)
        onChangeDisplaySettings(newData)
    }
    const renderError = renderErrorCreateAggregator;
    return (
            <div>
                <div className={classes.infoForm}>
                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Game Trailer / Introduction Video</label>
                        <input
                            type="text"
                            onChange={onChangeIntroVideo}
                            defaultValue={displaySettings.intro_video}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Upload Video</label>
                        <button
                            defaultValue={displaySettings.upload_video}
                            //onChange={}
                            className={classes.formControlButton}
                        >Upload Video</button>
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Screenshots / Images of the game</label>
                        <input
                            type="text"
                            placeholder="Image Link 1"
                            defaultValue={displaySettings.screen_shots_1}
                            onChange={onChangeScreenShots1}
                            className={classes.formControlInput}
                        />
                        <input
                            type="text"
                            placeholder="Image Link 2"
                            defaultValue={displaySettings.screen_shots_2}
                            onChange={onChangeScreenShots2}
                            className={classes.formControlInput}
                        />
                        <input
                            type="text"
                            placeholder="Image Link 3"
                            defaultValue={displaySettings.screen_shots_3}
                            onChange={onChangeScreenShots3}
                            className={classes.formControlInput}
                        />
                        <input
                            type="text"
                            placeholder="Image Link 4"
                            defaultValue={displaySettings.screen_shots_4}
                            onChange={onChangeScreenShots4}
                            className={classes.formControlInput}
                        />
                        <input
                            type="text"
                            placeholder="Image Link 5"
                            defaultValue={displaySettings.screen_shots_5}
                            onChange={onChangeScreenShots5}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Download Links</label>
                        <div className={classes.formControlInline}>
                            <label className={classes.formControlLabelInline}>Game PC</label>
                        <input
                            type="text"
                            defaultValue={displaySettings.game_pc_link}
                            onChange={onChangeGamePC}
                            className={classes.formControlInputInline}
                        />
                        </div>
                        <div className={classes.formControlInline}>
                            <label className={classes.formControlLabelInline}>Mobile iOS</label>
                            <input
                                type="text"
                                defaultValue={displaySettings.ios_link}
                                onChange={onChangeIosLink}
                                className={classes.formControlInputInline}
                            />
                        </div>
                        <div className={classes.formControlInline}>
                            <label className={classes.formControlLabelInline}>Mobile Android</label>
                            <input
                                type="text"
                                defaultValue={displaySettings.android_link}
                                onChange={onChangeAndroidLink}
                                className={classes.formControlInputInline}
                            />
                        </div>
                        <div className={classes.formControlInline}>
                            <label className={classes.formControlLabelInline}>Web Game</label>
                            <input
                                type="text"
                                defaultValue={displaySettings.web_game_link}
                                onChange={onChangeWebLink}
                                className={classes.formControlInputInline}
                            />
                        </div>
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Display Area</label>
                        <br/>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                className={classes.formControlCheckbox}
                                type="checkbox"
                                defaultChecked={displaySettings.display_area && displaySettings.display_area.includes('Top Favourite')}
                                onChange={() => onChangeDisplayArea('Top Favourite')} />
                             Top Favourite
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                className={classes.formControlCheckbox}
                                type="checkbox"
                                defaultChecked={displaySettings.display_area && displaySettings.display_area.includes('Trending')}
                                onChange={() => onChangeDisplayArea('Trending')} />
                            Trending
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                className={classes.formControlCheckbox}
                                type="checkbox"
                                defaultChecked={displaySettings.display_area && displaySettings.display_area.includes('Top Game')}
                                onChange={() => onChangeDisplayArea('Top Game')} />
                            Top Game
                        </label>
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Verified by GameFi</label>
                        <br/>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                className={classes.formControlCheckbox}
                                type="checkbox"
                                defaultChecked={displaySettings.verified && displaySettings.verified.includes('Verified')}
                                onChange={() => onChangeVerified('Verified')} />
                            Verified
                        </label>
                        <label className={classes.formControlLabelCheckbox}>
                            <input
                                className={classes.formControlCheckbox}
                                type="checkbox"
                                defaultChecked={displaySettings.verified && displaySettings.verified.includes('Sponsor')}
                                onChange={() => onChangeVerified('Sponsor')} />
                            Sponsor
                        </label>
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Top Favourite</label>
                        <input
                            type="text"
                            placeholder={'Image Link for Top Favourite'}
                            defaultValue={displaySettings.top_favourite_link}
                            onChange={onChangeTopFavourite}
                            className={classes.formControlInput}
                        />
                    </div>
                </div>
            </div>
    )
}

export default DisplaySettings;
