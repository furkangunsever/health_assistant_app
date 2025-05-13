import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

// Responsive boyutlandırma için fonksiyonlar
export const wp = (percentage: number) => {
  return width * (percentage / 100);
};

export const hp = (percentage: number) => {
  return height * (percentage / 100);
};

// Font boyutları
export const FONT_SIZE = {
  xs: wp(3),
  sm: wp(3.5),
  md: wp(4),
  lg: wp(5),
  xl: wp(6),
  xxl: wp(8),
};

// Renk şeması
export const COLORS = {
  primary: '#1194C1',
  secondary: '#3F51B5',
  splash: '#ADDAE7',
  background: '#FFFFFF',
  text: '#333333',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#979797FF',
  lightGray: '#F5F5F5',
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  transparent: 'transparent',
};

// Boşluk (padding, margin) değerleri
export const SPACING = {
  xs: wp(2),
  sm: wp(3),
  md: wp(4),
  lg: wp(6),
  xl: wp(8),
  xxl: wp(10),
};

// Border radius değerleri
export const BORDER_RADIUS = {
  xs: wp(1),
  sm: wp(2),
  md: wp(3),
  lg: wp(4),
  xl: wp(5),
  round: wp(50),
};

// Shadow değerleri
export const SHADOW = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};
