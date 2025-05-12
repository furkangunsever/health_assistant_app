import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MainStackParamList} from './NavigationTypes';

// Ekranlar
import HomeScreen from '../screens/main/HomeScreen';
import UserProfileScreen from '../screens/main/UserProfileScreen';

const Stack = createStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserProfile"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
