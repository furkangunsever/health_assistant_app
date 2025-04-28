import React from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import CustomButton from '../../components/CustomButton';

type PasswordChangedScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'PasswordChanged'>;
};

const PasswordChangedScreen: React.FC<PasswordChangedScreenProps> = ({
  navigation,
}) => {
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>

        <Text style={styles.title}>Şifreniz Güncellendi!</Text>
        <Text style={styles.message}>
          Şifreniz başarıyla sıfırlandı. Şimdi yeni şifrenizle giriş
          yapabilirsiniz.
        </Text>

        <CustomButton
          title="Giriş Yap"
          onPress={navigateToLogin}
          containerStyle={styles.loginButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  successIcon: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successIconText: {
    fontSize: FONT_SIZE.xxl,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  loginButton: {
    width: '80%',
  },
});

export default PasswordChangedScreen;
