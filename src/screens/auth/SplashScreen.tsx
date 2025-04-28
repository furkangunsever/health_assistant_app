import React, {useEffect} from 'react';
import {View, StyleSheet, Text, StatusBar} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS, hp, wp, FONT_SIZE} from '../../utils/theme';

type SplashScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Splash'>;
};

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useEffect(() => {
    // 2 saniye sonra giriş ekranına yönlendir
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Text style={styles.appTitle}>Sağlık Asistanım</Text>
      <Text style={styles.appSubtitle}>Sağlığınız bizim için önemli</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: hp(1),
  },
  appSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    opacity: 0.8,
  },
  logo: {
    width: wp(60),
    height: hp(30),
  },
});

export default SplashScreen;
