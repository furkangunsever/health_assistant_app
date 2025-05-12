import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import firebaseConfig from '../config/firebase.config';
import {UserProfileData} from '../types/auth.types';
import {getAuth} from 'firebase/auth';

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Kullanıcı koleksiyonunu tanımla
const USERS_COLLECTION = 'users';
const PROFILES_COLLECTION = 'profiles';

// Kullanıcı profil verilerini kaydetme
export const saveUserProfile = async (
  userId: string,
  profileData: UserProfileData,
): Promise<void> => {
  try {
    // Profil dokümanı referansı
    const profileRef = doc(db, PROFILES_COLLECTION, userId);

    // Profil verisini kaydet
    await setDoc(profileRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });

    console.log('Profil verisi başarıyla kaydedildi');
  } catch (error: any) {
    console.error('Profil kaydetme hatası:', error);
    throw new Error(`Profil kaydedilemedi: ${error.message}`);
  }
};

// Kullanıcı profil verilerini getirme
export const getUserProfile = async (
  userId: string,
): Promise<UserProfileData | null> => {
  try {
    // Profil dokümanı referansı
    const profileRef = doc(db, PROFILES_COLLECTION, userId);

    // Profil verisini getir
    const profileSnapshot = await getDoc(profileRef);

    if (profileSnapshot.exists()) {
      // Profil verisi varsa döndür
      const profileData = profileSnapshot.data() as UserProfileData;
      return profileData;
    }

    // Profil verisi yoksa null döndür
    return null;
  } catch (error: any) {
    console.error('Profil getirme hatası:', error);
    throw new Error(`Profil getirilemedi: ${error.message}`);
  }
};

// Kullanıcı profil verilerini güncelleme
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfileData>,
): Promise<void> => {
  try {
    // Profil dokümanı referansı
    const profileRef = doc(db, PROFILES_COLLECTION, userId);

    // Profil verisini güncelle
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: new Date().toISOString(),
    });

    console.log('Profil verisi başarıyla güncellendi');
  } catch (error: any) {
    console.error('Profil güncelleme hatası:', error);
    throw new Error(`Profil güncellenemedi: ${error.message}`);
  }
};

// Mevcut kullanıcının profil verilerini kaydetme
export const saveCurrentUserProfile = async (
  profileData: UserProfileData,
): Promise<void> => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error('Kullanıcı oturum açmamış');
  }

  await saveUserProfile(currentUser.uid, profileData);
};

// Mevcut kullanıcının profil verilerini getirme
export const getCurrentUserProfile =
  async (): Promise<UserProfileData | null> => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error('Kullanıcı oturum açmamış');
    }

    return getUserProfile(currentUser.uid);
  };

export default {
  saveUserProfile,
  getUserProfile,
  updateUserProfile,
  saveCurrentUserProfile,
  getCurrentUserProfile,
};
