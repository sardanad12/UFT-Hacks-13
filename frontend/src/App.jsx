import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Lessons from './pages/Lessons'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Profile from './pages/Profile'
import Speaking from './components/Speaking'
import TestWebSocket from './components/TestWebSocket'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes wrapped in Layout */}
          <Route 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/speaking" element={<Speaking />} />
            <Route path="/test-ws" element={<TestWebSocket />} />
            {/* Add other protected routes here */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
