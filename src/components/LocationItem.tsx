import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {COLORS, FONT_SIZE, SPACING} from '../utils/theme';

interface LocationItemProps {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: string;
  rating?: number;
  onPress: () => void;
}

const LocationItem: React.FC<LocationItemProps> = ({
  name,
  address,
  distance,
  type,
  rating,
  onPress,
}) => {
  let typeIcon;
  let bgColor;

  if (type === 'Hastane') {
    typeIcon = require('../assets/hospital.png');
    bgColor = COLORS.primary;
  } else {
    typeIcon = require('../assets/medicine.png');
    bgColor = '#e74c3c'; // Eczane için kırmızı ton
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.iconContainer, {backgroundColor: bgColor}]}>
        <Image source={typeIcon} style={styles.typeIcon} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.nameText} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.addressText} numberOfLines={2}>
          {address}
        </Text>
        <View style={styles.detailsContainer}>
          {rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {rating.toFixed(1)}</Text>
            </View>
          )}
          <View style={styles.distanceContainer}>
            <Image
              source={require('../assets/navigate.png')}
              style={styles.distanceIcon}
            />
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  typeIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  nameText: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  addressText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginBottom: 6,
    lineHeight: 18,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: FONT_SIZE.xs,
    color: '#FF9800',
    fontWeight: '600',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    width: 14,
    height: 14,
    tintColor: COLORS.primary,
    marginRight: 4,
  },
  distanceText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  navigateButton: {
    marginLeft: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
  },
});

export default LocationItem;
