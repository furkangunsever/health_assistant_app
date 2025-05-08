import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import {forgotPassword} from '../../redux/actions/authActions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

type ForgotPasswordScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
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

  const handleSendResetLink = () => {
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      try {
        dispatch(forgotPassword(email) as any);
        Alert.alert(
          'Başarılı',
          'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.navigate('VerifyCode', {email}),
            },
          ],
        );
      } catch (error) {
        Alert.alert(
          'Hata',
          'Şifre sıfırlama e-postası gönderilirken bir hata oluştu',
        );
      }
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
        <Text style={styles.title}>Parolanızı mı unuttunuz?</Text>
        <Text style={styles.subtitle}>
          Merak etme! Bu meydana gelir. Lütfen hesabınıza bağlı e-posta adresini
          girin.
        </Text>

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
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendResetLink}>
          <Text style={styles.sendButtonText}>Kodu Gönder</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Şifrenizi Hatırlıyor musunuz? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Giriş yapmak</Text>
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
    marginBottom: windowHeight * 0.02,
  },
  subtitle: {
    fontSize: windowHeight * 0.02,
    color: '#666',
    marginBottom: windowHeight * 0.04,
    lineHeight: windowHeight * 0.03,
  },
  inputContainer: {
    marginTop: windowHeight * 0.02,
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
  sendButton: {
    backgroundColor: COLORS.primary,
    height: windowHeight * 0.07,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: windowHeight * 0.03,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: windowHeight * 0.02,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: windowHeight * 0.05,
    left: 0,
    right: 0,
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

export default ForgotPasswordScreen;
