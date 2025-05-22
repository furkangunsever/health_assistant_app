import {DigitalTwinModel, DigitalTwinTag} from '../types/digital-twin.types';

export const mockDigitalTwinTags: DigitalTwinTag[] = [
  {
    id: '1',
    name: 'Migren',
    value: '1',
    status: 'normal',
    date: '2023-05-15',
  },
  {
    id: '2',
    name: 'Üst Solunum Yolu Enfeksiyonu',
    value: '1',
    status: 'normal',
    date: '2023-05-15',
  },
  {
    id: '3',
    name: 'Alerjik Reaksiyon',
    value: '3',
    status: 'warning',
    date: '2023-05-15',
  },
  
];

export const mockDigitalTwinModel: DigitalTwinModel = {
  id: '123456',
  userId: 'user123',
  height: 175,
  weight: 75,
  age: 35,
  gender: 'male',
  bloodType: 'A Rh+',
  chronicDiseases: ['Hipertansiyon', 'Tip 2 Diyabet'],
  allergies: ['Polen', 'Penisilin'],
  lastUpdated: '2023-05-15',
};
