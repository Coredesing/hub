import { combineReducers } from 'redux';
import {
  campaignsReducer,
} from './campaign'
import { alertReducer, getTypeIsPushNotiReducer } from './alert'
import userReducer from './user';
import { balanceReducer } from './balance';
import { appNetworkReducer, connectorReducer } from './appNetwork';
import { walletReducer } from './wallet';
import {
  getTiersReducer,
  getUserTierReducer,
  getUserInfoReducer,
  ratesReducer,
  getDelayTiersReducer,
} from './sota-tiers'
import { messageReducer } from './message';
import {claimUserInfoReducer} from "./claim-user-info";
import { assetsAccountReducer } from './asset-account';
import { hotCollectionReducer, bigOfferReducer } from './marketplace';
import { projectInforsReducer, itemsProjectCollectionsReducer, activitiesProjectCollectionsReducer } from './project-collection';

const rootReducer = combineReducers({
  user: userReducer,
  campaigns: campaignsReducer,
  claimUserInfo: claimUserInfoReducer,
  balance: balanceReducer,
  alert: alertReducer,
  appNetwork: appNetworkReducer,
  connector: connectorReducer,
  wallet: walletReducer,
  tiers: getTiersReducer,
  userTier: getUserTierReducer,
  userInfo: getUserInfoReducer,
  rates: ratesReducer,
  messages: messageReducer,
  alertTypeIsPush: getTypeIsPushNotiReducer,
  delayTiers: getDelayTiersReducer,
  assetsAccount: assetsAccountReducer,
  hotCollections: hotCollectionReducer,
  bigOffers: bigOfferReducer,
  projectInfors: projectInforsReducer,
  itemsProjectCollection: itemsProjectCollectionsReducer,
  activitiesProjectCollection: activitiesProjectCollectionsReducer,
  
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
