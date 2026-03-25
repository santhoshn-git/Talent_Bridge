import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, Chip, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { useNavigate } from 'react-router-dom';
import { applyToJob, selectAppliedIds, selectApplyingId } from '../features/applications/applicationsSlice';
import { selectCurrentUser } from '../features/auth/authSlice';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} mo ago`;
}

export default function JobCard({ job, showApplied = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appliedIds = useSelector(selectAppliedIds);
  const applyingId = useSelector(selectApplyingId);
  const currentUser = useSelector(selectCurrentUser);
  const isApplied = appliedIds.includes(job.id) || showApplied;
  const isApplying = applyingId === job.id;

  const [openUpload, setOpenUpload] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [submitError, setSubmitError] = React.useState('');

  const typeColor = job.type === 'Full Time'
    ? { bg: '#e8f4e8', color: '#2e7d32' }
    : { bg: '#fff3e0', color: '#e65100' };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(26,26,46,0.12)',
      },
    }}>
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg, #1a1a2e10, #1a1a2e20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(26,26,46,0.08)',
          }}>
            <BusinessOutlinedIcon sx={{ color: '#1a1a2e', fontSize: 22 }} />
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3, mb: 0.25 }} noWrap>
              {job.position}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }} noWrap>
              {job.company_name}
            </Typography>
          </Box>
        </Box>

        {/* Type chip */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={job.type}
            size="small"
            sx={{ background: typeColor.bg, color: typeColor.color, fontWeight: 600, fontSize: '0.72rem' }}
          />
        </Box>

        {/* Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
              {job.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ fontSize: 15, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.82rem' }}>
              {timeAgo(job.created_at)}
            </Typography>
          </Box>
        </Box>

        {job.description && (
          <Typography variant="body2" color="text.secondary" sx={{
            fontSize: '0.82rem', lineHeight: 1.6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {job.description}
          </Typography>
        )}

        {/* Footer */}
        <Box sx={{ mt: 'auto', pt: 1 }}>
          {!showApplied && currentUser?.role === 'user' && (
            isApplied ? (
              <Button fullWidth disabled variant="contained"
                startIcon={<CheckCircleIcon />}
                sx={{
                  background: '#e8f4e8 !important', color: '#2e7d32 !important',
                  border: '1px solid #c8e6c9', fontWeight: 600,
                }}>
                Applied
              </Button>
            ) : (
              <Button
                fullWidth variant="contained" color="secondary"
                onClick={() => {
                  setSubmitError('');
                  setOpenUpload(true);
                }}
                disabled={isApplying}
                sx={{ fontWeight: 600 }}
              >
                {isApplying ? <CircularProgress size={20} color="inherit" /> : 'Apply Now'}
              </Button>
            )
          )}
          {showApplied && (
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
              label="Applied"
              sx={{ background: '#e8f4e8', color: '#2e7d32', fontWeight: 600, width: '100%', borderRadius: 2 }}
            />
          )}
        </Box>
      </CardContent>

      {/* 🔥 MODAL */}
      <Dialog open={openUpload} onClose={() => setOpenUpload(false)}>
        <DialogTitle>Upload Resume</DialogTitle>

        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              setSubmitError('');
              setFile(e.target.files[0]);
            }}
          />

          {file && (
            <Typography sx={{ mt: 1 }}>
              Selected: {file.name}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenUpload(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            disabled={isApplying}
            onClick={async () => {
              if (!file) {
                setSubmitError('Please upload your resume.');
                return;
              }

              try {
                await dispatch(
                  applyToJob({
                    jobId: job.id,
                    file,
                  })
                ).unwrap();

                setOpenUpload(false);
                setFile(null);
                setSubmitError('');
                navigate('/applied');
              } catch (err) {
                setSubmitError(err || 'Failed to submit application.');
              }
            }}
          >
            {isApplying ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogActions>
      </Dialog>      
    </Card>
  );
}
