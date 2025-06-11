import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../../routes/NavigationTypes';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {addTag} from '../../redux/slices/digitalTwinSlice';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import {sendMessageToAI} from '../../service/aiService';
import {
  mapLabelToDigitalTwinTag,
  isValidLabel,
} from '../../utils/digitalTwinMapper';
import {DigitalTwinTag} from '../../types/digital-twin.types';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  etiket?: string;
}

type AIAssistantScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'AI'
>;

const AIAssistantScreen = () => {
  const navigation = useNavigation<AIAssistantScreenNavigationProp>();
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.auth);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben sağlık asistanınız. Size nasıl yardımcı olabilirim? Sağlık durumunuzla ilgili sorularınızı sorabilir, dijital ikiz profilinize etiket ekleyebilirim.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Kullanıcı ID'sini auth state'den al
      const userId = user?.uid || 'anonymous_user11';
      const response = await sendMessageToAI(userId, message);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.yanit,
        isUser: false,
        timestamp: new Date(),
        etiket: response.etiket,
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);

      // Eğer AI'dan etiket geliyorsa, kullanıcıya dijital ikiz profiline ekleme seçeneği sun
      if (response.etiket && response.etiket.trim() !== '') {
        setTimeout(() => {
          Alert.alert(
            'Sağlık Etiketi Tespit Edildi',
            `"${response.etiket}" etiketi dijital ikiz profilinize eklensin mi?`,
            [
              {
                text: 'Hayır',
                style: 'cancel',
              },
              {
                text: 'Evet, Ekle',
                onPress: () => addHealthTag(response.etiket, response.yanit),
              },
            ],
          );
        }, 1000); // AI mesajının görüntülenmesi için kısa bir gecikme
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const addHealthTag = (label: string, aiResponse: string) => {
    try {
      // Önce etiketi geçerlilik kontrolünden geçir
      if (!isValidLabel(label)) {
        console.log(`Geçersiz etiket algılandı: ${label}`);
        // Kullanıcıya geçersiz etiket hakkında bilgi verme
        const infoMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `ℹ️ "${label}" etiketi sistem hatası olarak algılandı ve dijital ikiz profiline eklenmedi.`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prevMessages => [...prevMessages, infoMessage]);
        return;
      }

      // AI'dan gelen etiketi DigitalTwinTag formatına dönüştür
      const digitalTwinTag = mapLabelToDigitalTwinTag(label, aiResponse);

      if (!digitalTwinTag) {
        console.log(`Etiket dönüştürülemedi: ${label}`);
        return;
      }

      // Redux store'a ekle
      dispatch(addTag(digitalTwinTag));

      // Başarı mesajı göster
      const bodyPartText = getBodyPartDisplayName(digitalTwinTag.bodyPart);
      Alert.alert(
        'Başarılı',
        `"${label}" etiketi ${bodyPartText} bölgesine eklendi. Dijital İkiz sekmesinden görüntüleyebilirsiniz.`,
        [{text: 'Tamam'}],
      );

      // Chat'e bilgilendirme mesajı ekle
      const infoMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `✅ "${label}" etiketi ${bodyPartText} bölgesine eklendi.`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prevMessages => [...prevMessages, infoMessage]);
    } catch (error) {
      console.error('Etiket ekleme hatası:', error);
      Alert.alert(
        'Hata',
        'Etiket eklenirken bir hata oluştu. Lütfen tekrar deneyin.',
        [{text: 'Tamam'}],
      );
    }
  };

  // Vücut bölgesi görüntüleme adı
  const getBodyPartDisplayName = (
    bodyPart?: DigitalTwinTag['bodyPart'],
  ): string => {
    const displayNames = {
      head: 'Baş',
      neck: 'Boyun',
      chest: 'Göğüs',
      abdomen: 'Karın',
      back: 'Sırt',
      arm: 'Kol',
      leg: 'Bacak',
      systemic: 'Sistemik (Genel)',
      full: 'Genel',
    };
    return displayNames[bodyPart || 'full'] || 'Bilinmeyen';
  };

  const renderMessage = ({item}: {item: Message}) => (
    <View
      style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
      ]}>
      <Text
        style={[
          styles.messageText,
          item.isUser ? styles.userText : styles.aiText,
        ]}>
        {item.text}
      </Text>
      {item.etiket && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>🏷️ Etiket: {item.etiket}</Text>
        </View>
      )}
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>AI Asistan</Text>
            <Text style={styles.headerSubtitle}>
              Sağlık durumunuzu analiz ediyorum
            </Text>
          </View>
          <TouchableOpacity
            style={styles.digitalTwinButton}
            onPress={() => navigation.navigate('DigitalTwin')}>
            <Image
              source={require('../../assets/algorithm.png')}
              style={styles.digitalTwinIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Sağlık durumunuzla ilgili soru sorun..."
          placeholderTextColor={COLORS.gray}
          multiline
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || isLoading) && styles.disabledButton,
          ]}
          onPress={sendMessage}
          disabled={!message.trim() || isLoading}>
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Image
              source={require('../../assets/send.png')}
              style={styles.sendButtonImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: hp(4),
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 4,
  },
  digitalTwinButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitalTwinIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: SPACING.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: 15,
    marginBottom: SPACING.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.lightGray,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: FONT_SIZE.md,
  },
  userText: {
    color: COLORS.white,
  },
  aiText: {
    color: COLORS.text,
  },
  labelContainer: {
    marginTop: SPACING.sm,
    padding: SPACING.xs,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  labelText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    marginTop: SPACING.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  sendButtonImage: {
    width: 24,
    height: 24,
    tintColor: COLORS.white,
  },
});

export default AIAssistantScreen;
