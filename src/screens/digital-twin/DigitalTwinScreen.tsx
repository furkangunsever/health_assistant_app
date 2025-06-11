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
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {removeTag, clearTags} from '../../redux/slices/digitalTwinSlice';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  SHADOW,
} from '../../utils/theme';

import DigitalTwinTabs from '../../components/DigitalTwinTabs';
import DigitalTwinTagItem from '../../components/DigitalTwinTagItem';
import DigitalTwinModelCard from '../../components/DigitalTwinModelCard';
import {mockDigitalTwinModel} from '../../data/mock-digital-twin';
import {sortTagsByStatus} from '../../utils/digitalTwinMapper';
import {DigitalTwinTag} from '../../types/digital-twin.types';

const {width} = Dimensions.get('window');

const DigitalTwinScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {tags, isLoading} = useSelector(
    (state: RootState) => state.digitalTwin,
  );
  const [activeTab, setActiveTab] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const pan = useRef(new Animated.Value(0)).current;

  // Etiketleri duruma göre sırala (tehlikeli olanlar önce)
  const sortedTags = sortTagsByStatus(tags);

  const bodyPartNames: Record<
    NonNullable<DigitalTwinTag['bodyPart']>,
    string
  > = {
    head: '🧠 Baş',
    neck: '🦒 Boyun',
    chest: '🫁 Göğüs',
    abdomen: '🫃 Karın',
    back: '🔄 Sırt',
    arm: '💪 Kol',
    leg: '🦵 Bacak',
    systemic: '🌐 Sistemik',
    full: '👤 Genel',
  };

  const changeTab = (index: number) => {
    setActiveTab(index);
    const offset = index * width;
    Animated.spring(pan, {
      toValue: -offset,
      useNativeDriver: true,
    }).start();
    scrollViewRef.current?.scrollTo({x: offset, animated: true});
  };

  const handleDeleteTag = (tagId: string) => {
    const tagToDelete = tags.find(tag => tag.id === tagId);
    if (tagToDelete) {
      Alert.alert(
        'Etiketi Sil',
        `"${tagToDelete.name}" etiketini silmek istediğinizden emin misiniz?`,
        [
          {
            text: 'İptal',
            style: 'cancel',
          },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => dispatch(removeTag(tagId)),
          },
        ],
      );
    }
  };

  const handleClearAllTags = () => {
    if (tags.length === 0) {
      Alert.alert('Bilgi', 'Silinecek etiket bulunmuyor.');
      return;
    }

    Alert.alert(
      'Tüm Etiketleri Sil',
      'Tüm sağlık etiketlerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Tümünü Sil',
          style: 'destructive',
          onPress: () => dispatch(clearTags()),
        },
      ],
    );
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
    if (sortedTags.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Henüz Sağlık Etiketi Yok</Text>
          <Text style={styles.emptySubtitle}>
            AI Asistan ile sohbet ederek sağlık durumunuzu analiz ettirin ve
            otomatik etiketler oluşturun.
          </Text>
          <Text style={styles.emptyHint}>
            💡 "Baş ağrım var" veya "Göz çevremde karartı oluşuyor" gibi
            semptomlarınızı AI Asistan'a söyleyin.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.tagsContainer}>
        <View style={styles.tagsHeader}>
          <View style={styles.tagsInfo}>
            <Text style={styles.tagsCount}>
              {sortedTags.length} Sağlık Etiketi
            </Text>
            <Text style={styles.tagsSubtitle}>
              AI Asistan tarafından analiz edildi
            </Text>
          </View>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAllTags}>
            <Text style={styles.clearButtonText}>Temizle</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={sortedTags}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <DigitalTwinTagItem
              tag={item}
              onDelete={() => handleDeleteTag(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderModelView = () => {
    return (
      <View style={styles.fullScreenContainer}>
        <DigitalTwinModelCard model={mockDigitalTwinModel} tags={sortedTags} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header - Ana sayfa stilinde */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Dijital İkiz</Text>
            <Text style={styles.headerSubtitle}>
              {sortedTags.length > 0
                ? `${sortedTags.length} aktif sağlık etiketi`
                : 'AI Asistan ile etiket oluşturun'}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
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
    backgroundColor: COLORS.lightGray,
  },
  // Header - Ana sayfa stilinde
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    ...SHADOW.medium,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    marginTop: 4,
    opacity: 0.9,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  pageContainer: {
    width,
  },
  tagsContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tagsInfo: {
    flex: 1,
  },
  tagsCount: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  tagsSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    marginTop: 2,
  },
  clearButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.error,
    borderRadius: BORDER_RADIUS.sm,
    ...SHADOW.small,
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  listContainer: {
    padding: SPACING.lg,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOW.medium,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  emptyHint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
});

export default DigitalTwinScreen;
