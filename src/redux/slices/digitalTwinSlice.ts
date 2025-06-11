import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DigitalTwinTag} from '../../types/digital-twin.types';

interface DigitalTwinState {
  tags: DigitalTwinTag[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DigitalTwinState = {
  tags: [],
  isLoading: false,
  error: null,
};

const digitalTwinSlice = createSlice({
  name: 'digitalTwin',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<DigitalTwinTag>) => {
      // Aynı etiket varsa güncelle, yoksa ekle
      const existingTagIndex = state.tags.findIndex(
        tag => tag.name === action.payload.name,
      );

      if (existingTagIndex >= 0) {
        // Mevcut etiketi güncelle
        state.tags[existingTagIndex] = {
          ...state.tags[existingTagIndex],
          ...action.payload,
          date: new Date().toISOString().split('T')[0], // Bugünün tarihini ekle
        };
      } else {
        // Yeni etiket ekle
        state.tags.push({
          ...action.payload,
          id: Date.now().toString(), // Benzersiz ID oluştur
          date: new Date().toISOString().split('T')[0],
        });
      }
    },

    removeTag: (state, action: PayloadAction<string>) => {
      state.tags = state.tags.filter(tag => tag.id !== action.payload);
    },

    updateTagStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: 'normal' | 'warning' | 'danger';
      }>,
    ) => {
      const tag = state.tags.find(tag => tag.id === action.payload.id);
      if (tag) {
        tag.status = action.payload.status;
      }
    },

    clearTags: state => {
      state.tags = [];
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addTag,
  removeTag,
  updateTagStatus,
  clearTags,
  setLoading,
  setError,
} = digitalTwinSlice.actions;

export default digitalTwinSlice.reducer;
