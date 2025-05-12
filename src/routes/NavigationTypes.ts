export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: {
    email: string;
  };
  ResetPassword: {
    email: string;
    code: string;
  };
  PasswordChanged: undefined;
  Splash: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  UserProfile: undefined;
  Profile: undefined;
  HealthData: undefined;
  Settings: undefined;
  // Diğer ana sayfalar buraya eklenecek
};
