import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import {RootState} from '../../redux/store';
import {logout} from '../../redux/actions/authActions';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../routes/NavigationTypes';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user} = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout() as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sağlık Asistanım</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
        {user?.displayName && (
          <Text style={styles.displayNameText}>{user.displayName}</Text>
        )}
        {user?.photoURL && (
          <Image source={{uri: user.photoURL}} style={styles.profileImage} />
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Sağlık Asistanınız</Text>
          <Text style={styles.infoDesc}>
            Sağlığınızı takip etmenin en kolay yolu. Yapacağınız işlemler için
            menüyü kullanabilirsiniz.
          </Text>
        </View>

        <CustomButton
          title="Profil Bilgilerim"
          variant="outline"
          containerStyle={styles.button}
          onPress={() => navigation.navigate('UserProfile')}
        />

        <CustomButton
          title="Sağlık Verilerim"
          containerStyle={styles.button}
          onPress={() => {}}
        />
      </View>
    </View>
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
  logo: {
    width: wp(30),
    height: hp(5),
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emailText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  displayNameText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  profileImage: {
    width: wp(30),
    height: hp(5),
    borderRadius: hp(2.5),
    marginBottom: SPACING.xl,
  },
  infoCard: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  infoDesc: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: hp(2.5),
  },
  button: {
    width: '90%',
    marginBottom: SPACING.md,
  },
});

export default HomeScreen;
