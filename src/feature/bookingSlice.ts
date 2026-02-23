import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseAxios } from '../config/axios';

export interface Booking {
  _id: string;
  field: string | { _id: string; name: string; type: string };
  schedule: string | { _id: string; day: string; time: string };
  bookingDate: string; 
  playerName: string;
  tel: string;
  playerId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BookingState {
  items: Booking[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (filters?: { playerName?: string; field?: string; schedule?: string }) => {
    const params = new URLSearchParams();
    if (filters?.playerName) params.append('playerName', filters.playerName);
    if (filters?.field) params.append('field', filters.field);
    if (filters?.schedule) params.append('schedule', filters.schedule);

    const res = await firebaseAxios.get<{ data: Booking[] }>(`/bookings?${params.toString()}`);
    return res.data.data;
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: { 
    field: string; 
    schedule: string; 
    bookingDate: string;
    playerName: string; 
    tel: string 
    playerId?: string;
  }) => {
    const res = await firebaseAxios.post<{ data: Booking }>('/bookings', bookingData);
    return res.data.data;
  }
);

export const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearBookings: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error obteniendo reservas';
      })
      .addCase(createBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error creando reserva';
      });
  },
});

export const selectBookings = (state: { bookings: BookingState }) => state.bookings.items;
export const selectBookingsStatus = (state: { bookings: BookingState }) => state.bookings.status;
export const selectBookingsError = (state: { bookings: BookingState }) => state.bookings.error;

export const { clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;