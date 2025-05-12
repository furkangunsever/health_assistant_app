import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../routes/NavigationTypes';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../redux/store';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  hp,
  wp,
} from '../../utils/theme';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import {UserProfileData} from '../../types/auth.types';
import {
  saveUserProfileData,
  fetchUserProfile,
} from '../../redux/actions/userActions';

type UserProfileScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'UserProfile'
>;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<UserProfileScreenNavigationProp>();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const {profile, isLoading, error} = useSelector(
    (state: RootState) => state.user,
  );

  // Form state
  const [name, setName] = useState(user?.displayName || '');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [chronicDiseases, setChronicDiseases] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');

  // Form errors
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');

  // Firestore'dan kullanıcı profil bilgilerini yükleme
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        await dispatch(fetchUserProfile() as any).unwrap();
      } catch (err: any) {
        console.error('Profil bilgileri yüklenirken hata oluştu:', err);
      }
    };

    loadUserProfile();
  }, [dispatch]);

  // Profil bilgileri state'i yüklendiğinde form alanlarını güncelleme
  useEffect(() => {
    if (profile) {
      setName(profile.name || user?.displayName || '');
      setAge(profile.age ? profile.age.toString() : '');
      setHeight(profile.height ? profile.height.toString() : '');
      setWeight(profile.weight ? profile.weight.toString() : '');
      setChronicDiseases(profile.chronicDiseases || '');
      setAllergies(profile.allergies || '');
      setMedications(profile.medications || '');
    }
  }, [profile, user]);

  // Hata durumunda kullanıcıya bildirim gösterme
  useEffect(() => {
    if (error) {
      Alert.alert('Hata', error);
    }
  }, [error]);

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Ad Soyad alanı zorunludur');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!age.trim()) {
      setAgeError('Yaş alanı zorunludur');
      isValid = false;
    } else if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      setAgeError('Geçerli bir yaş giriniz (1-120)');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!height.trim()) {
      setHeightError('Boy alanı zorunludur');
      isValid = false;
    } else if (
      isNaN(Number(height)) ||
      Number(height) <= 0 ||
      Number(height) > 250
    ) {
      setHeightError('Geçerli bir boy giriniz (cm)');
      isValid = false;
    } else {
      setHeightError('');
    }

    if (!weight.trim()) {
      setWeightError('Kilo alanı zorunludur');
      isValid = false;
    } else if (
      isNaN(Number(weight)) ||
      Number(weight) <= 0 ||
      Number(weight) > 500
    ) {
      setWeightError('Geçerli bir kilo giriniz (kg)');
      isValid = false;
    } else {
      setWeightError('');
    }

    return isValid;
  };

  const handleSaveProfile = async () => {
    if (validateForm()) {
      try {
        const profileData: UserProfileData = {
          name,
          age: parseInt(age, 10),
          height: parseInt(height, 10),
          weight: parseInt(weight, 10),
          chronicDiseases: chronicDiseases.trim() || undefined,
          allergies: allergies.trim() || undefined,
          medications: medications.trim() || undefined,
        };

        await dispatch(saveUserProfileData(profileData) as any).unwrap();

        Alert.alert('Başarılı', 'Profil bilgileriniz başarıyla kaydedildi.', [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Home'),
          },
        ]);
      } catch (err: any) {
        Alert.alert('Hata', `Profil kaydedilemedi: ${err.message}`);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Kişisel Bilgilerinizi Giriniz</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>
            Sağlık Durumunuzu Takip Etmek İçin Bilgilerinizi Ekleyin
          </Text>

          <CustomInput
            label="Ad Soyad"
            placeholder="Adınız ve soyadınız"
            value={name}
            onChangeText={setName}
            error={nameError}
            autoCapitalize="words"
          />

          <CustomInput
            label="Yaş"
            placeholder="Yaşınız"
            value={age}
            onChangeText={setAge}
            error={ageError}
            keyboardType="number-pad"
          />

          <View style={styles.rowContainer}>
            <CustomInput
              label="Boy"
              placeholder="cm"
              value={height}
              onChangeText={setHeight}
              error={heightError}
              keyboardType="number-pad"
              containerStyle={styles.halfInput}
            />

            <CustomInput
              label="Kilo"
              placeholder="kg"
              value={weight}
              onChangeText={setWeight}
              error={weightError}
              keyboardType="number-pad"
              containerStyle={styles.halfInput}
            />
          </View>

          <CustomInput
            label="Kronik Hastalıklar"
            placeholder="Varsa kronik hastalıklarınız"
            value={chronicDiseases}
            onChangeText={setChronicDiseases}
            multiline
            numberOfLines={3}
          />

          <CustomInput
            label="Alerjiler"
            placeholder="Varsa alerjileriniz"
            value={allergies}
            onChangeText={setAllergies}
            multiline
            numberOfLines={3}
          />

          <CustomInput
            label="İlaçlar"
            placeholder="Düzenli kullandığınız ilaçlar"
            value={medications}
            onChangeText={setMedications}
            multiline
            numberOfLines={3}
          />

          <CustomButton
            title="Kaydet"
            onPress={handleSaveProfile}
            isLoading={isLoading}
            containerStyle={styles.button}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: hp(4),
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  backText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  contentContainer: {
    paddingHorizontal: windowWidth * 0.05,
    margin: 10,
    paddingTop:10
  },
  title: {
    fontSize: windowHeight * 0.035,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: windowHeight * 0.01,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    color: '#8D8D8DFF',
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInput: {
    width: '48%',
  },
  button: {
    marginTop: SPACING.xl,
  },
});

export default UserProfileScreen;
