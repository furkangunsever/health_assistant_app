import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import {RootState} from '../../redux/store';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../routes/NavigationTypes';

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Home'>;
const {width, height} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {user} = useSelector((state: RootState) => state.auth);
  const {profile} = useSelector((state: RootState) => state.user);

  // Vücut Kitle İndeksi hesaplama
  const bmi = useMemo(() => {
    if (profile?.height && profile?.weight) {
      const heightInM = profile.height / 100; // cm'den m'ye çevir
      const bmiValue = profile.weight / (heightInM * heightInM);
      return bmiValue.toFixed(1);
    }
    return null;
  }, [profile]);

  // BMI kategorisini belirleme
  const getBmiCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return {category: 'Zayıf', color: '#2196F3'};
    if (bmiValue < 25) return {category: 'Normal', color: '#4CAF50'};
    if (bmiValue < 30) return {category: 'Fazla Kilolu', color: '#FF9800'};
    return {category: 'Obez', color: '#F44336'};
  };

  // BMI değerine göre gösterge pozisyonu
  const getBmiIndicatorPosition = (bmiValue: number) => {
    // BMI değeri 10-40 arasında gösterim için (pozisyon 0-100 arası)
    const minBmi = 10;
    const maxBmi = 40;
    const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmiValue));
    return ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;
  };

  const bmiInfo = bmi ? getBmiCategory(parseFloat(bmi)) : null;
  const bmiPosition = bmi ? getBmiIndicatorPosition(parseFloat(bmi)) : 50;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Üst Bölüm - Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>Merhaba,</Text>
            <Text style={styles.nameText}>
              {profile?.name || user?.displayName || 'Değerli Kullanıcı'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileIconContainer}
            onPress={() => navigation.navigate('UserProfile')}>
            <Image
              source={require('../../assets/user.png')}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* BMI Kart */}
        {profile?.height && profile?.weight && bmi && (
          <View style={styles.bmiCard}>
            <View style={styles.bmiHeader}>
              <Text style={styles.bmiTitle}>Vücut Kitle Endeksi</Text>
              <Text style={styles.bmiValue}>{bmi}</Text>
            </View>

            <Text style={[styles.bmiCategory, {color: bmiInfo?.color}]}>
              {bmiInfo?.category}
            </Text>

            <View style={styles.bmiGaugeContainer}>
              <View style={styles.bmiGauge}>
                {/* Renk çubukları */}
                <View style={styles.bmiColorContainer}>
                  <View
                    style={[
                      styles.bmiColorBar,
                      {backgroundColor: '#2196F3', flex: 1},
                    ]}
                  />
                  <View
                    style={[
                      styles.bmiColorBar,
                      {backgroundColor: '#4CAF50', flex: 1},
                    ]}
                  />
                  <View
                    style={[
                      styles.bmiColorBar,
                      {backgroundColor: '#FF9800', flex: 1},
                    ]}
                  />
                  <View
                    style={[
                      styles.bmiColorBar,
                      {backgroundColor: '#F44336', flex: 1},
                    ]}
                  />
                </View>

                {/* Gösterge üçgeni */}
                <View
                  style={[styles.bmiIndicator, {left: `${bmiPosition}%`}]}
                />
              </View>

              <View style={styles.bmiLabels}>
                <Text style={styles.bmiLabel}>Zayıf</Text>
                <Text style={styles.bmiLabel}>Normal</Text>
                <Text style={styles.bmiLabel}>Kilolu</Text>
                <Text style={styles.bmiLabel}>Obez</Text>
              </View>
            </View>
          </View>
        )}

        {/* Hızlı Erişim Bölümü */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>

          <View style={styles.quickAccessGrid}>
            <TouchableOpacity
              style={styles.quickAccessItem_2}
              onPress={() => navigation.navigate('DigitalTwin')}>
              <ImageBackground
                source={require('../../assets/digital_twin_human_1.png')}
                style={styles.digitalTwinBackground}
                imageStyle={styles.digitalTwinBackgroundImage}>
                <View style={styles.digitalTwinOverlay}>
                  <Text style={styles.digitalTwinText}>Dijital İkiz</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessItem}>
              <View style={[styles.iconCircle, {backgroundColor: '#2ecc71'}]}>
                <Image
                  source={require('../../assets/calendar.png')}
                  style={styles.menuIcon}
                />
              </View>
              <Text style={styles.menuText}>Randevular</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessItem}>
              <View style={[styles.iconCircle, {backgroundColor: '#9b59b6'}]}>
                <Image
                  source={require('../../assets/hospital.png')}
                  style={styles.menuIcon}
                />
              </View>
              <Text style={styles.menuText}>Hastaneler</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sağlık İpuçları Bölümü */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sağlık İpuçları</Text>

          <View style={styles.tipCard}>
            <Image
              source={require('../../assets/water.png')}
              style={styles.tipIcon}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Günlük Su Tüketimi</Text>
              <Text style={styles.tipText}>
                Günde en az 2 litre su içmek, metabolizmanızı hızlandırır ve
                vücuttaki toksinlerin atılmasına yardımcı olur.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Image
              source={require('../../assets/running.png')}
              style={styles.tipIcon}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Düzenli Egzersiz</Text>
              <Text style={styles.tipText}>
                Haftada en az 150 dakika orta yoğunlukta egzersiz yapmak, kalp
                sağlığınızı korur ve bağışıklık sisteminizi güçlendirir.
              </Text>
            </View>
          </View>
        </View>

        {/* Yaklaşan Randevular Bölümü */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Yaklaşan Randevularım</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptyAppointment}>
            <Image
              source={require('../../assets/calendar.png')}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              Henüz planlanmış bir randevunuz bulunmamaktadır.
            </Text>
            <CustomButton
              title="Randevu Ekle"
              containerStyle={styles.appointmentButton}
            />
          </View>
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
    paddingTop: hp(4),
    paddingBottom: hp(2),
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  nameText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  bmiCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bmiTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  bmiValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bmiCategory: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  bmiGaugeContainer: {
    marginTop: SPACING.sm,
  },
  bmiGauge: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  bmiColorContainer: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
  },
  bmiColorBar: {
    height: '100%',
  },
  bmiIndicator: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#000',
    top: -16,
    transform: [{translateX: -8}],
  },
  bmiLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  bmiLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  viewAllText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    
  },
  quickAccessItem: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  quickAccessItem_2: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    
  },
  digitalTwinBackground: {
    width: '100%',
    height: 145,
    justifyContent: 'flex-end',
  },
  digitalTwinBackgroundImage: {
    borderRadius: 16,
    opacity: 0.8,
  },
  digitalTwinOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: SPACING.md,
    alignItems: 'center',
  },
  digitalTwinText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  menuIcon: {
    width: 24,
    height: 24,
  },
  menuText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    width: 40,
    height: 30,
    borderRadius: 20,
    marginRight: SPACING.md,
    tintColor: COLORS.primary,
    resizeMode: 'contain',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    lineHeight: 20,
  },
  emptyAppointment: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    tintColor: COLORS.gray,
    marginBottom: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  appointmentButton: {
    width: '80%',
  },
});

export default HomeScreen;
