import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {AuthStackParamList} from '../../routes/NavigationTypes';
import {COLORS} from '../../utils/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;

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

  const handleResetPassword = () => {
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigation.navigate('PasswordChanged');
      }, 1500);
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
            secureTextEntry={!showPassword}
            error={passwordError}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
            containerStyle={styles.inputContainer}
          />

          <CustomInput
            label="Şifre Onayı"
            placeholder="Şifrenizi tekrar giriniz"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            error={confirmPasswordError}
            showPasswordToggle
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            containerStyle={styles.inputContainer}
          />

          <CustomButton
            title="Şifremi Güncelle"
            onPress={handleResetPassword}
            isLoading={isLoading}
            containerStyle={styles.resetButton}
          />
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
  formContainer: {
    width: '100%',
    marginTop: windowHeight * 0.02,
  },
  inputContainer: {
    marginBottom: windowHeight * 0.02,
  },
  resetButton: {
    height: windowHeight * 0.07,
    marginTop: windowHeight * 0.03,
    borderRadius: 12,
  },
});

export default ResetPasswordScreen;
