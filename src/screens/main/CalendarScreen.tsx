import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {COLORS, FONT_SIZE, SPACING, hp, wp} from '../../utils/theme';
import {Calendar, Agenda, DateData} from 'react-native-calendars';

// Randevu tipi tanımı
interface Appointment {
  id: number;
  name: string;
  time: string;
  location: string;
  type: string;
}

// Randevu öğesi tipi
type AppointmentItem = {
  [date: string]: Appointment[];
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [markedDates, setMarkedDates] = useState<{[date: string]: any}>({});
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newAppointment, setNewAppointment] = useState<{
    name: string;
    time: string;
    location: string;
    type: string;
  }>({
    name: '',
    time: '',
    location: '',
    type: 'check-up',
  });

  // Örnek randevu verileri
  const [items, setItems] = useState<AppointmentItem>({
    '2023-09-05': [
      {
        id: 1,
        name: 'Dr. Ahmet ile Kontrol',
        time: '10:00',
        location: 'Memorial Hastanesi',
        type: 'check-up',
      },
    ],
    '2023-09-10': [
      {
        id: 2,
        name: 'Diş Kontrolü',
        time: '14:30',
        location: 'Dentist Klinik',
        type: 'dental',
      },
    ],
    '2023-09-18': [
      {
        id: 3,
        name: 'Göz Muayenesi',
        time: '11:15',
        location: 'Göz Merkezi',
        type: 'eye-check',
      },
    ],
  });

  // Seçilen tarih değiştiğinde çağrılacak işlev
  const handleDateSelect = (day: DateData) => {
    const selected = day.dateString;
    setSelectedDate(selected);

    // Seçilen tarihi işaretle
    const updatedMarkedDates: {[date: string]: any} = {
      [selected]: {
        selected: true,
        selectedColor: COLORS.primary,
      },
    };

    // Randevu olan günleri işaretle
    Object.keys(items).forEach(date => {
      if (date === selected) return;

      updatedMarkedDates[date] = {
        marked: true,
        dotColor: COLORS.secondary || '#FF6B6B',
      };
    });

    setMarkedDates(updatedMarkedDates);
  };

  // Yeni randevu ekle
  const handleAddAppointment = () => {
    // Alanları kontrol et
    if (
      !newAppointment.name.trim() ||
      !newAppointment.time.trim() ||
      !newAppointment.location.trim()
    ) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    // Yeni ID oluştur
    const newId =
      Math.max(
        ...Object.values(items)
          .flat()
          .map(item => item.id),
        0,
      ) + 1;

    // Yeni randevuyu ekle
    const newAppointmentObj: Appointment = {
      id: newId,
      ...newAppointment,
    };

    // Mevcut randevuları güncelle
    const updatedItems = {...items};

    if (updatedItems[selectedDate]) {
      updatedItems[selectedDate] = [
        ...updatedItems[selectedDate],
        newAppointmentObj,
      ];
    } else {
      updatedItems[selectedDate] = [newAppointmentObj];
    }

    setItems(updatedItems);
    setIsAddModalVisible(false);

    // Form verilerini temizle
    setNewAppointment({
      name: '',
      time: '',
      location: '',
      type: 'check-up',
    });

    // İşaretli tarihleri güncelle
    updateMarkedDates(updatedItems);
  };

  // Randevu sil
  const handleDeleteAppointment = (appointment: Appointment) => {
    Alert.alert(
      'Randevu Sil',
      `"${appointment.name}" randevusunu silmek istediğinize emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            const updatedItems = {...items};
            updatedItems[selectedDate] = updatedItems[selectedDate].filter(
              item => item.id !== appointment.id,
            );

            // Eğer tarihte hiç randevu kalmadıysa o tarihi kaldır
            if (updatedItems[selectedDate].length === 0) {
              delete updatedItems[selectedDate];
            }

            setItems(updatedItems);

            // Detay modalı açıksa kapat
            if (isDetailModalVisible) {
              setIsDetailModalVisible(false);
            }

            // İşaretli tarihleri güncelle
            updateMarkedDates(updatedItems);
          },
        },
      ],
    );
  };

  // İşaretli tarihleri güncelle
  const updateMarkedDates = (appointmentItems: AppointmentItem) => {
    const updatedMarkedDates: {[date: string]: any} = {
      [selectedDate]: {
        selected: true,
        selectedColor: COLORS.primary,
      },
    };

    Object.keys(appointmentItems).forEach(date => {
      if (date === selectedDate) return;

      updatedMarkedDates[date] = {
        marked: true,
        dotColor: COLORS.secondary || '#FF6B6B',
      };
    });

    setMarkedDates(updatedMarkedDates);
  };

  // Randevu detayını göster
  const showAppointmentDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalVisible(true);
  };

  // Randevu kartını render et
  const renderItem = (item: Appointment) => {
    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => showAppointmentDetail(item)}>
        <View style={styles.appointmentTimeContainer}>
          <Text style={styles.appointmentTime}>{item.time}</Text>
        </View>
        <View style={styles.appointmentDetails}>
          <Text style={styles.appointmentTitle}>{item.name}</Text>
          <Text style={styles.appointmentLocation}>{item.location}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteAppointment(item)}>
          <Image
            source={require('../../assets/delete.png')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Boş günleri render et
  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>
          {selectedDate === new Date().toISOString().split('T')[0]
            ? 'Bugüne ait randevu bulunmamaktadır'
            : 'Bu tarihte randevu bulunmamaktadır'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Takvim</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}>
          <Image
            source={require('../../assets/plus.png')}
            style={{width: 20, height: 20}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Agenda
        items={items}
        selected={selectedDate}
        renderItem={renderItem}
        renderEmptyDate={renderEmptyDate}
        renderEmptyData={() => (
          <View style={styles.emptyDate}>
            <Text style={styles.emptyDateText}>
              {selectedDate === new Date().toISOString().split('T')[0]
                ? 'Bugüne ait randevu bulunmamaktadır'
                : 'Bu tarihte randevu bulunmamaktadır'}
            </Text>
          </View>
        )}
        rowHasChanged={(r1: Appointment, r2: Appointment) => r1.id !== r2.id}
        onDayPress={handleDateSelect}
        theme={{
          agendaDayTextColor: COLORS.primary,
          agendaDayNumColor: COLORS.primary,
          agendaTodayColor: COLORS.primary,
          agendaKnobColor: COLORS.primary,
          backgroundColor: COLORS.background,
          calendarBackground: COLORS.white,
          selectedDayBackgroundColor: COLORS.primary,
          selectedDayTextColor: COLORS.white,
          todayTextColor: COLORS.primary,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.lightGray || '#d9e1e8',
          dotColor: COLORS.secondary || '#FF6B6B',
          selectedDotColor: COLORS.white,
          monthTextColor: COLORS.primary,
          textMonthFontWeight: 'bold',
          textDayFontSize: FONT_SIZE.sm,
          textMonthFontSize: FONT_SIZE.md,
          textDayHeaderFontSize: FONT_SIZE.sm,
        }}
        markedDates={markedDates}
      />

      {/* Randevu Detay Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailModalVisible}
        onRequestClose={() => setIsDetailModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Randevu Detayı</Text>
              <TouchableOpacity onPress={() => setIsDetailModalVisible(false)}>
                <Image
                  source={require('../../assets/close.png')}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {selectedAppointment && (
              <View style={styles.detailContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Randevu:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.name}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Saat:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.time}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Konum:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.location}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tür:</Text>
                  <Text style={styles.detailValue}>
                    {selectedAppointment.type}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteDetailButton}
                  onPress={() => handleDeleteAppointment(selectedAppointment)}>
                  <Image
                    source={require('../../assets/delete.png')}
                    style={{width: 20, height: 20}}
                    resizeMode="contain"
                  />
                  <Text style={styles.deleteDetailButtonText}>
                    Bu Randevuyu Sil
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Yeni Randevu Ekleme Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Randevu Ekle</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Image
                  source={require('../../assets/close.png')}
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tarih:</Text>
              <Text style={styles.dateValue}>{selectedDate}</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Randevu Adı:</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Dr. Ahmet ile Kontrol"
                value={newAppointment.name}
                onChangeText={text =>
                  setNewAppointment({...newAppointment, name: text})
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Saat:</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: 14:30"
                value={newAppointment.time}
                onChangeText={text =>
                  setNewAppointment({...newAppointment, time: text})
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Konum:</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Memorial Hastanesi"
                value={newAppointment.location}
                onChangeText={text =>
                  setNewAppointment({...newAppointment, location: text})
                }
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Tür:</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: check-up"
                value={newAppointment.type}
                onChangeText={text =>
                  setNewAppointment({...newAppointment, type: text})
                }
              />
            </View>

            <TouchableOpacity
              style={styles.addAppointmentButton}
              onPress={handleAddAppointment}>
              <Text style={styles.addAppointmentButtonText}>Randevu Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    justifyContent: 'space-between',
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: SPACING.md,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  appointmentTimeContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentTime: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  appointmentTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 3,
  },
  appointmentLocation: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray || COLORS.text,
  },
  deleteButton: {
    padding: 5,
  },
  emptyDate: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  emptyDateText: {
    color: COLORS.gray || '#999',
    fontSize: FONT_SIZE.sm,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    maxHeight: '80%',
    marginTop: hp(10),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  detailContent: {
    marginTop: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  detailLabel: {
    width: 80,
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  detailValue: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  deleteDetailButton: {
    backgroundColor: COLORS.error || 'red',
    borderRadius: 8,
    padding: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  deleteDetailButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: 'bold',
    marginBottom: 4,
    color: COLORS.text,
  },
  dateValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: COLORS.lightGray || '#f0f0f0',
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  addAppointmentButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  addAppointmentButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.md,
  },
});

export default CalendarScreen;
