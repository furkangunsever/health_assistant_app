import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import digitalTwinReducer from './slices/digitalTwinSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    digitalTwin: digitalTwinReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
