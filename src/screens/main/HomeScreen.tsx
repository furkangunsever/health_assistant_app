import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import {RootState} from '../../redux/store';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../routes/NavigationTypes';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user} = useSelector((state: RootState) => state.auth);
  const {profile} = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Anasayfa</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
          <Text style={styles.nameText}>
            {profile?.name || user?.displayName || 'Değerli Kullanıcı'}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Sağlık Asistanınız</Text>
          <Text style={styles.infoDesc}>
            Sağlığınızı takip etmenin en kolay yolu. Yapacağınız işlemler için
            aşağıdaki menüleri kullanabilirsiniz.
          </Text>
        </View>

        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>

          <View style={styles.buttonGrid}>
            <CustomButton
              title="Profil Bilgilerim"
              variant="outline"
              containerStyle={styles.gridButton}
              onPress={() => navigation.navigate('UserProfile')}
            />

            <CustomButton
              title="Sağlık Verilerim"
              variant="outline"
              containerStyle={styles.gridButton}
              onPress={() => {}}
            />

            <CustomButton
              title="Randevu Al"
              variant="outline"
              containerStyle={styles.gridButton}
              onPress={() => {}}
            />

            <CustomButton
              title="İlaç Hatırlatıcı"
              variant="outline"
              containerStyle={styles.gridButton}
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.healthTipCard}>
          <Text style={styles.healthTipTitle}>Günün Sağlık Önerisi</Text>
          <Text style={styles.healthTipText}>
            Günde en az 2 litre su içmek, metabolizmanızı hızlandırır ve
            vücuttaki toksinlerin atılmasına yardımcı olur.
          </Text>
        </View>
      </ScrollView>
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
    justifyContent: 'center',
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  welcomeSection: {
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  nameText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: 'bold',
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
  quickAccessSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridButton: {
    width: '48%',
    marginBottom: SPACING.md,
  },
  healthTipCard: {
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  healthTipTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  healthTipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    lineHeight: hp(2.2),
  },
});

export default HomeScreen;
