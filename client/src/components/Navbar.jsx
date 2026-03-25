import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, Button, Typography, Avatar, Menu,
  MenuItem, Divider, IconButton, useMediaQuery, Drawer, List, ListItem
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { logout, selectCurrentUser } from '../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setAnchorEl(null);
    setDrawerOpen(false);
  };

  const navLinks = user?.role === 'admin'
    ? [
        { label: 'Dashboard', to: '/admin', icon: <DashboardOutlinedIcon fontSize="small" /> },
        { label: 'Applications', to: '/admin/applications', icon: <FolderOpenOutlinedIcon fontSize="small" /> },
      ]
    : [
        { label: 'Jobs', to: '/jobs', icon: <WorkOutlineIcon fontSize="small" /> },
        { label: 'My Applications', to: '/applied', icon: <BookmarkBorderIcon fontSize="small" /> },
      ];

  return (
    <AppBar position="sticky" elevation={0} sx={{
      background: 'rgba(26,26,46,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, sm: 3 }, py: 0.5 }}>
        {/* Logo */}
        <Box
          onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/jobs')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', mr: 4 }}
        >
          <Box sx={{
            width: 32, height: 32, borderRadius: '8px',
            background: 'linear-gradient(135deg, #e86c2f, #ff8c4b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <WorkOutlineIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Typography sx={{
            fontFamily: '"DM Serif Display", serif',
            fontSize: '1.2rem',
            color: '#fff',
            letterSpacing: '-0.3px',
          }}>
            TalentBridge
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop nav */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <Button
                    startIcon={link.icon}
                    sx={{
                      color: isActive ? '#e86c2f' : 'rgba(255,255,255,0.7)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.875rem',
                      px: 2,
                      '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.06)' },
                    }}
                  >
                    {link.label}
                  </Button>
                )}
              </NavLink>
            ))}
          </Box>
        )}

        {/* Avatar / menu */}
        {user && (
          <>
            <Box
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer',
                    px: 1.5, py: 0.75, borderRadius: 3,
                    '&:hover': { background: 'rgba(255,255,255,0.06)' } }}
            >
              <Avatar sx={{
                width: 32, height: 32, fontSize: '0.8rem', fontWeight: 600,
                background: 'linear-gradient(135deg, #e86c2f, #ff8c4b)',
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              {!isMobile && (
                <Box>
                  <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 500, lineHeight: 1.2 }}>
                    {user.name}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem', lineHeight: 1.2, textTransform: 'capitalize' }}>
                    {user.role}
                  </Typography>
                </Box>
              )}
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: { mt: 1.5, borderRadius: 2, minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.25, color: 'error.main' }}>
                <LogoutIcon fontSize="small" /> Sign out
              </MenuItem>
            </Menu>
          </>
        )}

        {/* Mobile menu button */}
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff', ml: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography fontWeight={600}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider />
          <List>
            {navLinks.map(link => (
              <ListItem key={link.to} disablePadding>
                <NavLink to={link.to} style={{ textDecoration: 'none', width: '100%' }} onClick={() => setDrawerOpen(false)}>
                  <Button fullWidth startIcon={link.icon} sx={{ justifyContent: 'flex-start', px: 2, py: 1.5, color: 'text.primary' }}>
                    {link.label}
                  </Button>
                </NavLink>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <Button fullWidth startIcon={<LogoutIcon />} onClick={handleLogout}
                sx={{ justifyContent: 'flex-start', px: 2, py: 1.5, color: 'error.main' }}>
                Sign out
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
