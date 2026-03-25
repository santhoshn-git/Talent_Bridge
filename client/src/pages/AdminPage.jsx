import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Grid, Typography, TextField, Button, Select, MenuItem,
  FormControl, InputLabel, Card, CardContent, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Snackbar, Skeleton, Tooltip, Divider
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { fetchAllJobs, createJob, updateJob, deleteJob, selectAllJobs, selectJobsLoading } from '../features/jobs/jobsSlice';
import { selectCurrentUser } from '../features/auth/authSlice';
import Navbar from '../components/Navbar';

const EMPTY_FORM = { company_name: '', position: '', type: 'Full Time', location: '', description: '', salary_range: '' };

export default function AdminPage() {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const loading = useSelector(selectJobsLoading);
  const currentUser = useSelector(selectCurrentUser);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formError, setFormError] = useState('');

  useEffect(() => { dispatch(fetchAllJobs()); }, [dispatch]);

  const myJobs = jobs.filter(j => j.admin_id === currentUser?.id);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.company_name || !form.position || !form.location) {
      setFormError('Company, position, and location are required.');
      return;
    }
    try {
      if (editingId) {
        await dispatch(updateJob({ id: editingId, data: form })).unwrap();
        setSnackbar({ open: true, message: 'Job updated successfully!', severity: 'success' });
      } else {
        await dispatch(createJob(form)).unwrap();
        setSnackbar({ open: true, message: 'Job created successfully!', severity: 'success' });
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      setSnackbar({ open: true, message: err || 'Something went wrong', severity: 'error' });
    }
  };

  const handleEdit = (job) => {
    setEditingId(job.id);
    setForm({
      company_name: job.company_name,
      position: job.position,
      type: job.type,
      location: job.location,
      description: job.description || '',
      salary_range: job.salary_range || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteJob(deleteId)).unwrap();
      setSnackbar({ open: true, message: 'Job deleted.', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete job.', severity: 'error' });
    }
    setDeleteId(null);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#f7f5f0' }}>
      <Navbar />

      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        py: { xs: 4, md: 6 }, px: 2,
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <DashboardOutlinedIcon sx={{ color: '#e86c2f', fontSize: 28 }} />
            <Typography variant="h3" sx={{
              color: '#fff',
              fontFamily: '"DM Serif Display", serif',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            Manage job listings · {myJobs.length} active posting{myJobs.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 }, py: 4 }}>
        <Grid container spacing={4}>
          {/* Left — Job Form */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 88 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AddCircleOutlineIcon sx={{ color: 'secondary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {editingId ? 'Edit Job' : 'Post a Job'}
                  </Typography>
                </Box>

                {formError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{formError}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField name="company_name" label="Company Name" fullWidth required value={form.company_name} onChange={handleChange} size="small" />
                  <TextField name="position" label="Position Title" fullWidth required value={form.position} onChange={handleChange} size="small" />
                  <FormControl fullWidth size="small">
                    <InputLabel>Job Type</InputLabel>
                    <Select name="type" value={form.type} onChange={handleChange} label="Job Type">
                      <MenuItem value="Full Time">Full Time</MenuItem>
                      <MenuItem value="Part Time">Part Time</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField name="location" label="Location" fullWidth required value={form.location} onChange={handleChange} size="small" />
                  <TextField name="salary_range" label="Salary Range (optional)" fullWidth value={form.salary_range} onChange={handleChange} size="small" placeholder="e.g. $80k–$100k" />
                  <TextField
                    name="description" label="Description (optional)" fullWidth multiline rows={3}
                    value={form.description} onChange={handleChange} size="small"
                  />
                  <Box sx={{ display: 'flex', gap: 1.5, pt: 0.5 }}>
                    <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ fontWeight: 700 }}>
                      {editingId ? 'Update Job' : 'Create Job'}
                    </Button>
                    {editingId && (
                      <Button variant="outlined" onClick={handleCancel} sx={{ flexShrink: 0 }}>
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right — Jobs Table */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkOutlineIcon sx={{ color: 'text.secondary' }} />
              <Typography variant="h6" fontWeight={700}>Your Postings</Typography>
            </Box>

            {loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[...Array(3)].map((_, i) => <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 2 }} />)}
              </Box>
            )}

            {!loading && myJobs.length === 0 && (
              <Card>
                <CardContent sx={{ py: 6, textAlign: 'center' }}>
                  <WorkOutlineIcon sx={{ fontSize: 48, color: 'rgba(26,26,46,0.12)', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontFamily: '"DM Serif Display", serif', mb: 1 }}>
                    No jobs posted yet
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    Use the form on the left to create your first job listing.
                  </Typography>
                </CardContent>
              </Card>
            )}

            {!loading && myJobs.length > 0 && (
              <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: '#f7f5f0' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myJobs.map(job => (
                      <TableRow key={job.id} sx={{
                        '&:hover': { background: '#faf8f5' },
                        background: editingId === job.id ? '#fff8f5' : 'inherit',
                        transition: 'background 0.15s',
                      }}>
                        <TableCell>
                          <Typography fontWeight={600} fontSize="0.875rem">{job.position}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.875rem" color="text.secondary">{job.company_name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={job.type} size="small"
                            sx={{
                              background: job.type === 'Full Time' ? '#e8f4e8' : '#fff3e0',
                              color: job.type === 'Full Time' ? '#2e7d32' : '#e65100',
                              fontWeight: 600, fontSize: '0.72rem',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.875rem" color="text.secondary">{job.location}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleEdit(job)}
                                sx={{ color: 'primary.main', '&:hover': { background: '#eeedfe' } }}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" onClick={() => setDeleteId(job.id)}
                                sx={{ color: 'error.main', '&:hover': { background: '#fdecea' } }}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Delete confirm dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontFamily: '"DM Serif Display", serif' }}>Delete this job?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This action cannot be undone. All applications for this job will also be removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
          <Button onClick={() => setDeleteId(null)} variant="outlined">Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
