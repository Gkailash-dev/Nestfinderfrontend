import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }){
  // simple client-side check: loggedIn flag or role stored in localStorage
  const loggedIn = localStorage.getItem('loggedIn') === 'true' || !!localStorage.getItem('role')
  if (!loggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}