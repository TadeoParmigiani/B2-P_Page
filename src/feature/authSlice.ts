import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
  type Dispatch,
} from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import type { RootState } from "../store/store";
import { createUserInDB, getUserByFirebaseUid } from "../config/axios";

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

const setToken = (token: string) => localStorage.setItem("token", token);
const removeToken = () => localStorage.removeItem("token");

const retryGetUser = async (firebaseUid: string, maxAttempts = 3, delay = 500) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await getUserByFirebaseUid(firebaseUid);
    } catch (error: any) {
      if (attempt === maxAttempts - 1 || error.response?.status !== 404) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const registerUser = createAsyncThunk<
  AuthUser,
  { name: string; lastName: string; email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async ({ name, lastName, email, password }, { rejectWithValue }) => {
  try {
    const dbUser = await createUserInDB({
      name,
      lastName,
      email,
      password,
      role: 'jugador',
    });

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const token = await firebaseUser.getIdToken();

    setToken(token);

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
    removeToken();
    return rejectWithValue(error.response?.data?.message || error.message || "Error al registrar usuario");
  }
});

export const loginUser = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const token = await firebaseUser.getIdToken();

    setToken(token);

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
    removeToken();
    return rejectWithValue(error.response?.data?.message || error.message || "Error al iniciar sesión");
  }
});

export const observeUser = createAsyncThunk<void, void, { dispatch: Dispatch }>(
  "auth/observeUser",
  async (_, { dispatch }) => {
    onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      dispatch(setLoading(true));

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setToken(token);

          const dbUser = await retryGetUser(firebaseUser.uid);

          if (!dbUser) {
            throw new Error("No se pudo cargar los datos del usuario");
          }

          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            token,
            name: dbUser.name,
            lastName: dbUser.lastName,
            role: dbUser.role,
            dbId: dbUser.id,
          }));
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

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await auth.signOut();
      removeToken();
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
      removeToken();
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