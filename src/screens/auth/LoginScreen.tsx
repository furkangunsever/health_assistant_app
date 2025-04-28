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
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {login} from '../../redux/actions/authActions';
import {clearError} from '../../redux/slices/authSlice';

type LoginScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch();
  const {isLoading, error} = useSelector((state: RootState) => state.auth);

  const validateForm = () => {
    let isValid = true;

    // E-posta doğrulama
    if (!email.trim()) {
      setEmailError('E-posta alanı zorunludur');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Geçerli bir e-posta adresi giriniz');
      isValid = false;
    } else {
      setEmailError('');
    }

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

    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Not: Mock servis için test hesapları:
      // Email: test@example.com, Password: 123456
      // Email: user@example.com, Password: 123456
      dispatch(login({email, password}) as any);
    }
  };

  const navigateToRegister = () => {
    dispatch(clearError());
    navigation.navigate('Register');
  };

  const navigateToForgotPassword = () => {
    dispatch(clearError());
    navigation.navigate('ForgotPassword');
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
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Sağlık Asistanım</Text>
        </View>

        <Text style={styles.title}>Giriş Yap</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.formContainer}>
          <CustomInput
            label="E-posta"
            placeholder="E-posta adresinizi giriniz"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <CustomInput
            label="Şifre"
            placeholder="Şifrenizi giriniz"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={passwordError}
          />

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={navigateToForgotPassword}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <CustomButton
            title="Giriş Yap"
            onPress={handleLogin}
            isLoading={isLoading}
            containerStyle={styles.loginButton}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Hesabınız yok mu?</Text>
            <TouchableOpacity onPress={navigateToRegister}>
              <Text style={styles.registerLink}> Kayıt Ol</Text>
            </TouchableOpacity>
          </View>
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
  logoContainer: {
    alignItems: 'center',
    marginTop: hp(6),
    marginBottom: hp(2),
  },
  logoText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logo: {
    width: wp(40),
    height: hp(15),
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: SPACING.md,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
  },
  loginButton: {
    marginTop: SPACING.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  registerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  registerLink: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.sm,
  },
});

export default LoginScreen;
