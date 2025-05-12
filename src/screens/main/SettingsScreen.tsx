import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {logout} from '../../redux/actions/authActions';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);

  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [locationServices, setLocationServices] = React.useState(true);

  const handleLogout = () => {
    dispatch(logout() as any);
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    hasSwitch: boolean = false,
    value?: boolean,
    onValueChange?: (value: boolean) => void,
    onPress?: () => void,
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={hasSwitch || !onPress}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {hasSwitch && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{false: COLORS.gray, true: COLORS.primary}}
          thumbColor={COLORS.white}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kullanıcı Bilgileri</Text>
          {renderSettingItem(
            'Profil',
            'Kişisel bilgilerinizi düzenleyin',
            false,
            undefined,
            undefined,
            () => {},
          )}
          {renderSettingItem(
            'E-posta',
            user?.email || 'Mevcut değil',
            false,
            undefined,
            undefined,
            () => {},
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
          {renderSettingItem(
            'Bildirimler',
            'Bildirimleri aç/kapat',
            true,
            notifications,
            setNotifications,
          )}
          {renderSettingItem(
            'Karanlık Mod',
            'Karanlık temayı aç/kapat',
            true,
            darkMode,
            setDarkMode,
          )}
          {renderSettingItem(
            'Konum Servisleri',
            'Konum servislerini aç/kapat',
            true,
            locationServices,
            setLocationServices,
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diğer</Text>
          {renderSettingItem(
            'Yardım ve Destek',
            'Yardım merkezi ve SSS',
            false,
            undefined,
            undefined,
            () => {},
          )}
          {renderSettingItem(
            'Gizlilik Politikası',
            'Gizlilik politikamızı görüntüle',
            false,
            undefined,
            undefined,
            () => {},
          )}
          {renderSettingItem('Uygulama Versiyonu', '1.0.0', false)}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
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
    padding: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
