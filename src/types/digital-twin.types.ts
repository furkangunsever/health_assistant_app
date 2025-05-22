export interface DigitalTwinTag {
  id: string;
  name: string;
  value: string;
  status: 'normal' | 'warning' | 'danger';
  date: string;
}

export interface DigitalTwinModel {
  id: string;
  userId: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  chronicDiseases: string[];
  allergies: string[];
  lastUpdated: string;
}
