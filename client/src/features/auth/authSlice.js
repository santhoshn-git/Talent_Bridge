import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const userFromStorage = localStorage.getItem('user');
const tokenFromStorage = localStorage.getItem('token');

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/login', credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(
      err.response?.data?.message || err.message || 'Login failed'
    );
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/auth/signup', userData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (err) {
    return rejectWithValue(
      err.response?.data?.message || err.message || 'Signup failed'
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export default authSlice.reducer;
