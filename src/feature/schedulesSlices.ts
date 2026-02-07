import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseAxios } from '../config/axios';
import type { RootState } from '../store/store';

export interface Schedule {
  _id: string;
  field: string | { _id: string; name: string; type: string; pricePerHour?: number };
  day: string;
  time: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ScheduleState {
  items: Schedule[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ScheduleState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchSchedules = createAsyncThunk(
  'schedules/fetchSchedules',
  async (filters?: { field?: string; day?: string; time?: string; available?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.field) params.append('field', filters.field);
    if (filters?.day) params.append('day', filters.day);
    if (filters?.time) params.append('time', filters.time);
    if (filters?.available !== undefined) params.append('available', filters.available.toString());

    const res = await firebaseAxios.get<{ data: Schedule[] }>(`/schedules?${params.toString()}`);
    return res.data.data;
  }
);

export const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectSchedules = (state: RootState) => state.schedules.items;
export const selectSchedulesStatus = (state: RootState) => state.schedules.status;

export default scheduleSlice.reducer;