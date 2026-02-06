import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type Dispatch,
} from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import type { RootState } from "../store/store";
import { createUserInDB, getUserByFirebaseUid } from "../config/axios";

// Define the shape of our user data
export interface AuthUser {
  uid: string;
  email: string | null;
  token: string;
  name?: string;
  lastName?: string;
  role?: 'jugador' | 'admin';
  dbId?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Register new user
export const registerUser = createAsyncThunk<
  AuthUser,
  { name: string; lastName: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async ({ name, lastName, email, password }, { rejectWithValue }) => {
  try {
    // 1. Crear usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const token = await firebaseUser.getIdToken();

    // 2. Guardar token en localStorage
    localStorage.setItem("token", token);

    // 3. Crear usuario en la base de datos
    const dbUser = await createUserInDB({
      name,
      lastName: lastName,
      email,
      role: 'jugador',
      firebaseUid: firebaseUser.uid,
    });

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      token,
      name: dbUser.name,
      lastName: dbUser.lastName,
      role: dbUser.role,
      dbId: dbUser.id,
    };
  } catch (error: any) {
    // Si falla, intentar limpiar
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.delete();
      }
    } catch (deleteError) {
      console.error("Error deleting user:", deleteError);
    }
    localStorage.removeItem("token");
    return rejectWithValue(error.response?.data?.message || error.message || "Error al registrar usuario");
  }
});

// Login existing user
export const loginUser = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();

      // 2. Guardar token
      localStorage.setItem("token", token);

      // 3. Obtener datos del usuario desde la DB
      const dbUser = await getUserByFirebaseUid(firebaseUser.uid);

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        token,
        name: dbUser.name,
        lastName: dbUser.lastName,
        role: dbUser.role,
        dbId: dbUser.id,
      };
    } catch (error: any) {
      localStorage.removeItem("token");
      return rejectWithValue(error.response?.data?.message || error.message || "Error al iniciar sesión");
    }
  }
);

// Observe Firebase user state
export const observeUser = createAsyncThunk<void, void, { dispatch: Dispatch }>(
  "auth/observeUser",
  async (_, { dispatch }) => {
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      dispatch(setLoading(true));
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("token", token);
          
          // Reintentar hasta 3 veces con delay para usuarios recién creados
          let dbUser = null;
          let attempts = 0;
          const maxAttempts = 3;
          
          while (attempts < maxAttempts && !dbUser) {
            try {
              dbUser = await getUserByFirebaseUid(firebaseUser.uid);
            } catch (error: any) {
              attempts++;
              if (attempts < maxAttempts && error.response?.status === 404) {
                // Esperar 500ms antes de reintentar
                await new Promise(resolve => setTimeout(resolve, 500));
              } else {
                throw error;
              }
            }
          }
          
          if (dbUser) {
            dispatch(setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              token,
              name: dbUser.name,
              lastName: dbUser.lastName,
              role: dbUser.role,
              dbId: dbUser.id,
            }));
          } else {
            throw new Error("No se pudo cargar los datos del usuario");
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
      dispatch(setLoading(false));
    });
  }
);

// Logout user
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await auth.signOut();
      localStorage.removeItem("token");
    } catch (error: any) {
      return rejectWithValue(error.message || "Error al cerrar sesión");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { setUser, clearUser, setLoading, clearError } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const getAuthState = (state: RootState) => state.auth;
export default authSlice.reducer;