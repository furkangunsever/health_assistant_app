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
import {register} from '../../redux/actions/authActions';
import {clearError} from '../../redux/slices/authSlice';

type RegisterScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch();
  const {isLoading, error} = useSelector((state: RootState) => state.auth);

  const validateForm = () => {
    let isValid = true;

    // İsim doğrulama
    if (!name.trim()) {
      setNameError('Ad Soyad alanı zorunludur');
      isValid = false;
    } else {
      setNameError('');
    }

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

  const handleRegister = () => {
    if (validateForm()) {
      dispatch(register({email, password}) as any);
    }
  };

  const navigateToLogin = () => {
    dispatch(clearError());
    navigation.navigate('Login');
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
          <TouchableOpacity style={styles.backButton} onPress={navigateToLogin}>
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Sağlık Asistanım</Text>
          </View>
        </View>

        <Text style={styles.title}>Hesap Oluştur</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.formContainer}>
          <CustomInput
            label="Ad Soyad"
            placeholder="Ad Soyadınızı giriniz"
            value={name}
            onChangeText={setName}
            error={nameError}
          />

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

          <CustomInput
            label="Şifre Onayı"
            placeholder="Şifrenizi tekrar giriniz"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={confirmPasswordError}
          />

          <CustomButton
            title="Kayıt Ol"
            onPress={handleRegister}
            isLoading={isLoading}
            containerStyle={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Zaten bir hesabınız var mı?</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}> Giriş Yap</Text>
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
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: SPACING.md,
  },
  registerButton: {
    marginTop: SPACING.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  loginLink: {
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

export default RegisterScreen;
