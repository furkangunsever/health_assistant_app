import {initializeApp} from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  onAuthStateChanged as firebaseAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  User,
  UserCredential,
} from 'firebase/auth';
import firebaseConfig from '../config/firebase.config';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Firebase başlatma
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-In yapılandırması
GoogleSignin.configure({
  webClientId: firebaseConfig.clientId, // firebase console web client ID
  offlineAccess: true,
});

// E-posta ve şifre ile giriş
export const signIn = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// E-posta ve şifre ile kayıt
export const signUp = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    console.error('Firebase kayıt hatası:', error);

    // Firebase hata kodlarını Türkçeye çevirme
    let errorMessage = error.message;

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Bu e-posta adresi zaten kullanılmaktadır.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Geçersiz e-posta adresi formatı.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Şifre çok zayıf. En az 6 karakter içermelidir.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage =
        'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'E-posta/şifre girişi bu hesap için etkin değil.';
    }

    throw new Error(errorMessage);
  }
};

// Çıkış işlemi
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Şifre sıfırlama e-postası gönderme
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Auth durumu değişikliğini dinleme
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return firebaseAuthStateChanged(auth, callback);
};

// Google ile giriş - güncellendi
export const signInWithGoogle = async (): Promise<User> => {
  try {
    // Google Sign-In ile oturum açma
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const idToken = await GoogleSignin.getTokens();

    // Google kimlik bilgilerini oluştur
    const googleCredential = GoogleAuthProvider.credential(idToken.idToken);

    // Firebase ile kimlik doğrulama
    const userCredential = await signInWithCredential(auth, googleCredential);
    return userCredential.user;
  } catch (error: any) {
    console.error('Google ile giriş hatası:', error);
    throw new Error(error.message);
  }
};

// Kullanıcı bilgilerini güncelleme
export const updateUserProfile = async (
  displayName: string,
  photoURL?: string,
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await updateProfile(currentUser, {
        displayName,
        photoURL: photoURL || null,
      });
    } else {
      throw new Error('Kullanıcı oturum açmamış');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// E-posta doğrulama bağlantısı gönderme
export const sendEmailVerification = async (): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await firebaseSendEmailVerification(currentUser);
    } else {
      throw new Error('Kullanıcı oturum açmamış');
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Doğrulama kodu ile şifre sıfırlama
export const confirmPasswordReset = async (
  code: string,
  newPassword: string,
): Promise<void> => {
  try {
    await firebaseConfirmPasswordReset(auth, code, newPassword);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default auth;
