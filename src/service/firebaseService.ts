import mockAuth from '../config/firebase';
import {User} from '../config/firebase';

const auth = mockAuth.auth;

// Giriş işlemi
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Kayıt işlemi
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Çıkış işlemi
export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Şifre sıfırlama
export const resetPassword = async (email: string) => {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Kullanıcı kontrol
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return auth.onAuthStateChanged(callback);
};
