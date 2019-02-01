import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { i18nReducer } from 'react-redux-i18n';
import app from './app';
import auth from './auth';
import networkState from './network_state';


// import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

export default (history) => combineReducers({
  router: connectRouter(history),
  app,
  auth,
  networkState,
  routing,
  i18n : i18nReducer
})
