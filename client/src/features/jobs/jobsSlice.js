import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchAllJobs = createAsyncThunk('jobs/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/jobs');
    return Array.isArray(data) ? data : data.jobs;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
  }
});

export const createJob = createAsyncThunk('jobs/create', async (jobData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/jobs', jobData);
    return data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create job');
  }
});

export const updateJob = createAsyncThunk('jobs/update', async ({ id, data: jobData }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/api/jobs/${id}`, jobData);
    return data.job;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update job');
  }
});

export const deleteJob = createAsyncThunk('jobs/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/jobs/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: { jobs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllJobs.fulfilled, (state, action) => { state.loading = false; state.jobs = action.payload; })
      .addCase(fetchAllJobs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createJob.fulfilled, (state, action) => { state.jobs.unshift(action.payload); })
      .addCase(updateJob.fulfilled, (state, action) => {
        const idx = state.jobs.findIndex(j => j.id === action.payload.id);
        if (idx !== -1) state.jobs[idx] = action.payload;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(j => j.id !== action.payload);
      });
  },
});

export const selectAllJobs = (state) => state.jobs.jobs;
export const selectJobsLoading = (state) => state.jobs.loading;
export const selectJobsError = (state) => state.jobs.error;
export default jobsSlice.reducer;
