import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Skeleton, Button } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useNavigate } from 'react-router-dom';
import { fetchAppliedJobs, selectAppliedJobs, selectApplicationsLoading } from '../features/applications/applicationsSlice';
import JobCard from '../components/JobCard';
import Navbar from '../components/Navbar';

export default function AppliedJobsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appliedJobs = useSelector(selectAppliedJobs);
  const loading = useSelector(selectApplicationsLoading);

  useEffect(() => { dispatch(fetchAppliedJobs()); }, [dispatch]);

  return (
    <Box sx={{ minHeight: '100vh', background: '#f7f5f0' }}>
      <Navbar />

      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        py: { xs: 4, md: 6 }, px: 2,
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Typography variant="h3" sx={{
            color: '#fff', mb: 1,
            fontFamily: '"DM Serif Display", serif',
            fontSize: { xs: '1.8rem', md: '2.5rem' },
          }}>
            My Applications
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            {appliedJobs.length} job{appliedJobs.length !== 1 ? 's' : ''} applied
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        {loading && (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={240} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && appliedJobs.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <BookmarkBorderIcon sx={{ fontSize: 64, color: 'rgba(26,26,46,0.15)', mb: 2 }} />
            <Typography variant="h5" sx={{ fontFamily: '"DM Serif Display", serif', mb: 1 }}>
              No applications yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              You haven't applied to any jobs yet. Start exploring!
            </Typography>
            <Button variant="contained" onClick={() => navigate('/jobs')} sx={{ fontWeight: 600 }}>
              Browse Jobs
            </Button>
          </Box>
        )}

        {!loading && appliedJobs.length > 0 && (
          <Grid container spacing={3}>
            {appliedJobs.map(job => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Box className="fade-in-up">
                  <JobCard job={job} showApplied />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
