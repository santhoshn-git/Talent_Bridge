import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchAppliedJobs = createAsyncThunk(
  'applications/fetchApplied',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/jobs/applications/mine');
      return data.applications;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch applications'
      );
    }
  }
);

export const applyToJob = createAsyncThunk(
  'applications/apply',
  async ({ jobId, file }, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const uploadRes = await api.post('/api/upload', formData);
      const resume_url = uploadRes.data.url;

      await api.post(`/api/jobs/${jobId}/apply`, { resume_url });

      let appliedJobs = null;
      try {
        appliedJobs = await dispatch(fetchAppliedJobs()).unwrap();
      } catch {
        appliedJobs = null;
      }

      return { jobId, appliedJobs };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to apply'
      );
    }
  }
);

export const fetchAllApplications = createAsyncThunk(
  'applications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/applications');
      return data.applications;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch all applications'
      );
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    appliedJobs: [],
    appliedIds: [],
    allApplications: [],
    loading: false,
    error: null,
    applyingId: null,
  },
  reducers: {
    clearApplicationsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload;
        state.appliedIds = action.payload.map((job) => job.id);
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(applyToJob.pending, (state, action) => {
        state.error = null;
        state.applyingId = action.meta.arg.jobId;
      })
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.applyingId = null;

        if (Array.isArray(action.payload.appliedJobs)) {
          state.appliedJobs = action.payload.appliedJobs;
          state.appliedIds = action.payload.appliedJobs.map((job) => job.id);
          return;
        }

        if (!state.appliedIds.includes(action.payload.jobId)) {
          state.appliedIds.push(action.payload.jobId);
        }
      })
      .addCase(applyToJob.rejected, (state, action) => {
        state.applyingId = null;
        state.error = action.payload;
      })
      .addCase(fetchAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.allApplications = action.payload;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearApplicationsError } = applicationsSlice.actions;

export const selectAppliedJobs = (state) => state.applications.appliedJobs;
export const selectAppliedIds = (state) => state.applications.appliedIds;
export const selectApplicationsLoading = (state) => state.applications.loading;
export const selectApplyingId = (state) => state.applications.applyingId;
export const selectAllApplications = (state) =>
  state.applications.allApplications;

export default applicationsSlice.reducer;
