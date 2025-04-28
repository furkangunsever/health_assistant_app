// Mock Firebase servisi - Gerçek Firebase entegrasyonu ileride eklenecek

// Basit bir kullanıcı mock yapısı
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

// Firebase yerine kullanılacak mock servis
const mockAuth = {
  currentUser: null as User | null,

  // Mock kullanıcı veritabanı
  users: [
    {uid: '1', email: 'test@example.com', password: '123456'},
    {uid: '2', email: 'user@example.com', password: '123456'},
  ],

  // Kullanıcı giriş işlemi simulasyonu
  signInWithEmailAndPassword: async (email: string, password: string) => {
    const user = mockAuth.users.find(
      u => u.email === email && u.password === password,
    );

    if (user) {
      const {password, ...userData} = user;
      mockAuth.currentUser = userData;
      return {user: userData};
    } else {
      throw new Error('Geçersiz e-posta veya şifre');
    }
  },

  // Kullanıcı kayıt işlemi simulasyonu
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    const existingUser = mockAuth.users.find(u => u.email === email);

    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanılıyor');
    }

    const newUser = {
      uid: `${mockAuth.users.length + 1}`,
      email,
      password,
    };

    mockAuth.users.push(newUser);
    const {password: _, ...userData} = newUser;
    mockAuth.currentUser = userData;

    return {user: userData};
  },

  // Şifre sıfırlama e-postası gönderme simulasyonu
  sendPasswordResetEmail: async (email: string) => {
    const user = mockAuth.users.find(u => u.email === email);

    if (!user) {
      throw new Error('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı');
    }

    // Başarılı - gerçek uygulamada e-posta gönderir
    return true;
  },

  // Çıkış işlemi
  signOut: async () => {
    mockAuth.currentUser = null;
    return true;
  },

  // Kimlik değişim dinleyicisi
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    // Mock listener - gerçek uygulamada Firebase Auth state değişimlerini dinler
    callback(mockAuth.currentUser);

    // Gerçek dinleyicilerde olduğu gibi, unsubscribe fonksiyonu döndürür
    return () => {};
  },
};

export default {auth: mockAuth};
