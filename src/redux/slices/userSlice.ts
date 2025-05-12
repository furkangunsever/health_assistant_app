import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserProfileData} from '../../types/auth.types';

interface UserState {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    fetchProfileStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<UserProfileData>) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
    },
    fetchProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    saveProfileStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    saveProfileSuccess: (state, action: PayloadAction<UserProfileData>) => {
      state.isLoading = false;
      state.profile = action.payload;
      state.error = null;
    },
    saveProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearProfile: state => {
      state.profile = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
});

export const {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  saveProfileStart,
  saveProfileSuccess,
  saveProfileFailure,
  clearProfile,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
