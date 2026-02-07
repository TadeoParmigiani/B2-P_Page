import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/authSlice";
import bookingReducer from "../feature/bookingSlice";
import fieldReducer from "../feature/fieldSlice"
import scheduleReducer from "../feature/schedulesSlices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    fields: fieldReducer,
    schedules: scheduleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;