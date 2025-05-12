import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';

interface LocationItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: string;
}

const LOCATIONS: LocationItem[] = [
  {
    id: '1',
    name: 'Özel Medicana Hastanesi',
    address: 'Beylikdüzü, İstanbul',
    distance: '2.3 km',
    type: 'Hastane',
  },
  {
    id: '2',
    name: 'Medilife Tıp Merkezi',
    address: 'Esenyurt, İstanbul',
    distance: '3.5 km',
    type: 'Tıp Merkezi',
  },
  {
    id: '3',
    name: 'Çağdaş Eczanesi',
    address: 'Avcılar, İstanbul',
    distance: '1.8 km',
    type: 'Eczane',
  },
];

const NavigationScreen = () => {
  const renderLocationItem = (item: LocationItem) => (
    <TouchableOpacity key={item.id} style={styles.locationItem}>
      <View style={styles.locationContent}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <View style={styles.locationInfo}>
          <Text style={styles.locationType}>{item.type}</Text>
          <Text style={styles.locationDistance}>{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigasyon</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Harita Görünümü</Text>
        </View>

        <View style={styles.searchHeader}>
          <Text style={styles.sectionTitle}>
            Yakınınızdaki Sağlık Kuruluşları
          </Text>
        </View>

        <View style={styles.locationsList}>
          {LOCATIONS.map(item => renderLocationItem(item))}
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
  mapPlaceholder: {
    height: hp(25),
    backgroundColor: COLORS.lightGray,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mapText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
  },
  searchHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  locationsList: {
    marginBottom: SPACING.lg,
  },
  locationItem: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: SPACING.md,
    padding: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  locationContent: {
    flex: 1,
  },
  locationName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationType: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  locationDistance: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
});

export default NavigationScreen;
