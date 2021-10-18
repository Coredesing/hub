import React, { useState, useEffect } from 'react'
import useStyles from './style';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {renderErrorCreateAggregator} from "../../../../utils/validate";

const ProjectInformation: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const { register, errors, gameDetails, onChangeProjectInfo } = props
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

    const [projectInfo, setProjectInfo] = useState({
        roadmap: gameDetails?.roadmap,
        technologist: gameDetails?.technologist,
        investors: gameDetails?.investors,
        official_website: gameDetails?.official_website,
        discord_link: gameDetails?.discord_link,
        official_telegram_link: gameDetails?.official_telegram_link,
        twitter_link: gameDetails?.twitter_link,
        facebook_link: gameDetails?.facebook_link,
        youtube_link: gameDetails?.youtube_link,
        twitch_link: gameDetails?.twitch_link,
        tiktok_link: gameDetails?.tiktok_link,
        reddit_link: gameDetails?.reddit_link,
        instagram_link: gameDetails?.instagram_link,
    });
    const onChangeRoadmap = (event: any) => {
        let newData = {...projectInfo}
        newData.roadmap = event
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeTechnologist = (event: any) => {
        let newData = {...projectInfo}
        newData.technologist = event
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeInvestors = (event: any) => {
        let newData = {...projectInfo}
        newData.investors = event
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeOfficialWebsite = (event: any) => {
        let newData = {...projectInfo}
        newData.official_website = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeDiscordLink = (event: any) => {
        let newData = {...projectInfo}
        newData.discord_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeOfficialTelegram = (event: any) => {
        let newData = {...projectInfo}
        newData.official_telegram_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeTwitterLink = (event: any) => {
        let newData = {...projectInfo}
        newData.twitter_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeFacebookLink = (event: any) => {
        let newData = {...projectInfo}
        newData.facebook_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeYoutubeLink = (event: any) => {
        let newData = {...projectInfo}
        newData.youtube_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeTwitchLink = (event: any) => {
        let newData = {...projectInfo}
        newData.twitch_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeTikTokLink = (event: any) => {
        let newData = {...projectInfo}
        newData.tiktok_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeRedditLink = (event: any) => {
        let newData = {...projectInfo}
        newData.reddit_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }
    const onChangeInstagramLink = (event: any) => {
        let newData = {...projectInfo}
        newData.instagram_link = event.target.value
        setProjectInfo(newData)
        onChangeProjectInfo(newData)
    }

    return (
            <div>
                <div className={classes.infoForm}>
                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Product Roadmap</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeRoadmap}
                            defaultValue={projectInfo.roadmap}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Product Roadmap'}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Technologist & Team (Required)</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            defaultValue={projectInfo.technologist}
                            onChange={onChangeTechnologist}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Technologist & Team'}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Investors</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeInvestors}
                            defaultValue={projectInfo.investors}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Investors'}

                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Official Website</label>
                        <input
                            type="text"
                            onChange={onChangeOfficialWebsite}
                            defaultValue={projectInfo.official_website}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Discord Server Link:</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.discord_link}
                            onChange={onChangeDiscordLink}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Official Telegram Group Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.official_telegram_link}
                            onChange={onChangeOfficialTelegram}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Twitter Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.twitter_link}
                            onChange={onChangeTwitterLink}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Facebook Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.facebook_link}
                            onChange={onChangeFacebookLink}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Youtube Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.youtube_link}
                            onChange={onChangeYoutubeLink}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Twitch Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.twitch_link}
                            onChange={onChangeTwitchLink}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Tiktok Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.tiktok_link}
                            onChange={onChangeTikTokLink}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Reddit Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.reddit_link}
                            onChange={onChangeRedditLink}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Instagram Link</label>
                        <input
                            type="text"
                            defaultValue={projectInfo.instagram_link}
                            onChange={onChangeInstagramLink}

                            className={classes.formControlInput}
                        />
                    </div>

                </div>
            </div>
    )
}

export default ProjectInformation;
