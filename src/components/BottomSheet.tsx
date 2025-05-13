import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {COLORS, SPACING} from '../utils/theme';

const {height} = Dimensions.get('window');

interface BottomSheetProps {
  children: React.ReactNode;
  title?: string;
  minHeight?: number;
  maxHeight?: number;
  initialPosition?: 'collapsed' | 'expanded';
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  title = 'Sonuçlar',
  minHeight = height * 0.25,
  maxHeight = height * 0.75,
  initialPosition = 'collapsed',
}) => {
  const [isExpanded, setIsExpanded] = useState(initialPosition === 'expanded');

  const animatedValue = useRef(new Animated.Value(0)).current;

  // İlk pozisyona animasyonla geç
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: initialPosition === 'expanded' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Yatay hareketleri engelle (sadece dikey kaydırmada tepki ver)
        return Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        const deltaY = -gestureState.dy / (maxHeight - minHeight); // yukarı = pozitif
        const newVal = Math.max(
          0,
          Math.min(1, isExpanded ? 1 + deltaY : deltaY),
        );
        animatedValue.setValue(newVal);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldExpand = gestureState.dy < -50;
        const shouldCollapse = gestureState.dy > 50;

        if (shouldExpand) {
          expand();
        } else if (shouldCollapse) {
          collapse();
        } else {
          // eski pozisyona geri dön
          Animated.spring(animatedValue, {
            toValue: isExpanded ? 1 : 0,
            useNativeDriver: false,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  const expand = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: false,
      friction: 8,
    }).start(() => setIsExpanded(true));
  };

  const collapse = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: false,
      friction: 8,
    }).start(() => setIsExpanded(false));
  };

  const toggleExpanded = () => {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  };

  const heightInterpolation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, maxHeight],
  });

  // Tutamacın dönüş açısı animasyonu
  const rotateIcon = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[styles.container, {height: heightInterpolation}]}>
      <View style={styles.header} {...panResponder.panHandlers}>
        <View style={styles.dragHandle} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    height: 56,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingTop: SPACING.md,
  },
});

export default BottomSheet;
