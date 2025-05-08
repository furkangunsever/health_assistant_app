import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import {onAuthStateChanged} from '../service/firebaseService';
import {loginSuccess, logout} from '../redux/slices/authSlice';
import {User} from 'firebase/auth';
import {Alert} from 'react-native';
import {SerializableUser} from '../types/auth.types';

const AppNavigator = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const {isAuthenticated, user} = auth;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user: User | null) => {
      if (user) {
        // Firebase kullanıcı nesnesini serileştirilebilir bir formata dönüştür
        const serializableUser: SerializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          metadata: {
            creationTime: user.metadata?.creationTime,
            lastSignInTime: user.metadata?.lastSignInTime,
          },
        };

        // Kullanıcı oturumu var, ancak e-posta doğrulaması gerekebilir
        if (!serializableUser.emailVerified) {
          // E-posta doğrulanmamış kullanıcı durumunda loginSuccess ile kullanıcıyı kaydet
          // ama isAuthenticated false olacak (authSlice içindeki loginSuccess reducer'da ayarlandı)
          dispatch(loginSuccess(serializableUser));

          // Kullanıcı oturum açmış ama e-posta doğrulaması yapmamışsa uyarı göster
          if (serializableUser.email) {
            Alert.alert(
              'E-posta Doğrulama Gerekli',
              `${serializableUser.email} adresine gönderilen doğrulama e-postasını onaylamanız gerekmektedir. Doğrulama yapmadan uygulamaya giriş yapamazsınız.`,
              [{text: 'Tamam', onPress: () => dispatch(logout())}],
            );
          }
        } else {
          // E-posta doğrulanmış, kullanıcıyı oturuma al
          dispatch(loginSuccess(serializableUser));
        }
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isAuthenticated && user && user.emailVerified ? (
        <MainStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
