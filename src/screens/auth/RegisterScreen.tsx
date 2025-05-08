import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS} from '../../utils/theme';
import {useDispatch} from 'react-redux';
import {register, loginWithGoogle} from '../../redux/actions/authActions';
import {SerializableUser} from '../../types/auth.types';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type RegisterScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const dispatch = useDispatch();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('E-posta adresi gereklidir');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Geçerli bir e-posta adresi giriniz');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Şifre gereklidir');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPwd: string) => {
    if (!confirmPwd) {
      setConfirmPasswordError('Şifre onayı gereklidir');
      return false;
    }
    if (confirmPwd !== password) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Ad Soyad alanı zorunludur');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email.trim()) {
      setEmailError('E-posta alanı zorunludur');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Geçerli bir e-posta adresi giriniz');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Şifre alanı zorunludur');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      isValid = false;
    } else {
      setPasswordError('');
    }

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

  const validateDisplayName = (name: string) => {
    if (!name) {
      setDisplayNameError('Ad Soyad gereklidir');
      return false;
    }
    if (name.length < 2) {
      setDisplayNameError('Ad Soyad en az 2 karakter olmalıdır');
      return false;
    }
    setDisplayNameError('');
    return true;
  };

  const handleRegister = () => {
    const isEmailValid = validateEmail(email);
    const isDisplayNameValid = validateDisplayName(displayName);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      isDisplayNameValid
    ) {
      try {
        console.log('Kayıt işlemi başlatılıyor:', {
          email,
          password,
          displayName,
        });
        dispatch(register({email, password, displayName}) as any)
          .unwrap()
          .then((user: SerializableUser) => {
            console.log('Kayıt başarılı:', user);
            Alert.alert(
              'Kayıt Başarılı',
              'Hesabınız oluşturuldu! Lütfen e-posta adresinize gönderilen doğrulama bağlantısını tıklayarak hesabınızı doğrulayın.',
              [
                {
                  text: 'Tamam',
                  onPress: () => navigation.navigate('Login'),
                },
              ],
            );
          })
          .catch((error: Error) => {
            console.error('Kayıt hatası:', error);
            Alert.alert(
              'Hata',
              `Kayıt yapılırken bir hata oluştu: ${error.message || error}`,
            );
          });
      } catch (error: any) {
        console.error('Dispatch hatası:', error);
        Alert.alert(
          'Hata',
          `Kayıt yapılırken bir hata oluştu: ${error.message || error}`,
        );
      }
    } else {
      console.log('Form doğrulama başarısız:', {
        isEmailValid,
        isPasswordValid,
        isConfirmPasswordValid,
        isDisplayNameValid,
      });
    }
  };

  const handleGoogleLogin = () => {
    try {
      dispatch(loginWithGoogle() as any);
    } catch (error) {
      Alert.alert('Hata', 'Google ile giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Merhaba! Başlamak İçin Kayıt Olun</Text>

        <View style={styles.inputContainer}>
          <View>
            <TextInput
              style={[
                styles.input,
                displayNameError ? styles.inputError : null,
              ]}
              placeholder="Ad Soyad"
              value={displayName}
              onChangeText={text => {
                setDisplayName(text);
                validateDisplayName(text);
              }}
              autoCapitalize="words"
              placeholderTextColor="#999"
            />
            {displayNameError ? (
              <Text style={styles.errorText}>{displayNameError}</Text>
            ) : null}
          </View>
          <View>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="E-postanızı girin"
              value={email}
              onChangeText={text => {
                setEmail(text);
                validateEmail(text);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Şifre"
              value={password}
              onChangeText={text => {
                setPassword(text);
                if (text) setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={
                  showPassword
                    ? require('../../assets/view_1.png')
                    : require('../../assets/view_2.png')
                }
                style={styles.eyeIconImage}
              />
            </TouchableOpacity>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                confirmPasswordError ? styles.inputError : null,
              ]}
              placeholder="Şifre tekrar"
              value={confirmPassword}
              onChangeText={text => {
                setConfirmPassword(text);
                if (text) setConfirmPasswordError('');
              }}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Image
                source={
                  showConfirmPassword
                    ? require('../../assets/view_1.png')
                    : require('../../assets/view_2.png')
                }
                style={styles.eyeIconImage}
              />
            </TouchableOpacity>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Kayıt ol</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Ya da</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require('../../assets/google.png')}
            style={styles.googleIcon}
          />
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Zaten bir hesabınız var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Şimdi Giriş Yapın</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  backButton: {
    position: 'absolute',
    top: windowHeight * 0.05,
    left: windowWidth * 0.05,
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.text,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: windowWidth * 0.05,
    paddingTop: windowHeight * 0.12,
  },
  title: {
    fontSize: windowHeight * 0.04,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: windowHeight * 0.01,
  },
  subtitle: {
    fontSize: windowHeight * 0.04,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: windowHeight * 0.04,
  },
  inputContainer: {
    marginTop: windowHeight * 0.02,
    gap: windowHeight * 0.02,
  },
  input: {
    height: windowHeight * 0.07,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingHorizontal: windowWidth * 0.05,
    fontSize: windowHeight * 0.018,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: windowHeight * 0.015,
    marginTop: windowHeight * 0.01,
    marginLeft: windowWidth * 0.02,
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: windowWidth * 0.05,
    top: windowHeight * 0.02,
  },
  eyeIconImage: {
    width: windowHeight * 0.03,
    height: windowHeight * 0.03,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    height: windowHeight * 0.07,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.03,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: windowHeight * 0.02,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: windowHeight * 0.03,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: windowWidth * 0.03,
    color: '#666',
    fontSize: windowHeight * 0.018,
  },
  googleButton: {
    height: windowHeight * 0.07,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleIcon: {
    width: windowHeight * 0.03,
    height: windowHeight * 0.03,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: windowHeight * 0.03,
  },
  loginText: {
    color: COLORS.text,
    fontSize: windowHeight * 0.018,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: windowHeight * 0.018,
    fontWeight: '600',
  },
});

export default RegisterScreen;
