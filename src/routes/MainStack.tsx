import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {MainStackParamList} from './NavigationTypes';

// Ekranlar (şimdilik sadece Home ekranı)
import HomeScreen from '../screens/main/HomeScreen';

const Stack = createStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
