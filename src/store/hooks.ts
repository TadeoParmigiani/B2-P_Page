import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
import { getAuthState } from '../feature/authSlice'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

// Hook personalizado para Auth
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