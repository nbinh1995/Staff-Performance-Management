import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../reducers';
import logger from 'redux-logger';
const configs = {
    reducer: rootReducer,
};

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    configs.middleware = (getDefaultMiddleware) => getDefaultMiddleware().concat(logger);
}

export const store = configureStore(configs);
