import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

type ResetPasswordScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'ResetPassword'>;
  route: RouteProp<AuthStackParamList, 'ResetPassword'>;
};

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const {email, code} = route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;

    // Şifre doğrulama
    if (!password) {
      setPasswordError('Şifre alanı zorunludur');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Şifre onay doğrulama
    if (!confirmPassword) {
      setConfirmPasswordError('Şifre onayı zorunludur');
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };

  const handleResetPassword = () => {
    if (validateForm()) {
      setIsLoading(true);

      // Burada normalde API çağrısı yapılıp şifre sıfırlama işlemi yapılır
      // Şimdilik sadece simüle ediyoruz
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('PasswordChanged');
      }, 1500);
    }
  };

  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Sağlık Asistanım</Text>
          </View>
        </View>

        <Text style={styles.title}>Yeni Şifre Oluştur</Text>
        <Text style={styles.subtitle}>
          Lütfen yeni şifrenizi girin ve onaylayın.
        </Text>

        <View style={styles.formContainer}>
          <CustomInput
            label="Yeni Şifre"
            placeholder="Yeni şifrenizi giriniz"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
          />

          <CustomInput
            label="Şifre Onayı"
            placeholder="Şifrenizi tekrar giriniz"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
          />

          <CustomButton
            title="Şifremi Güncelle"
            onPress={handleResetPassword}
            isLoading={isLoading}
            containerStyle={styles.resetButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(4),
    marginBottom: hp(1),
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logo: {
    width: wp(30),
    height: hp(10),
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  formContainer: {
    width: '100%',
    marginTop: SPACING.md,
  },
  resetButton: {
    marginTop: SPACING.xl,
  },
});

export default ResetPasswordScreen;
