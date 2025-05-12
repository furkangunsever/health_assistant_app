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

// Tab Icon bileşeni
interface TabIconProps {
  focused: boolean;
  label: string;
  iconSource: ImageSourcePropType;
}

const TabIcon: React.FC<TabIconProps> = ({focused, label, iconSource}) => {
  return (
    <View style={styles.tabIconContainer}>
      <View
        style={[
          styles.iconCircle,
          focused ? styles.activeIconCircle : styles.inactiveIconCircle,
        ]}>
        <Image source={iconSource} style={styles.iconImage} />
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
              label="Ana Sayfa"
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
            <TabIcon focused={focused} iconSource={require('../assets/generative.png')} label="AI Chat" />
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
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  activeIconCircle: {
    backgroundColor: COLORS.primary + '22', // %22 opacity
  },
  inactiveIconCircle: {
    backgroundColor: 'transparent',
  },
  iconText: {
    fontSize: FONT_SIZE.sm,
  },
  tabLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '500',
    width: 70,
    textAlign: 'center',
    paddingTop: 8,
  },
  activeTabLabel: {
    color: COLORS.primary,
  },
  inactiveTabLabel: {
    color: COLORS.gray,
  },
});

export default TabNavigator;
