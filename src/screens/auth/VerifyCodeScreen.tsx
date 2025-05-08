import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS} from '../../utils/theme';
import {useDispatch} from 'react-redux';
import {resetPasswordWithCode} from '../../redux/actions/authActions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type VerifyCodeScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'VerifyCode'>;
  route: RouteProp<AuthStackParamList, 'VerifyCode'>;
};

const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useDispatch();
  const {email} = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [focusedInput, setFocusedInput] = useState(0);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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
    if (confirmPwd !== newPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleInputChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleResetPassword = () => {
    const isPasswordValid = validatePassword(newPassword);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isPasswordValid && isConfirmPasswordValid) {
      const verificationCode = code.join('');
      if (verificationCode.length === 6) {
        try {
          dispatch(
            resetPasswordWithCode({code: verificationCode, newPassword}) as any,
          );
          Alert.alert('Başarılı', 'Şifreniz başarıyla sıfırlandı.', [
            {
              text: 'Tamam',
              onPress: () => navigation.navigate('PasswordChanged'),
            },
          ]);
        } catch (error) {
          Alert.alert('Hata', 'Şifre sıfırlanırken bir hata oluştu');
        }
      } else {
        Alert.alert('Hata', 'Lütfen geçerli bir doğrulama kodu girin');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Doğrulama Kodu</Text>
      <Text style={styles.subtitle}>
        E-posta adresinize gönderilen 6 haneli kodu giriniz
      </Text>

      <View style={styles.inputContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            style={[
              styles.input,
              focusedInput === index ? styles.inputFocused : null,
            ]}
            value={digit}
            onChangeText={text => handleInputChange(text, index)}
            keyboardType="number-pad"
            maxLength={1}
            ref={ref => (inputRefs.current[index] = ref)}
            onFocus={() => setFocusedInput(index)}
            onBlur={() => setFocusedInput(-1)}
          />
        ))}
      </View>

      <View style={styles.newPasswordContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              passwordError ? styles.inputError : null,
            ]}
            placeholder="Yeni Şifre"
            value={newPassword}
            onChangeText={text => {
              setNewPassword(text);
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              confirmPasswordError ? styles.inputError : null,
            ]}
            placeholder="Şifreyi Doğrula"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              validateConfirmPassword(text);
            }}
            secureTextEntry={!showConfirmPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Text>
              {showConfirmPassword ? (
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
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>
      </View>

      <TouchableOpacity
        style={styles.verifyButton}
        onPress={handleResetPassword}>
        <Text style={styles.verifyButtonText}>Şifreyi Sıfırla</Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Kod almadınız mı? </Text>
        <TouchableOpacity>
          <Text style={styles.resendLink}>Tekrar gönder</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginBottom: windowHeight * 0.02,
  },
  subtitle: {
    fontSize: windowHeight * 0.02,
    color: '#666',
    marginBottom: windowHeight * 0.04,
    lineHeight: windowHeight * 0.03,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: windowWidth * 0.05,
    marginTop: windowHeight * 0.02,
  },
  codeInput: {
    width: windowWidth * 0.13,
    height: windowWidth * 0.13,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    fontSize: windowHeight * 0.025,
    fontWeight: '600',
    color: COLORS.text,
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
  verifyButton: {
    backgroundColor: COLORS.primary,
    height: windowHeight * 0.07,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.03,
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: windowHeight * 0.02,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: windowHeight * 0.05,
    left: 0,
    right: 0,
  },
  resendText: {
    color: COLORS.text,
    fontSize: windowHeight * 0.018,
  },
  resendLink: {
    color: COLORS.primary,
    fontSize: windowHeight * 0.018,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: windowWidth * 0.05,
    marginTop: windowHeight * 0.02,
  },
  input: {
    width: windowWidth * 0.13,
    height: windowWidth * 0.13,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    fontSize: windowHeight * 0.025,
    fontWeight: '600',
    color: COLORS.text,
  },
  inputFocused: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  newPasswordContainer: {
    width: '90%',
    marginBottom: 20,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  passwordInput: {
    width: '100%',
    height: 55,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 17,
    width: 20,
    height: 20,
  },
});

export default VerifyCodeScreen;
