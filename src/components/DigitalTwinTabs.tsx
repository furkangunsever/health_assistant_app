import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface DigitalTwinTabsProps {
  activeTab: number;
  onChangeTab: (index: number) => void;
}

const DigitalTwinTabs: React.FC<DigitalTwinTabsProps> = ({
  activeTab,
  onChangeTab,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onChangeTab(0)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 0 ? styles.activeTabText : null,
            ]}
          >
            Sağlık Etiketleri
          </Text>
          {activeTab === 0 && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onChangeTab(1)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 1 ? styles.activeTabText : null,
            ]}
          >
            Dijital İkiz Modeli
          </Text>
          {activeTab === 1 && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888888',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '50%',
    backgroundColor: '#2196F3',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default DigitalTwinTabs; 