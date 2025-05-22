import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DigitalTwinTag } from '../types/digital-twin.types';

interface DigitalTwinTagItemProps {
  tag: DigitalTwinTag;
}

const DigitalTwinTagItem: React.FC<DigitalTwinTagItemProps> = ({ tag }) => {
  const getStatusColor = () => {
    switch (tag.status) {
      case 'normal':
        return '#4CAF50'; // Yeşil
      case 'warning':
        return '#FF9800'; // Turuncu
      case 'danger':
        return '#F44336'; // Kırmızı
      default:
        return '#4CAF50';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagInfo}>
        <Text style={styles.tagName}>{tag.name}</Text>
        <Text style={styles.tagDate}>{tag.date}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.tagValue}>{tag.value}</Text>
        <View
          style={[
            styles.statusIndicator,
            { backgroundColor: getStatusColor() },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tagInfo: {
    flex: 1,
  },
  tagName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  tagDate: {
    fontSize: 12,
    color: '#888888',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginRight: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default DigitalTwinTagItem; 