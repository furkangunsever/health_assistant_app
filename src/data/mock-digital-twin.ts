import {DigitalTwinModel, DigitalTwinTag} from '../types/digital-twin.types';

export const mockDigitalTwinTags: DigitalTwinTag[] = [
  {
    id: '1',
    name: 'Migren',
    value: '1',
    status: 'normal',
    date: '2023-05-15',
    bodyPart: 'head',
  },
  {
    id: '2',
    name: 'Üst Solunum Yolu Enfeksiyonu',
    value: '1',
    status: 'normal',
    date: '2023-05-15',
    bodyPart: 'chest',
  },
  {
    id: '3',
    name: 'Alerjik Reaksiyon',
    value: '3',
    status: 'warning',
    date: '2023-05-15',
    bodyPart: 'arm',
  },
  {
    id: '4',
    name: 'Baş Ağrısı',
    value: '2',
    status: 'warning',
    date: '2023-05-14',
    bodyPart: 'head',
  },
  {
    id: '5',
    name: 'Göğüs Ağrısı',
    value: '3',
    status: 'danger',
    date: '2023-05-13',
    bodyPart: 'chest',
  },
  {
    id: '6',
    name: 'Bel Ağrısı',
    value: '2',
    status: 'warning',
    date: '2023-05-12',
    bodyPart: 'back',
  },
  {
    id: '7',
    name: 'Dizde Ağrı',
    value: '2',
    status: 'warning',
    date: '2023-05-11',
    bodyPart: 'leg',
  },
  {
    id: '8',
    name: 'Boyun Gerginliği',
    value: '1',
    status: 'normal',
    date: '2023-05-10',
    bodyPart: 'neck',
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


