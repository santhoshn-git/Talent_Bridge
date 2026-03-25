import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Link,
  Skeleton,
  Typography,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import Navbar from '../components/Navbar';
import {
  fetchAllApplications,
  selectAllApplications,
  selectApplicationsLoading,
} from '../features/applications/applicationsSlice';

function formatAppliedDate(value) {
  return new Date(value).toLocaleString();
}

export default function AdminApplicationsPage() {
  const dispatch = useDispatch();
  const applications = useSelector(selectAllApplications);
  const loading = useSelector(selectApplicationsLoading);

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

  return (
    <Box sx={{ minHeight: '100vh', background: '#f7f5f0' }}>
      <Navbar />

      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
          py: { xs: 4, md: 6 },
          px: 2,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <FolderOpenOutlinedIcon sx={{ color: '#e86c2f', fontSize: 28 }} />
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontFamily: '"DM Serif Display", serif',
                fontSize: { xs: '1.8rem', md: '2.5rem' },
              }}
            >
              Applications
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            Review applicants for your job postings · {applications.length} total
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        {loading && (
          <Grid container spacing={3}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Skeleton variant="rounded" height={240} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && applications.length === 0 && (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <FolderOpenOutlinedIcon sx={{ fontSize: 52, color: 'rgba(26,26,46,0.15)', mb: 2 }} />
              <Typography variant="h5" sx={{ fontFamily: '"DM Serif Display", serif', mb: 1 }}>
                No applications yet
              </Typography>
              <Typography color="text.secondary">
                Applications from users will show up here once they apply to your jobs.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!loading && applications.length > 0 && (
          <Grid container spacing={3}>
            {applications.map((application) => (
              <Grid item xs={12} md={6} key={application.id}>
                <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 10px 30px rgba(26,26,46,0.08)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {application.position}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                          {application.company_name}
                        </Typography>
                      </Box>
                      <Chip
                        label={application.type}
                        size="small"
                        sx={{
                          alignSelf: 'flex-start',
                          background: application.type === 'Full Time' ? '#e8f4e8' : '#fff3e0',
                          color: application.type === 'Full Time' ? '#2e7d32' : '#e65100',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'grid', gap: 1.25, mb: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonOutlineOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Typography variant="body2">
                          {application.applicant_name} · {application.applicant_email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PlaceOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Typography variant="body2">{application.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ScheduleOutlinedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                        <Typography variant="body2">
                          Applied on {formatAppliedDate(application.applied_at)}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      component={Link}
                      href={application.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      startIcon={<DescriptionOutlinedIcon />}
                      sx={{ fontWeight: 700 }}
                    >
                      View Resume
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
