import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';

export function ProtectedRoute({ children }) {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function AdminRoute({ children }) {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/jobs" replace />;
  return children;
}

export function UserRoute({ children }) {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'user') return <Navigate to="/admin" replace />;
  return children;
}

export function PublicRoute({ children }) {
  const user = useSelector(selectCurrentUser);
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/jobs'} replace />;
  return children;
}
