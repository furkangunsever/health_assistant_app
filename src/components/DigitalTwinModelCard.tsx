import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import Body from 'react-native-body-highlighter';
import {DigitalTwinModel, DigitalTwinTag} from '../types/digital-twin.types';
import {convertTagsToBodyHighlights} from '../utils/digitalTwinMapper';
import {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  SHADOW,
} from '../utils/theme';

interface DigitalTwinModelCardProps {
  model: DigitalTwinModel;
  tags?: DigitalTwinTag[];
}

const {width, height} = Dimensions.get('window');

const DigitalTwinModelCard: React.FC<DigitalTwinModelCardProps> = ({
  model,
  tags = [],
}) => {
  const [side, setSide] = useState<'front' | 'back'>('front');

  // Sağlık etiketlerine göre hangi vücut bölgelerinin renklendirilmesi gerektiğini belirle
  const getHighlightedBodyParts = () => {
    if (!tags || tags.length === 0) {
      return [];
    }

    const activeIssues = tags.filter(
      tag => tag.status === 'warning' || tag.status === 'danger',
    );
    const bodyHighlights: any[] = [];

    activeIssues.forEach(tag => {
      let bodyParts: string[] = [];
      let intensity = tag.status === 'danger' ? 2 : 1;

      // Tag'deki bodyPart'ı Body highlighter'ın kabul ettiği format çevir
      switch (tag.bodyPart) {
        case 'head':
          bodyParts = ['head'];
          break;
        case 'chest':
          bodyParts = ['chest'];
          break;
        case 'arm':
          bodyParts = ['biceps', 'forearm'];
          break;
        case 'back':
          bodyParts = ['upper-back', 'lower-back'];
          break;
        case 'leg':
          bodyParts = ['quadriceps', 'calves'];
          break;
        case 'neck':
          bodyParts = ['neck'];
          break;
        case 'abdomen':
          bodyParts = ['abs'];
          break;
        default:
          return; // Tanımsız body part varsa atla
      }

      bodyParts.forEach(part => {
        bodyHighlights.push({
          slug: part,
          intensity: intensity,
        });
      });
    });

    return bodyHighlights;
  };

  // Vücut bölgesine tıklama olayı
  const onBodyPartPress = (bodyPart: any, bodyPartSide?: string) => {
    console.log('Tıklanan vücut bölgesi:', bodyPart, bodyPartSide);
    // Burada istediğiniz aksiyonu yapabilirsiniz
  };

  // Sağlık durumu özeti
  const getHealthSummary = () => {
    const activeIssues = tags.filter(
      tag => tag.status === 'warning' || tag.status === 'danger',
    );
    return {
      totalIssues: activeIssues.length,
      dangerCount: activeIssues.filter(tag => tag.status === 'danger').length,
      warningCount: activeIssues.filter(tag => tag.status === 'warning').length,
    };
  };

  const healthSummary = getHealthSummary();
  const bodyHighlights = convertTagsToBodyHighlights(tags);

  // Debug: Etiketleri ve highlights'ları kontrol et
  console.log('=== DigitalTwinModelCard Debug ===');
  console.log('Tags:', tags);
  console.log('Body Highlights:', bodyHighlights);
  console.log('Health Summary:', healthSummary);

  const colors = [COLORS.warning, COLORS.error]; // Tema renkleri kullan

  // Model renk seçenekleri
  const modelColors = {
    // Ana model rengi (vücut rengi)
    bodyColor: '#E8F4FD', // Açık mavi ton
    // Highlight renkleri (sağlık sorunları için)
    highlightColors: ['#FFA726', '#EF5350'], // Turuncu ve kırmızı
    // Çizgi rengi
    strokeColor: '#1976D2', // Koyu mavi
  };

  return (
    <View style={styles.container}>
      {/* 3D İnsan Modeli */}
      <View style={styles.bodyContainer}>
        <Body
          data={bodyHighlights as any}
          onBodyPartPress={onBodyPartPress}
          colors={modelColors.highlightColors}
          gender={model.gender === 'female' ? 'female' : 'male'}
          side={side}
          scale={1.7}
          border={modelColors.strokeColor}
        />
      </View>

      {/* Ön/Arka Değiştirme Butonu */}
      <TouchableOpacity
        style={styles.flipButton}
        onPress={() => setSide(side === 'front' ? 'back' : 'front')}>
        <Text style={styles.flipButtonText}>
          {side === 'front' ? 'Arkayı Göster' : 'Önü Göster'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    width: width,
    height: height,
  },
  healthSummary: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOW.medium,
  },
  healthTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  healthInfo: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.error,
  },
  healthGood: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.success,
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  flipButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
    ...SHADOW.small,
  },
  flipButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
});

export default DigitalTwinModelCard;
