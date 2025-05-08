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
  emailVerificationSent,
} from '../slices/authSlice';
import {
  signIn,
  signUp,
  signOut,
  sendPasswordResetEmail,
  signInWithGoogle,
  updateUserProfile,
  sendEmailVerification,
  confirmPasswordReset,
} from '../../service/firebaseService';
import {RegisterCredentials} from '../../types/auth.types';

// Login action
export const login = createAsyncThunk(
  'auth/login',
  async ({email, password}: {email: string; password: string}, {dispatch}) => {
    try {
      dispatch(loginStart());
      const user = await signIn(email, password);

      // Kullanıcı nesnesini serialize edilebilir bir yapıya dönüştür
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        metadata: {
          creationTime: user.metadata?.creationTime,
          lastSignInTime: user.metadata?.lastSignInTime,
        },
      };

      dispatch(loginSuccess(serializableUser as any));
      return serializableUser;
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  },
);

// Google ile giriş action
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, {dispatch}) => {
    try {
      dispatch(loginStart());
      const user = await signInWithGoogle();

      // Kullanıcı nesnesini serialize edilebilir bir yapıya dönüştür
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        metadata: {
          creationTime: user.metadata?.creationTime,
          lastSignInTime: user.metadata?.lastSignInTime,
        },
      };

      dispatch(loginSuccess(serializableUser as any));
      return serializableUser;
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  },
);

// Register action
export const register = createAsyncThunk(
  'auth/register',
  async ({email, password, displayName}: RegisterCredentials, {dispatch}) => {
    try {
      dispatch(registerStart());
      const user = await signUp(email, password);

      // Kullanıcı profil bilgilerini güncelle (displayName varsa)
      if (displayName && user) {
        await updateUserProfile(displayName);
      }

      // Doğrulama e-postası gönder - daha açık loglama ile
      try {
        console.log('E-posta doğrulama bağlantısı gönderiliyor...');
        await sendEmailVerification();
        console.log('E-posta doğrulama bağlantısı gönderildi!');
        dispatch(emailVerificationSent());
      } catch (verifyError: any) {
        console.error(
          'E-posta doğrulama bağlantısı gönderilemedi:',
          verifyError.message,
        );
        // E-posta gönderimi başarısız olsa bile kullanıcı kaydı tamamlandı,
        // bu nedenle hatayı fırlatmak yerine sadece logla
      }

      // Kullanıcı nesnesini serialize edilebilir bir yapıya dönüştür
      const serializableUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        metadata: {
          creationTime: user.metadata?.creationTime,
          lastSignInTime: user.metadata?.lastSignInTime,
        },
      };

      dispatch(registerSuccess(serializableUser as any));

      // Kullanıcı kaydedildi, ancak e-posta doğrulaması olmadığı için AuthStack'e yönlendirilecek
      return serializableUser;
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

// Şifre sıfırlama action
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, {dispatch}) => {
    try {
      dispatch(resetPasswordAction());
      await sendPasswordResetEmail(email);
      dispatch(resetPasswordSuccess());
    } catch (error: any) {
      dispatch(resetPasswordFailure(error.message));
      throw error;
    }
  },
);

// Kullanıcı profili güncelleme action
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    {displayName, photoURL}: {displayName: string; photoURL?: string},
    {dispatch},
  ) => {
    try {
      await updateUserProfile(displayName, photoURL);
      // Profil güncellemesi başarılı olduğunda auth state değiştiği için
      // otomatik olarak Redux store güncellenecek (AppNavigator useEffect içinde)
    } catch (error: any) {
      console.error('Profil güncellenirken hata oluştu:', error);
      throw error;
    }
  },
);

// E-posta doğrulama action
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (_, {dispatch}) => {
    try {
      await sendEmailVerification();
      dispatch(emailVerificationSent());
      return true;
    } catch (error: any) {
      console.error(
        'E-posta doğrulama bağlantısı gönderilirken hata oluştu:',
        error,
      );
      throw error;
    }
  },
);

// Doğrulama kodu ile şifre sıfırlama action
export const resetPasswordWithCode = createAsyncThunk(
  'auth/resetPasswordWithCode',
  async (
    {code, newPassword}: {code: string; newPassword: string},
    {dispatch},
  ) => {
    try {
      dispatch(resetPasswordAction());
      await confirmPasswordReset(code, newPassword);
      dispatch(resetPasswordSuccess());
    } catch (error: any) {
      dispatch(resetPasswordFailure(error.message));
      throw error;
    }
  },
);
