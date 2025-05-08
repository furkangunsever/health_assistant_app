import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS} from '../../utils/theme';
import {useDispatch} from 'react-redux';
import {
  login,
  loginWithGoogle,
  verifyEmail,
  logout,
} from '../../redux/actions/authActions';
import {SerializableUser} from '../../types/auth.types';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type LoginScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  const handleLogin = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        dispatch(login({email, password}) as any)
          .unwrap()
          .then((user: SerializableUser) => {
            console.log('Giriş işlemi başarılı:', user);

            if (!user.emailVerified) {
              Alert.alert(
                'E-posta Doğrulama Gerekli',
                'Lütfen hesabınıza gönderilen e-posta doğrulama bağlantısını tıklayın. Doğrulama yapmadan giriş yapamazsınız.',
                [
                  {
                    text: 'Yeniden Gönder',
                    onPress: () => {
                      dispatch(verifyEmail() as any)
                        .then(() => {
                          Alert.alert(
                            'Doğrulama E-postası Gönderildi',
                            'Lütfen e-posta kutunuzu kontrol edin ve doğrulama bağlantısını tıklayın.',
                          );
                        })
                        .catch((error: any) => {
                          Alert.alert(
                            'Hata',
                            `Doğrulama e-postası gönderilirken bir hata oluştu: ${error.message}`,
                          );
                        });
                    },
                  },
                  {
                    text: 'Tamam',
                    style: 'cancel',
                  },
                ],
              );
            }
          })
          .catch((error: any) => {
            Alert.alert(
              'Giriş Hatası',
              `Giriş yapılırken bir hata oluştu: ${error.message}`,
            );
          });
      } catch (error) {
        Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
      }
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
        <Text style={styles.title}>Hoşgeldiniz! Sizi</Text>
        <Text style={styles.subtitle}>gördüğüme sevindim</Text>

        <View style={styles.inputContainer}>
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
              placeholder="Şifrenizi girin"
              value={password}
              onChangeText={text => {
                setPassword(text);
                validatePassword(text);
              }}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}>
              <Text>
                {showPassword ? (
                  <Image
                    source={require('../../assets/view_1.png')}
                    style={styles.eyeIcon}
                  />
                ) : (
                  <Image
                    source={require('../../assets/view_2.png')}
                    style={styles.eyeIcon}
                  />
                )}
              </Text>
            </TouchableOpacity>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Ya da</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}>
          <Image
            source={require('../../assets/google.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Şimdi kayıt ol</Text>
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
    width: windowHeight * 0.03,
    height: windowHeight * 0.03,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: windowHeight * 0.02,
    marginBottom: windowHeight * 0.03,
  },
  forgotPasswordText: {
    color: COLORS.text,
    fontSize: windowHeight * 0.018,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    height: windowHeight * 0.07,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: windowHeight * 0.03,
  },
  loginButtonText: {
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
  googleButtonText: {
    color: COLORS.text,
    fontSize: windowHeight * 0.018,
    fontWeight: '600',
    marginLeft: windowWidth * 0.02,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: windowHeight * 0.03,
  },
  registerText: {
    color: COLORS.text,
    fontSize: windowHeight * 0.018,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: windowHeight * 0.018,
    fontWeight: '600',
  },
});

export default LoginScreen;
