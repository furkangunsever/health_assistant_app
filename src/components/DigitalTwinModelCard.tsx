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
  const colors = ['#FF9800', '#F44336']; // Turuncu (warning), Kırmızı (danger)

  return (
    <View style={styles.container}>
      {/* Sağlık Durumu Özeti */}
      <View style={styles.healthSummary}>
        <Text style={styles.healthTitle}>Dijital İkiz Sağlık Durumu</Text>
        {healthSummary.totalIssues > 0 ? (
          <Text style={styles.healthInfo}>
            {healthSummary.dangerCount} kritik, {healthSummary.warningCount}{' '}
            uyarı
          </Text>
        ) : (
          <Text style={styles.healthGood}>Sağlık durumu iyi</Text>
        )}
      </View>

      {/* 3D İnsan Modeli */}
      <View style={styles.bodyContainer}>
        <Body
          data={getHighlightedBodyParts()}
          onBodyPartPress={onBodyPartPress}
          colors={colors}
          gender={model.gender === 'female' ? 'female' : 'male'}
          side={side}
          scale={2.2}
          border="none"
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
    backgroundColor: '#F5F7FA',
    width: width,
    height: height,
  },
  healthSummary: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  healthInfo: {
    fontSize: 14,
    color: '#F44336',
  },
  healthGood: {
    fontSize: 14,
    color: '#4CAF50',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  flipButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 20,
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DigitalTwinModelCard;
