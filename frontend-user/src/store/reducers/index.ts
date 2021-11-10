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
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
