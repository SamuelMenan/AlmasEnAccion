import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import React from 'react';

interface Props {
  element: JSX.Element;
  roles?: string[]; // required roles any match
}

export function ProtectedRoute({ element, roles }: Props) {
  const auth = useAuth();
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && roles.length && !roles.some(r => auth.roles.includes(r))) {
    return <Navigate to="/" replace />;
  }
  return element;
}