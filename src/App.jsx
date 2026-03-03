import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AddProperty from './pages/AddProperty'
import AdminDashboard from './pages/AdminDashboard'
import UserProducts from './pages/UserProducts'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/add-property" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/user_product" element={<UserProducts />} />
      </Routes>
    </>
  )
}    
