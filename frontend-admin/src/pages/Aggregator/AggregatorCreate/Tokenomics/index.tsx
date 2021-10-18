import React, { useState, useEffect } from 'react'
import useStyles from './style';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {renderErrorCreateAggregator} from "../../../../utils/validate";

const Tokenomics: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const { register, errors, gameDetails, onChangeTokenomics } = props
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

    const [tokenomics, setTokenomics] = useState({
        ticker: gameDetails?.ticker,
        network_chain: gameDetails?.network_chain,
        token_supply: gameDetails?.token_supply,
        project_valuation: gameDetails?.project_valuation,
        initial_token_cir: gameDetails?.initial_token_cir,
        initial_token_market: gameDetails?.initial_token_market,
        token_utilities: gameDetails?.token_utilities,
        token_economy: gameDetails?.token_economy,
        token_metrics: gameDetails?.token_metrics,
        token_distribution: gameDetails?.token_distribution,
        token_release: gameDetails?.token_release,
    });

    if (tokenomics) {
        onChangeTokenomics(tokenomics)
    }

    const onChangeTicker = (event: any) => {
        let newData = {...tokenomics}
        newData.ticker = event.target.value
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeNetwork = (event: any) => {
        let newData = {...tokenomics}
        newData.network_chain = event.target.value
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenSupply = (event: any) => {
        let newData = {...tokenomics}
        newData.token_supply = event.target.value
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenCirculation = (event: any) => {
        let newData = {...tokenomics}
        newData.initial_token_cir = event.target.value
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenMarket = (event: any) => {
        let newData = {...tokenomics}
        newData.initial_token_market = event.target.value
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeProjectValuation = (event: any) => {
        let newData = {...tokenomics}
        newData.project_valuation = event.target.value
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenUtilities = (event: any) => {
        let newData = {...tokenomics}
        newData.token_utilities = event
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenEconomy = (event: any) => {
        let newData = {...tokenomics}
        newData.token_economy = event
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenMetrics = (event: any) => {
        let newData = {...tokenomics}
        newData.token_metrics = event
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenDistribution = (event: any) => {
        let newData = {...tokenomics}
        newData.token_distribution = event
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const onChangeTokenRelease = (event: any) => {
        let newData = {...tokenomics}
        newData.token_release = event
        setTokenomics(newData)
        onChangeTokenomics(newData)
    }
    const renderError = renderErrorCreateAggregator;
    return (
            <div>
                <div className={classes.infoForm}>
                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Ticker</label>
                        <input
                            type="text"
                            name='name'
                            onChange={onChangeTicker}
                            defaultValue={tokenomics.ticker}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Blockchain Network</label>
                        <input
                            type="text"
                            defaultValue={tokenomics.network_chain}
                            onChange={onChangeNetwork}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Token Supply</label>
                        <input
                            type="number"
                            defaultValue={tokenomics.token_supply}
                            onChange={onChangeTokenSupply}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Project Valuation</label>
                        <input
                            type="text"
                            defaultValue={tokenomics.project_valuation}
                            onChange={onChangeProjectValuation}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Initial Token Circulation</label>
                        <input
                            type="number"
                            defaultValue={tokenomics.initial_token_cir}
                            onChange={onChangeTokenCirculation}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControl}>
                        <label className={classes.formControlLabel}>Initial Market Cap</label>
                        <input
                            type="number"
                            defaultValue={tokenomics.initial_token_market}
                            onChange={onChangeTokenMarket}

                            className={classes.formControlInput}
                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Token utilities</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeTokenUtilities}
                            defaultValue={tokenomics.token_utilities}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Token utilities'}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Token Economy</label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            defaultValue={tokenomics.token_economy}
                            onChange={onChangeTokenEconomy}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Token Economy'}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Detailed Token Metrics </label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeTokenMetrics}
                            defaultValue={tokenomics.token_metrics}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Detailed Token Metrics'}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Token Distribution </label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeTokenDistribution}
                            defaultValue={tokenomics.token_distribution}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Token Distribution '}

                        />
                    </div>

                    <div className={classes.formControlFull}>
                        <label className={classes.formControlLabel}>Token Release Schedule </label>
                        <ReactQuill
                            className={classes.textEditor}
                            theme="snow"
                            onChange={onChangeTokenRelease}
                            defaultValue={tokenomics.token_release}
                            modules={modules}
                            formats={formats}
                            placeholder={'Enter Detailed Token Metrics'}

                        />
                    </div>
                </div>
            </div>
    )
}

export default Tokenomics;
