import React, { useState, useEffect } from 'react'
import useStyles from './style';
import DefaultLayout from "../../../components/Layout/DefaultLayout";
import GameInformation from "./GameInformation";
import {CircularProgress} from "@material-ui/core";
import { useTabs, TabPanel } from "react-headless-tabs"
import {TabSelector} from "./TabSelector";
import Tokenomics from "./Tokenomics";
import ProjectInformation from "./ProjectInformation";
import DisplaySettings from "./DisplaySettings";
import UpcomingIDO from "./UpcomingIDO";
import {useDispatch, useSelector} from "react-redux";
import {
    addAggregator,
    getAggregator,
    getProjectInfo,
    getTokenomic,
    updateAggregator
} from "../../../store/actions/aggregator";

// @ts-ignore
const AggregatorCreate: React.FC<any> = (props: any) => {
    const classes = useStyles();
    const [ isReady, setIsReady] = useState(true);
    const dispatch = useDispatch();
    const { match } = props;
    const itemID = match.params.id;
    const isEdit = !!itemID
    const [selectedTab, setSelectedTab] = useTabs([
        'game_info',
        'tokenomics',
        'project_info',
        'display',
        'upcoming'
    ], 'game_info')
    const handleGameCreateUpdate = () => {
        if (!isEdit) {
            const gameData = {
                gameInfo,
                displaySettings,
                upcomingIdo
            }
            dispatch(addAggregator(gameData, tokenomics, projectInfo))
        } else {
            const gameData = {
                gameInfo,
                displaySettings,
                upcomingIdo
            }
            dispatch(updateAggregator(itemID, gameData, tokenomics, projectInfo))
        }

    }
    const [ gameInfo, setGameinfo] = useState({});
    const [ tokenomics, setTokenomics] = useState({});
    const [ projectInfo, setProjectInfo] = useState({});
    const [ displaySettings, setDisplaySettings] = useState({});
    const [ upcomingIdo, setUpcomingIdo] = useState({});
    const { game_info } = useSelector(( state: any ) => state.game_info)
    const { tokenomic } = useSelector(( state: any ) => state.tokenomic)
    const { project_info } = useSelector(( state: any ) => state.project_info)
    useEffect(() => {
        loadEditItem();
    }, []);
    const loadEditItem = () => {
        if (isEdit) {
            if (!itemID) {
                return
            }
            dispatch(getAggregator(itemID))
            dispatch(getTokenomic(itemID))
            dispatch(getProjectInfo(itemID))
        }
    }

    const onChangeGameInfo = (data: any) => {
        setGameinfo(data)
    }
    const onChangeTokenomics = (data:any) => {
        setTokenomics(data)
    }
    const onChangeProjectInfo = (data:any) => {
        setProjectInfo(data)
    }
    const onChangeDisplaySettings = (data:any) => {
        setDisplaySettings(data)
    }
    const onChangeUpcomingIDO = (data:any) => {
        setUpcomingIdo(data)
    }
    return (
        <DefaultLayout>
            <div className={classes.infoBox}>
            <nav className={classes.tabsHeader}>
                <TabSelector
                    isActive={selectedTab === 'game_info'}
                    onClick={() => setSelectedTab('game_info')}
                >
                    GAME INFORMATION
                </TabSelector>
                <TabSelector
                    isActive={selectedTab === 'tokenomics'}
                    onClick={() => setSelectedTab('tokenomics')}
                >
                    TOKENOMICS
                </TabSelector>
                <TabSelector
                    isActive={selectedTab === 'project_info'}
                    onClick={() => setSelectedTab('project_info')}
                >
                    PROJECT INFORMATION
                </TabSelector>
                <TabSelector
                    isActive={selectedTab === 'display'}
                    onClick={() => setSelectedTab('display')}
                >
                    DISPLAY SETTINGS
                </TabSelector>
                <TabSelector
                    isActive={selectedTab === 'upcoming'}
                    onClick={() => setSelectedTab('upcoming')}
                >
                    UPCOMING IDOS
                </TabSelector>
            </nav>
            <TabPanel hidden={selectedTab !== "game_info"}>
            <GameInformation
                gameDetails={game_info.data}
                isEdit={isEdit}
                onChangeGameInfo={onChangeGameInfo}
            >/</GameInformation>
            </TabPanel>
            <TabPanel hidden={selectedTab !== "tokenomics"}>
                <Tokenomics
                    gameDetails={tokenomic.data}
                    isEdit={isEdit}
                    onChangeTokenomics={onChangeTokenomics}
                >/</Tokenomics>
            </TabPanel>
                <TabPanel hidden={selectedTab !== "project_info"}>
                    <ProjectInformation
                        gameDetails={project_info.data}
                        isEdit={isEdit}
                        onChangeProjectInfo={onChangeProjectInfo}
                    >/</ProjectInformation>
                </TabPanel>
                <TabPanel hidden={selectedTab !== "display"}>
                    <DisplaySettings
                        gameDetails={game_info.data}
                        isEdit={isEdit}
                        onChangeDisplaySettings={onChangeDisplaySettings}
                    >/</DisplaySettings>
                </TabPanel>
                <TabPanel hidden={selectedTab !== "upcoming"}>
                    <UpcomingIDO
                        gameDetails={game_info.data}
                        isEdit={isEdit}
                        onChangeUpcomingIDO={onChangeUpcomingIDO}
                    >/</UpcomingIDO>
                </TabPanel>
            <button
                disabled={!isReady}
                className={classes.formButtonUpdatePool}
                onClick={handleGameCreateUpdate}
            >
                {
                    (!isReady) ? <CircularProgress size={25} /> : (isEdit ? 'Update' : 'Create')
                }
            </button>
            </div>
        </DefaultLayout>
    )
}

export default AggregatorCreate;
