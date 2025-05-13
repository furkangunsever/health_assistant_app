import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabNavigatorParamList} from './NavigationTypes';
import HomeScreen from '../screens/main/HomeScreen';
import CalendarScreen from '../screens/main/CalendarScreen';
import AIAssistantScreen from '../screens/main/AIAssistantScreen';
import NavigationScreen from '../screens/main/NavigationScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import {COLORS, FONT_SIZE} from '../utils/theme';
import {View, Text, StyleSheet, ImageSourcePropType, Image} from 'react-native';

const Tab = createBottomTabNavigator<TabNavigatorParamList>();

// Normal Tab Icon bileşeni
interface TabIconProps {
  focused: boolean;
  label: string;
  iconSource: ImageSourcePropType;
}

const TabIcon: React.FC<TabIconProps> = ({focused, label, iconSource}) => {
  return (
    <View style={styles.tabIconContainer}>
      <Image
        source={iconSource}
        style={[
          styles.iconImage,
          focused ? styles.activeIcon : styles.inactiveIcon,
        ]}
      />
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.activeTabLabel : styles.inactiveTabLabel,
        ]}>
        {label}
      </Text>
    </View>
  );
};

// AI Assistant için özel dairesel icon bileşeni
const CenterTabIcon: React.FC<TabIconProps> = ({
  focused,
  label,
  iconSource,
}) => {
  return (
    <View style={styles.centerTabIconContainer}>
      <View
        style={[
          styles.centerIconCircle,
          focused
            ? styles.activeCenterIconCircle
            : styles.inactiveCenterIconCircle,
        ]}>
        <Image source={iconSource} style={styles.centerIconImage} />
      </View>
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.activeTabLabel : styles.inactiveTabLabel,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/home.png')}
              label="Anasayfa"
            />
          ),
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/calendar.png')}
              label="Takvim"
            />
          ),
        }}
      />
      <Tab.Screen
        name="AIAssistantTab"
        component={AIAssistantScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <CenterTabIcon
              focused={focused}
              iconSource={require('../assets/generative.png')}
              label="AI"
            />
          ),
        }}
      />
      <Tab.Screen
        name="NavigationTab"
        component={NavigationScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/navigate.png')}
              label="Navigasyon"
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}: {focused: boolean}) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/settings.png')}
              label="Ayarlar"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  activeIcon: {
    tintColor: COLORS.primary,
  },
  inactiveIcon: {
    tintColor: COLORS.gray,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
    width: 70,
    textAlign: 'center',
    marginTop: 4,
  },
  activeTabLabel: {
    color: COLORS.primary,
  },
  inactiveTabLabel: {
    color: COLORS.gray,
  },
  // Merkezdeki AI butonu için stiller
  centerTabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: -25, // Üst tarafa doğru yükseltme
  },
  centerIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeCenterIconCircle: {
    backgroundColor: COLORS.primary,
  },
  inactiveCenterIconCircle: {
    backgroundColor: '#1DA1BC', // Daha açık mavi ton
  },
  centerIconImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
});

export default TabNavigator;
