import React, {useState, useRef, useEffect} from 'react';
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
  TextInput,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  hp,
  wp,
  BORDER_RADIUS,
  SHADOW,
} from '../../utils/theme';
import CustomButton from '../../components/CustomButton';

type VerifyCodeScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, 'VerifyCode'>;
  route: RouteProp<AuthStackParamList, 'VerifyCode'>;
};

const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({
  navigation,
  route,
}) => {
  const {email} = route.params;
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Timer işlemi
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

    if (fullCode.length !== 6) {
      setError('Lütfen 6 haneli doğrulama kodunu giriniz');
      return;
    }

    setIsLoading(true);

    // Burada normalde API çağrısı yapılıp doğrulama yapılır
    // Şimdilik sadece simüle ediyoruz
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('ResetPassword', {email, code: fullCode});
    }, 1500);
  };

  const handleResendCode = () => {
    setTimer(60);
    // Burada normalde yeniden kod gönderme API'si çağrılır
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

        <Text style={styles.title}>Doğrulama Kodu</Text>
        <Text style={styles.subtitle}>
          {email} adresine gönderilen 6 haneli doğrulama kodunu giriniz.
        </Text>

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.codeInput}
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

        <CustomButton
          title="Doğrula"
          onPress={handleVerify}
          isLoading={isLoading}
          containerStyle={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Kod almadınız mı?</Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              {timer} saniye sonra tekrar gönder
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Yeniden Gönder</Text>
            </TouchableOpacity>
          )}
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SPACING.xl,
  },
  codeInput: {
    width: wp(12),
    height: wp(15),
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.sm,
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    ...SHADOW.small,
    backgroundColor: COLORS.white,
  },
  verifyButton: {
    marginTop: SPACING.lg,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  resendText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  resendLink: {
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

export default VerifyCodeScreen;
