import React, {useEffect} from 'react';
import {View, StyleSheet, Text, StatusBar, Image} from 'react-native';
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
        routes: [{name: 'Welcome'}],
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.splash} barStyle="light-content" />
      <View style={styles.contentContainer}>
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.welcomeText}>Akıllı Sağlık Asistanınız</Text>
        <Text style={styles.readyText}>Hazır</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.splash,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(5),
  },
  logoWrapper: {
    width: wp(40),
    height: wp(40),
    backgroundColor: COLORS.splash,
    borderRadius: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(4),
  },
  logo: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
  },
  welcomeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: hp(1),
    textAlign: 'center',
  },
  readyText: {
    fontSize: FONT_SIZE.xl,
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
