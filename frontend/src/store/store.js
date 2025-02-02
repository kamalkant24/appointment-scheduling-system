import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../state/authSlice';
import dataReducer from '../state/dataSlice';

const store = configureStore({
    reducer: {
        users: authSlice,
        data: dataReducer
    }
});

export default store;
