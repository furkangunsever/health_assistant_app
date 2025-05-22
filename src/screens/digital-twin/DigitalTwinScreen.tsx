import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  PanResponder,
} from 'react-native';

import DigitalTwinTabs from '../../components/DigitalTwinTabs';
import DigitalTwinTagItem from '../../components/DigitalTwinTagItem';
import DigitalTwinModelCard from '../../components/DigitalTwinModelCard';
import {
  mockDigitalTwinTags,
  mockDigitalTwinModel,
} from '../../data/mock-digital-twin';

const {width} = Dimensions.get('window');

const DigitalTwinScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const pan = useRef(new Animated.Value(0)).current;

  const changeTab = (index: number) => {
    setActiveTab(index);
    const offset = index * width;
    Animated.spring(pan, {
      toValue: -offset,
      useNativeDriver: true,
    }).start();
    scrollViewRef.current?.scrollTo({x: offset, animated: true});
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // Geçerli konum ve hareket mesafesine göre pan değerini hesaplama
        const newPosition = -activeTab * width + gestureState.dx;

        // Ekranın sol ve sağ sınırlarını aşmaması için kısıtlama
        if (newPosition <= 0 && newPosition >= -width) {
          pan.setValue(newPosition);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Sürükleme mesafesi ve hızına göre hangi sekmeye gideceğimize karar verme
        const velocity = gestureState.vx;
        const moveDistance = gestureState.dx;
        let newTab = activeTab;

        // Eğer sağa doğru yeterince hareket ettiyse veya hızlı hareket ettiyse
        if ((moveDistance > width / 3 || velocity > 0.5) && activeTab === 1) {
          newTab = 0;
        }
        // Eğer sola doğru yeterince hareket ettiyse veya hızlı hareket ettiyse
        else if (
          (moveDistance < -width / 3 || velocity < -0.5) &&
          activeTab === 0
        ) {
          newTab = 1;
        }

        // Geçiş animasyonunu başlat
        changeTab(newTab);
      },
    }),
  ).current;

  const renderTagsList = () => {
    return (
      <FlatList
        data={mockDigitalTwinTags}
        keyExtractor={item => item.id}
        renderItem={({item}) => <DigitalTwinTagItem tag={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  const renderModelView = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.modelContainer}
        showsVerticalScrollIndicator={false}>
        <DigitalTwinModelCard model={mockDigitalTwinModel} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dijital İkiz</Text>
      </View>

      <DigitalTwinTabs activeTab={activeTab} onChangeTab={changeTab} />

      <Animated.View
        style={[styles.contentContainer, {transform: [{translateX: pan}]}]}
        {...panResponder.panHandlers}>
        <View style={styles.pageContainer}>{renderTagsList()}</View>
        <View style={styles.pageContainer}>{renderModelView()}</View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  pageContainer: {
    width,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  modelContainer: {
    padding: 5,
    paddingBottom: 80,
  },
});

export default DigitalTwinScreen;
