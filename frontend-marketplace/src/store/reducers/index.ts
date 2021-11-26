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
import { hotCollectionReducer, listOfferReducer, itemsCollectionReducer, activitiesCollectionReducer } from './marketplace';
import { projectInforsReducer, itemsProjectCollectionsReducer, activitiesProjectCollectionsReducer } from './project-collection';
import { currenciesReducer } from './currency';
import { tokenInforsReducer } from './tokenInfors';

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
  listOffer: listOfferReducer,
  projectInfors: projectInforsReducer,
  itemsProjectCollection: itemsProjectCollectionsReducer,
  activitiesProjectCollection: activitiesProjectCollectionsReducer,
  currencies: currenciesReducer,
  itemsCollection: itemsCollectionReducer,
  activitiesCollection: activitiesCollectionReducer,
  tokenInfors: tokenInforsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
