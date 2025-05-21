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
} from 'react-native';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import {sendMessageToAI} from '../../service/aiService';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  etiket?: string;
}

const AIAssistantScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben sağlık asistanınız. Size nasıl yardımcı olabilirim?',
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
      const response = await sendMessageToAI('cuma', message);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.yanit,
        isUser: false,
        timestamp: new Date(),
        etiket: response.etiket,
      };

      setMessages(prevMessages => [...prevMessages, aiResponse]);
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
        <Text style={styles.headerTitle}>AI Asistan</Text>
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
          placeholder="Mesajınızı yazın..."
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: hp(4),
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
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
  timestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.gray,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    maxHeight: hp(15),
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    marginLeft: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonImage: {
    width: wp(5),
    height: hp(5),
  },
  disabledButton: {
    backgroundColor: COLORS.gray,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
});

export default AIAssistantScreen;
