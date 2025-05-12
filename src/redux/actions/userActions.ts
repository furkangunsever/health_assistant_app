import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  saveProfileStart,
  saveProfileSuccess,
  saveProfileFailure,
} from '../slices/userSlice';
import {
  saveUserProfile,
  getUserProfile,
  saveCurrentUserProfile,
  getCurrentUserProfile,
} from '../../service/firestoreService';
import {UserProfileData} from '../../types/auth.types';
import {RootState} from '../store';

// Mevcut kullanıcının profil bilgilerini getirme
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, {dispatch, getState}) => {
    try {
      dispatch(fetchProfileStart());

      // Auth state'ten user id'yi al
      const state = getState() as RootState;
      const userId = state.auth.user?.uid;

      if (!userId) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      // Profil verilerini getir
      const profileData = await getUserProfile(userId);

      if (profileData) {
        dispatch(fetchProfileSuccess(profileData));
        return profileData;
      } else {
        // Profil bulunamadı ama bu bir hata değil, boş profil döndür
        dispatch(fetchProfileSuccess({} as UserProfileData));
        return null;
      }
    } catch (error: any) {
      dispatch(fetchProfileFailure(error.message));
      throw error;
    }
  },
);

// Kullanıcı profil bilgilerini kaydetme
export const saveUserProfileData = createAsyncThunk(
  'user/saveProfile',
  async (profileData: UserProfileData, {dispatch, getState}) => {
    try {
      dispatch(saveProfileStart());

      // Auth state'ten user id'yi al
      const state = getState() as RootState;
      const userId = state.auth.user?.uid;

      if (!userId) {
        throw new Error('Kullanıcı oturum açmamış');
      }

      // Profil verilerini kaydet
      await saveUserProfile(userId, profileData);

      dispatch(saveProfileSuccess(profileData));
      return profileData;
    } catch (error: any) {
      dispatch(saveProfileFailure(error.message));
      throw error;
    }
  },
);

// Mevcut kullanıcının profil bilgilerini kaydetme (userId gerektirmez)
export const saveCurrentUserProfileData = createAsyncThunk(
  'user/saveCurrentProfile',
  async (profileData: UserProfileData, {dispatch}) => {
    try {
      dispatch(saveProfileStart());

      // Mevcut kullanıcının profil verilerini kaydet
      await saveCurrentUserProfile(profileData);

      dispatch(saveProfileSuccess(profileData));
      return profileData;
    } catch (error: any) {
      dispatch(saveProfileFailure(error.message));
      throw error;
    }
  },
);
