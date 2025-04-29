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
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS} from '../../utils/theme';

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
  const {email} = route.params;
  const [code, setCode] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleCodeChange = (text: string, index: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');

    if (fullCode.length !== 4) {
      setError('Lütfen 4 haneli doğrulama kodunu giriniz');
      return;
    }

    navigation.navigate('ResetPassword', {email, code: fullCode});
  };

  const handleResendCode = () => {
    setTimer(60);
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
        <Text style={styles.title}>Doğrulama</Text>
        <Text style={styles.subtitle}>
          E-posta adresinize az önce gönderdiğimiz doğrulama kodunu girin.
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[styles.codeInput, error ? styles.inputError : null]}
              value={digit}
              onChangeText={text => handleCodeChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Doğrula</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Kod almadınız mı? </Text>
          <TouchableOpacity onPress={handleResendCode}>
            <Text style={styles.resendLink}>Yeniden gönder</Text>
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
});

export default VerifyCodeScreen;
