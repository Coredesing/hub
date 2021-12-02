import { combineReducers } from 'redux';
import { alertReducer, getTypeIsPushNotiReducer } from './alert'
import { appNetworkReducer, connectorReducer } from './appNetwork';
import { walletReducer } from './wallet';
import { messageReducer } from './message';
import { assetsAccountReducer, listOffersAccountReducer, listingsAccountReducer } from './inventory';
import { listCollectionReducer, listOfferReducer, itemsCollectionReducer, activitiesCollectionReducer } from './marketplace';
import { projectInforsReducer, itemsProjectCollectionsReducer, activitiesProjectCollectionsReducer } from './project-collection';
import { currenciesReducer } from './currency';
import { tokenInforsReducer } from './tokenInfors';

const rootReducer = combineReducers({
  alert: alertReducer,
  appNetwork: appNetworkReducer,
  connector: connectorReducer,
  wallet: walletReducer,
  messages: messageReducer,
  alertTypeIsPush: getTypeIsPushNotiReducer,
  assetsAccount: assetsAccountReducer,
  listOffersAccount: listOffersAccountReducer,
  listingsAccount: listingsAccountReducer,
  listCollection: listCollectionReducer,
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
