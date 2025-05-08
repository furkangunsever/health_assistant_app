import {User} from 'firebase/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
  displayName?: string;
}

export interface ProfileUpdateData {
  displayName: string;
  photoURL?: string;
}

export interface PasswordResetData {
  code: string;
  newPassword: string;
}

// Serialize edilebilir kullanıcı tipi
export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SerializableUser | null;
  error: string | null;
  emailVerified: boolean;
  emailSent: boolean;
}
