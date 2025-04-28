import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import {onAuthStateChanged} from '../service/firebaseService';
import {loginSuccess, logout} from '../redux/slices/authSlice';
import {User} from '../config/firebase';

const AppNavigator = () => {
  const dispatch = useDispatch();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
