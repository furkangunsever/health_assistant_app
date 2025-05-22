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
  DigitalTwin: undefined;
  // Diğer ana sayfalar buraya eklenecek
};

// Tab Navigator için tip tanımlamaları
export type TabNavigatorParamList = {
  HomeTab: undefined;
  CalendarTab: undefined;
  AIAssistantTab: undefined;
  NavigationTab: undefined;
  SettingsTab: undefined;
  DigitalTwinTab: undefined;
};
