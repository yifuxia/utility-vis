import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'
import App from './containers/App';

const middleware = [thunk, logger()]

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)
window.store = store

ReactDOM.render(
	<Provider store={store}>
    	<App />
    </Provider>, 
    document.getElementById('app')
)