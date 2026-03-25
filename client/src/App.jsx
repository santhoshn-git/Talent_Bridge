import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import store from './store/store';
import theme from './theme';
import './index.css';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JobsPage from './pages/JobsPage';
import AdminPage from './pages/AdminPage';
import AppliedJobsPage from './pages/AppliedJobsPage';
import AdminApplicationsPage from './pages/AdminApplicationsPage';
import { ProtectedRoute, AdminRoute, UserRoute, PublicRoute } from './components/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
      <Route path="/applied" element={<UserRoute><AppliedJobsPage /></UserRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      <Route path="/admin/applications" element={<AdminRoute><AdminApplicationsPage /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}
