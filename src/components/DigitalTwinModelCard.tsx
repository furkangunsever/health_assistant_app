import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {DigitalTwinModel} from '../types/digital-twin.types';

interface DigitalTwinModelCardProps {
  model: DigitalTwinModel;
}

const DigitalTwinModelCard: React.FC<DigitalTwinModelCardProps> = ({model}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/digital-twin.png')}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>Dijital İkiziniz</Text>
          <Text style={styles.subtitle}>
            Son güncelleme: {model.lastUpdated}
          </Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Yaş</Text>
            <Text style={styles.infoValue}>{model.age}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Cinsiyet</Text>
            <Text style={styles.infoValue}>
              {model.gender === 'male'
                ? 'Erkek'
                : model.gender === 'female'
                ? 'Kadın'
                : 'Diğer'}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kan Grubu</Text>
            <Text style={styles.infoValue}>{model.bloodType}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Boy</Text>
            <Text style={styles.infoValue}>{model.height} cm</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Kilo</Text>
            <Text style={styles.infoValue}>{model.weight} kg</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>BMI</Text>
            <Text style={styles.infoValue}>
              {(model.weight / Math.pow(model.height / 100, 2)).toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Kronik Hastalıklar</Text>
        {model.chronicDiseases.length > 0 ? (
          model.chronicDiseases.map((disease, index) => (
            <Text key={index} style={styles.listItem}>
              • {disease}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyListText}>
            Kronik hastalık kaydı bulunmamaktadır.
          </Text>
        )}
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Alerjiler</Text>
        {model.allergies.length > 0 ? (
          model.allergies.map((allergy, index) => (
            <Text key={index} style={styles.listItem}>
              • {allergy}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyListText}>
            Alerji kaydı bulunmamaktadır.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E1F5FE',
  },
  headerInfo: {
    marginLeft: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  listSection: {
    marginBottom: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 5,
    marginLeft: 10,
  },
  emptyListText: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    marginLeft: 10,
  },
});

export default DigitalTwinModelCard;
