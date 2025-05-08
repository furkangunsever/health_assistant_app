import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, SerializableUser} from '../../types/auth.types';
import {User} from 'firebase/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  emailVerified: false,
  emailSent: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<SerializableUser>) => {
      state.isLoading = false;
      state.isAuthenticated = action.payload.emailVerified;
      state.user = action.payload;
      state.emailVerified = action.payload.emailVerified;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<SerializableUser>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = action.payload;
      state.emailVerified = false;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    emailVerificationSent: state => {
      state.emailSent = true;
    },
    emailVerified: state => {
      if (state.user) {
        state.emailVerified = true;
        state.isAuthenticated = true;
      }
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.emailVerified = false;
      state.emailSent = false;
    },
    resetPassword: state => {
      state.isLoading = true;
      state.error = null;
    },
    resetPasswordSuccess: state => {
      state.isLoading = false;
      state.error = null;
    },
    resetPasswordFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  emailVerificationSent,
  emailVerified,
  logout,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordFailure,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
