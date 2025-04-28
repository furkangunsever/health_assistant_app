export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyCode: {email: string};
  ResetPassword: {email: string; code: string};
  PasswordChanged: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  // Diğer ana sayfalar buraya eklenecek
};
