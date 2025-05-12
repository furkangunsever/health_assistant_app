import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MainStackParamList} from './NavigationTypes';

// Ekranlar
import UserProfileScreen from '../screens/main/UserProfileScreen';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={TabNavigator} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
