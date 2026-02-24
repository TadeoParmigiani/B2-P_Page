import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
import { getAuthState } from '../feature/authSlice'
import { selectBookings, selectBookingsStatus} from '../feature/bookingSlice'
import { selectFields, selectFieldsStatus } from '../feature/fieldSlice'
import { selectSchedules, selectSchedulesStatus } from '../feature/schedulesSlices'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useAuth = () => {
  const auth = useAppSelector(getAuthState);

  return {
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: !!auth.user,
    isJugador: auth.user?.role === 'jugador',
    isAdmin: auth.user?.role === 'admin',
  };
};

export const useBookings = () => {
  const bookings = useAppSelector(selectBookings);
  const status = useAppSelector(selectBookingsStatus);

  return {
    bookings,
    loading: status === 'loading',
    error: null,
  };
};

export const useFields = () => {
  const fields = useAppSelector(selectFields);
  const status = useAppSelector(selectFieldsStatus);

  return {
    fields,
    loading: status === 'loading' 
  };
};

export const useSchedules = () => {
  const schedules = useAppSelector(selectSchedules);
  const status = useAppSelector(selectSchedulesStatus);

  return {
    schedules,
    loading: status === 'loading' 
  };
};