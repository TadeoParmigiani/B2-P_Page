import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseAxios } from '../config/axios';

export interface Field {
  _id: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
}

interface FieldState {
  items: Field[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FieldState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchFields = createAsyncThunk('fields/fetchFields', async () => {
  const res = await firebaseAxios.get<{ data: Field[] }>('/fields');
  return res.data.data;
});

export const fieldSlice = createSlice({
  name: 'fields',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFields.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFields.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFields.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error obteniendo canchas';
      });
  },
});

export const selectFields = (state: { fields: FieldState }) => state.fields.items;
export const selectFieldsStatus = (state: { fields: FieldState }) => state.fields.status;
export const selectFieldsError = (state: { fields: FieldState }) => state.fields.error;

export default fieldSlice.reducer;