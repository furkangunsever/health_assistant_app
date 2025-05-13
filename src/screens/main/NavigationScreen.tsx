import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Circle} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {COLORS, FONT_SIZE, SPACING, hp} from '../../utils/theme';

// Google Places API anahtarı
const GOOGLE_PLACES_API_KEY = 'AIzaSyB8-uCj_ZX4k-gfeXGMgQgD8ZSRp7WpGg0';

interface LocationItem {
  id: string;
  name: string;
  address: string;
  distance: string;
  type: string;
  coordinate?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  vicinity?: string;
}

// Varsayılan veriler (API yanıt alınamazsa gösterilecek)
const FALLBACK_LOCATIONS: LocationItem[] = [
  {
    id: '1',
    name: 'Özel Medicana Hastanesi',
    address: 'Beylikdüzü, İstanbul',
    distance: '2.3 km',
    type: 'Hastane',
    coordinate: {
      latitude: 38.420556,
      longitude: 27.130833,
    },
  },
  {
    id: '2',
    name: 'Medilife Tıp Merkezi',
    address: 'Esenyurt, İstanbul',
    distance: '3.5 km',
    type: 'Tıp Merkezi',
    coordinate: {
      latitude: 38.418333,
      longitude: 27.128333,
    },
  },
  {
    id: '3',
    name: 'Çağdaş Eczanesi',
    address: 'Avcılar, İstanbul',
    distance: '1.8 km',
    type: 'Eczane',
    coordinate: {
      latitude: 38.423333,
      longitude: 27.132222,
    },
  },
];

const PLACE_TYPES = {
  Hastane: 'hospital',
  Eczane: 'pharmacy',
};

const NavigationScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [region, setRegion] = useState({
    latitude: 38.420556,
    longitude: 27.130833,
    latitudeDelta: 0.0722,
    longitudeDelta: 0.0321,
  });

  const [activeLocationType, setActiveLocationType] = useState('Hastane');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredLocations = locations.filter(
    location =>
      location.type === activeLocationType || location.type === 'Tıp Merkezi',
  );

  useEffect(() => {
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });

    requestLocationPermission();
  }, []);

  // Konum tipi değiştiğinde yakındaki yerleri tekrar ara
  useEffect(() => {
    if (userLocation) {
      fetchNearbyPlaces(
        userLocation.latitude,
        userLocation.longitude,
        activeLocationType,
      );
    }
  }, [activeLocationType, userLocation]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getCurrentLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum İzni',
            message:
              'Yakındaki sağlık kuruluşlarını gösterebilmek için konum iznine ihtiyacımız var.',
            buttonPositive: 'Tamam',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Konum İzni Gerekli', 'İzin verilmedi.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.0722,
          longitudeDelta: 0.0321,
        };
        setUserLocation({latitude, longitude});
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);

        // Kullanıcı konumu alındıktan sonra yakındaki yerleri ara
        fetchNearbyPlaces(latitude, longitude, activeLocationType);
      },
      error => {
        console.log('Konum alınamadı:', error);
        Alert.alert('Konum Hatası', 'Konum alınamadı. Lütfen tekrar deneyin.');
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000,
      },
    );
  };

  // Google Places API ile yakındaki sağlık kuruluşlarını arama
  const fetchNearbyPlaces = async (lat: number, lng: number, type: string) => {
    setLoading(true);
    try {
      const placeType =
        PLACE_TYPES[type as keyof typeof PLACE_TYPES] || 'hospital';
      const radius = 5000; // 5 km yarıçap
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${placeType}&key=${GOOGLE_PLACES_API_KEY}`;

      console.log('API isteği yapılıyor:', url);

      const response = await fetch(url);
      const data = await response.json();

      console.log('API yanıtı:', data.status);

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const placesData: LocationItem[] = data.results.map(
          (place: any, index: number) => {
            // Mesafe hesapla
            const distance = calculateDistance(
              lat,
              lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            return {
              id: place.place_id || `place-${index}`,
              name: place.name,
              address: place.vicinity,
              distance: `${distance.toFixed(1)} km`,
              type: type,
              rating: place.rating,
              vicinity: place.vicinity,
              coordinate: {
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              },
            };
          },
        );

        // Mesafeye göre sırala
        placesData.sort((a, b) => {
          const distA = parseFloat(a.distance.replace(' km', ''));
          const distB = parseFloat(b.distance.replace(' km', ''));
          return distA - distB;
        });

        setLocations(placesData);
      } else {
        console.log(
          'API yanıtında sonuç bulunamadı, varsayılan verileri kullanıyoruz',
        );
        setLocations(FALLBACK_LOCATIONS.filter(loc => loc.type === type));
      }
    } catch (error) {
      console.error('Yakındaki yerler alınırken hata oluştu:', error);
      setLocations(FALLBACK_LOCATIONS.filter(loc => loc.type === type));
    } finally {
      setLoading(false);
    }
  };

  // İki koordinat arasındaki mesafeyi hesaplama (Haversine formülü)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Dünya yarıçapı (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  // Radyan dönüşümü
  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };

  const onMapReady = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        {
          ...userLocation,
          latitudeDelta: 0.0722,
          longitudeDelta: 0.0321,
        },
        1000,
      );
    }
  };

  const renderLocationItem = (item: LocationItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.locationItem}
      onPress={() => {
        if (item.coordinate) {
          const newRegion = {
            ...region,
            latitude: item.coordinate.latitude,
            longitude: item.coordinate.longitude,
          };
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion);
        }
      }}>
      <View>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
        <View style={styles.locationInfo}>
          <Text style={styles.locationType}>{item.type}</Text>
          <Text style={styles.locationDistance}>{item.distance}</Text>
        </View>
        {item.rating && (
          <Text style={styles.locationRating}>
            ⭐ {item.rating.toFixed(1)} / 5
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigasyon</Text>
      </View>

      <View style={styles.filterContainer}>
        {['Hastane', 'Eczane'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              activeLocationType === type && styles.activeFilterButton,
            ]}
            onPress={() => setActiveLocationType(type)}>
            <Text
              style={[
                styles.filterText,
                activeLocationType === type && styles.activeFilterText,
              ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={onMapReady}>
          {userLocation && (
            <Circle
              center={userLocation}
              radius={1000}
              fillColor="rgba(65, 105, 225, 0.2)"
              strokeColor="rgba(65, 105, 225, 0.5)"
              strokeWidth={2}
            />
          )}

          {filteredLocations.map(
            loc =>
              loc.coordinate && (
                <Marker
                  key={loc.id}
                  coordinate={loc.coordinate}
                  title={loc.name}
                  description={loc.address}
                />
              ),
          )}
        </MapView>

        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={getCurrentLocation}>
          <Text style={styles.myLocationButtonText}>📍</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          Yakınınızdaki {activeLocationType}ler
        </Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loadingIndicator}
          />
        ) : (
          <ScrollView
            style={styles.locationsList}
            contentContainerStyle={styles.locationsListContent}>
            {filteredLocations.length > 0 ? (
              filteredLocations.map(renderLocationItem)
            ) : (
              <Text style={styles.noResultsText}>
                Yakında {activeLocationType.toLowerCase()} bulunamadı.
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: hp(4),
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
  },
  filterButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 20,
    marginHorizontal: SPACING.sm,
    backgroundColor: COLORS.lightGray,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.gray,
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: hp(40),
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  myLocationButton: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.white,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  myLocationButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },
  locationsList: {
    flex: 1,
  },
  locationsListContent: {
    paddingBottom: SPACING.md,
  },
  locationItem: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: SPACING.md,
    padding: SPACING.md,
    elevation: 3,
  },
  locationName: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  locationAddress: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  locationType: {
    fontSize: FONT_SIZE.xs,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    borderRadius: 10,
    color: COLORS.gray,
  },
  locationDistance: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  locationRating: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.secondary,
    marginTop: SPACING.xs,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: SPACING.xl,
    color: COLORS.gray,
    fontSize: FONT_SIZE.md,
  },
});

export default NavigationScreen;
