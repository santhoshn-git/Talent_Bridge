import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Grid, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, Skeleton, Alert,
  Chip, Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { fetchAllJobs, selectAllJobs, selectJobsLoading } from '../features/jobs/jobsSlice';
import { fetchAppliedJobs } from '../features/applications/applicationsSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import JobCard from '../components/JobCard';
import Navbar from '../components/Navbar';

export default function JobsPage() {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const loading = useSelector(selectJobsLoading);
  const currentUser = useSelector(selectCurrentUser);

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchAllJobs());
    if (currentUser?.role === 'user') dispatch(fetchAppliedJobs());
  }, [dispatch, currentUser]);

  const locations = useMemo(() => {
    const locs = [...new Set(jobs.map(j => j.location))].sort();
    return ['All', ...locs];
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = !search ||
        job.company_name.toLowerCase().includes(search.toLowerCase()) ||
        job.position.toLowerCase().includes(search.toLowerCase());
      const matchLocation = locationFilter === 'All' || job.location === locationFilter;
      const matchType = typeFilter === 'All' || job.type === typeFilter;
      return matchSearch && matchLocation && matchType;
    });
  }, [jobs, search, locationFilter, typeFilter]);

  const activeFilters = [
    search && `"${search}"`,
    locationFilter !== 'All' && locationFilter,
    typeFilter !== 'All' && typeFilter,
  ].filter(Boolean);

  return (
    <Box sx={{ minHeight: '100vh', background: '#f7f5f0' }}>
      <Navbar />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        py: { xs: 5, md: 7 }, px: 2,
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h3" sx={{
            color: '#fff', mb: 1,
            fontFamily: '"DM Serif Display", serif',
            fontSize: { xs: '2rem', md: '2.8rem' },
          }}>
            Find your next <Box component="span" sx={{ color: '#e86c2f', fontStyle: 'italic' }}>great role</Box>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 4, fontSize: '1rem' }}>
            {jobs.length} opportunities waiting for you
          </Typography>

          {/* Search & Filters */}
          <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search by role or company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              sx={{ flexGrow: 1, minWidth: 200 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>
              }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Location</InputLabel>
              <Select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} label="Location">
                {locations.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Job type</InputLabel>
              <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} label="Job type">
                <MenuItem value="All">All types</MenuItem>
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Box>
      </Box>

      {/* Results */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">Filtering by:</Typography>
            {activeFilters.map(f => (
              <Chip key={f} label={f} size="small" sx={{ background: '#1a1a2e', color: '#fff', fontWeight: 500 }} />
            ))}
            <Typography variant="body2" color="text.secondary">
              — {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        )}

        {/* Loading skeletons */}
        {loading && (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={240} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <WorkOutlineIcon sx={{ fontSize: 56, color: 'rgba(26,26,46,0.15)', mb: 2 }} />
            <Typography variant="h5" sx={{ fontFamily: '"DM Serif Display", serif', mb: 1 }}>
              No jobs found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}

        {/* Job grid */}
        {!loading && filtered.length > 0 && (
          <Grid container spacing={3}>
            {filtered.map(job => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Box className="fade-in-up">
                  <JobCard job={job} />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
