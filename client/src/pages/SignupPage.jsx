import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, InputAdornment, IconButton, CircularProgress, Divider
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { signupUser, selectAuthLoading, selectAuthError, selectCurrentUser, clearError } from '../features/auth/authSlice';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const user = useSelector(selectCurrentUser);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin' : '/jobs', { replace: true });
  }, [user, navigate]);

  useEffect(() => { return () => dispatch(clearError()); }, [dispatch]);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(form));
  };

  const isAdmin = form.email.endsWith('@arnifi.com');

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400,
        borderRadius: '50%', background: 'rgba(232,108,47,0.07)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -150, right: -150, width: 500, height: 500,
        borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

      <Box sx={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: '12px',
            background: 'linear-gradient(135deg, #e86c2f, #ff8c4b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <WorkOutlineIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Typography sx={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.6rem', color: '#fff' }}>
            TalentBridge
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: '0 24px 80px rgba(0,0,0,0.35)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 0.5, textAlign: 'center', fontFamily: '"DM Serif Display", serif' }}>
              Create account
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center', fontSize: '0.9rem' }}>
              Join TalentBridge and find your next opportunity
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}
            {isAdmin && (
              <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
                You'll be registered as an <strong>Admin</strong> with this email domain.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                name="name" label="Full name" fullWidth required
                value={form.name} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><PersonOutlineIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>
                }}
              />
              <TextField
                name="email" label="Email address" type="email" fullWidth required
                value={form.email} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>
                }}
              />
              <TextField
                name="password" label="Password" fullWidth required
                type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(s => !s)} size="small">
                        {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                sx={{ mt: 0.5, py: 1.5, fontSize: '1rem', fontWeight: 600 }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Create account'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />
            <Typography align="center" variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#e86c2f', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
