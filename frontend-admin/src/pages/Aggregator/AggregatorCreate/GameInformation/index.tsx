import React, { useState, useEffect } from 'react'
import useStyles from './style';
import Creatable  from 'react-select/creatable';
import { components  } from 'react-select'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import CreatableSelect from "react-select/creatable";

const GameInformation: React.FC<any> = (props: any) => {
    const classes = useStyles();
    let { gameDetails, onChangeGameInfo, isEdit } = props
    const [gameInfo, setGameInfo] = useState({...props.gameDetails});
    useEffect(() => {
        if (!isEdit) {
            return
        }
        if (
            (!gameInfo?.system_require && !!gameDetails?.system_require) ||
            (!gameInfo?.game_intro && !!gameDetails?.game_intro) ||
            (!gameInfo?.short_description && !!gameDetails?.short_description) ||
            (!gameInfo?.game_features && !!gameDetails?.game_features) ||
            (!gameInfo?.game_name && !!gameDetails?.game_name) ||
            (!gameInfo?.developer && !!gameDetails?.developer) ||
            (!gameInfo?.category && !!gameDetails?.category) ||
            (!gameInfo?.language && !!gameDetails?.language) ||
            (!gameInfo?.hashtags && !!gameDetails?.hashtags)
        ) {
            setGameInfo(gameDetails)
        }
    }, [props])
    const categories = [
        { value: 'Action', label: 'Action' },
        { value: 'Adventure', label: 'Adventure' },
        { value: 'Card', label: 'Card' },
        { value: 'Metaverse', label: 'Metaverse' },
        { value: 'MMORPG', label: 'MMORPG' },
        { value: 'Puzzle', label: 'Puzzle' },
        { value: 'Racing', label: 'Racing' },
        { value: 'Role Playing', label: 'Role Playing' },
        { value: 'Simulation', label: 'Simulation' },
        { value: 'Strategy', label: 'Strategy' },
        { value: 'Real-Time Strategy', label: 'Real-Time Strategy' },
        { value: 'Turn-Based Strategy', label: 'Turn-Based Strategy' },
        { value: 'Others', label: 'Others' }
        ]
    const isValidNewOption = (inputValue:any, selectValue:any) =>
        inputValue.length > 0 && selectValue.length < 3;
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
    const Menu = (props: any) => {
        const optionSelectedLength = props.getValue().length || 0;
        return (
            <components.Menu {...props}>
                {optionSelectedLength < 3 ? (
                    props.children
                ) : (
                    <div style={{ margin: 15 }}>Max limit achieved</div>
                )}
            </components.Menu>
        );
    };
    const customStyles = {
        noOptionsMessage: () => ({
            display: 'none',
        }),
        menu: () => ({
            display: 'none'
        }),
        dropdownIndicator: () => ({
            display: 'none'
        }),
        indicatorSeparator: () => ({
            display: 'none'
        })
    }

    const onChangeName = (event: any) => {
        let newData = {...gameInfo}
        newData.game_name = event.target.value
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeDevelop = (event: any) => {
        let newData = {...gameInfo}
        newData.developer = event.target.value
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeLanguage = (event: any) => {
        let newData = {...gameInfo}
        newData.language = event.target.value
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeCategory = (event: any) => {
        console.log(event)
        let newData = {...gameInfo}
        const buff = event.map((data:any) => data.value )
        newData.category = buff.join(',')
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeHashtags = (event: any) => {
        console.log(event)
        let newData = {...gameInfo}
        const buff = event.map((data:any) => data.value )
        newData.hashtags = buff.join(',')
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeDescription = (event: any) => {
        let newData = {...gameInfo}
        newData.short_description = event.target.value
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeSystemRequire = (event: any) => {
        let newData = {...gameInfo}
        console.log(event)
        newData.system_require = event
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeGameIntro = (event: any) => {
        let newData = {...gameInfo}
        newData.game_intro = event
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    const onChangeGameFeature = (event: any) => {
        let newData = {...gameInfo}
        newData.game_features = event
        setGameInfo(newData)
        onChangeGameInfo(newData)
    }
    return (
            <div>
                <div className={classes.infoForm}>
                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Name of Game</label>
                        <input
                            type="text"
                            name='name'
                            onChange={onChangeName}
                            defaultValue={gameInfo?.game_name}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Developer</label>
                        <input
                            type="text"
                            defaultValue={gameInfo?.developer}
                            onChange={onChangeDevelop}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Category</label>
                        <Creatable
                            className={classes.formSelect}
                            components={{ Menu }}
                            options={categories}
                            onChange={onChangeCategory}
                            value={gameInfo?.category ? gameInfo.category.split(',').map((tx:any) => {return {value: tx, label: tx}}) : ''}
                            isValidNewOption={isValidNewOption}

                            isMulti={true}/>
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Language</label>
                        <input
                            type="text"
                            name='language'
                            onChange={onChangeLanguage}
                            defaultValue={gameInfo?.language}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Hashtags</label>
                        <CreatableSelect
                            isMulti
                            value={gameInfo?.hashtags ? gameInfo.hashtags.split(',').map((tx:any) => {return {value: tx, label: tx}}) : ''}
                            onChange={onChangeHashtags}
                            styles={customStyles}
                            placeholder={"Input new tags then Enter"}

                            options={[]}
                        />
                    </div>

                    <div className={classes.formControlFullWidth}>
                        <label className={classes.formControlLabel}>Short Description</label>
                        <input
                            type="text"
                            onChange={onChangeDescription}
                            defaultValue={gameInfo?.short_description}
                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>System Requirements</label>
                        <ReactQuill

                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeSystemRequire}
                            value={gameInfo?.system_require ? gameInfo.system_require : '' }
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter System Requirements'}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Introduction about the game</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            value={gameInfo?.game_intro ? gameInfo.game_intro : ''}
                            onChange={onChangeGameIntro}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Introduction about the game'}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Game Features</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeGameFeature}
                            value={gameInfo?.game_features ? gameInfo.game_features : ''}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Game Features'}
                        />
                    </div>
                </div>
            </div>
    )
}

export default GameInformation;
