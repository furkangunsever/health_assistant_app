import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  logout as logoutAction,
  resetPassword as resetPasswordAction,
  resetPasswordSuccess,
  resetPasswordFailure,
} from '../slices/authSlice';
import {
  signIn,
  signUp,
  signOut,
  resetPassword,
} from '../../service/firebaseService';

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}: {email: string; password: string}, {dispatch}) => {
    try {
      dispatch(loginStart());
      const user = await signIn(email, password);
      dispatch(loginSuccess(user));
      return user;
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  },
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async ({email, password}: {email: string; password: string}, {dispatch}) => {
    try {
      dispatch(registerStart());
      const user = await signUp(email, password);
      dispatch(registerSuccess(user));
      return user;
    } catch (error: any) {
      dispatch(registerFailure(error.message));
      throw error;
    }
  },
);

// Logout action
export const logout = createAsyncThunk('auth/logout', async (_, {dispatch}) => {
  try {
    await signOut();
    dispatch(logoutAction());
  } catch (error: any) {
    console.error('Çıkış yapılırken hata oluştu:', error);
    throw error;
  }
});

// Forgot password action
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, {dispatch}) => {
    try {
      dispatch(resetPasswordAction());
      await resetPassword(email);
      dispatch(resetPasswordSuccess());
    } catch (error: any) {
      dispatch(resetPasswordFailure(error.message));
      throw error;
    }
  },
);
