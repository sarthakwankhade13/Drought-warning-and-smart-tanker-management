import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import HeatmapView from './pages/HeatmapView';
import AllocationPanel from './pages/AllocationPanel';
import RouteOptimization from './pages/RouteOptimization';
import Alerts from './pages/Alerts';
import Weather from './pages/Weather';
import Sidebar from './components/Sidebar';
import LocalDashboard from './pages/local/LocalDashboard';
import MyVillageData from './pages/local/MyVillageData';
import TrackTankers from './pages/local/TrackTankers';
import ReportShortage from './pages/local/ReportShortage';
import SubmitAlert from './pages/local/SubmitAlert';
import MyAlerts from './pages/local/MyAlerts';
import WeatherForecast from './pages/local/WeatherForecast';

function AppContent() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DataUpload />
            </ProtectedRoute>
          } />
          <Route path="/heatmap" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HeatmapView />
            </ProtectedRoute>
          } />
          <Route path="/allocation" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AllocationPanel />
            </ProtectedRoute>
          } />
          <Route path="/routes" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RouteOptimization />
            </ProtectedRoute>
          } />
          <Route path="/alerts" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Alerts />
            </ProtectedRoute>
          } />
          <Route path="/weather" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Weather />
            </ProtectedRoute>
          } />

          {/* Local User Routes */}
          <Route path="/local" element={
            <ProtectedRoute allowedRoles={['local_user']}>
              <LocalDashboard />
            </ProtectedRoute>
          } />
          <Route path="/local/village" element={
            <ProtectedRoute allowedRoles={['local_user']}>
              <MyVillageData />
            </ProtectedRoute>
          } />
          <Route path="/local/weather" element={
            <ProtectedRoute allowedRoles={['local_user']}>
              <WeatherForecast />
            </ProtectedRoute>
          } />
          <Route path="/local/tankers" element={
            <ProtectedRoute allowedRoles={['local_user']}>
              <TrackTankers />
            </ProtectedRoute>
          } />
          <Route path="/local/report" element={
            <ProtectedRoute allowedRoles={['local_user']}>
              <ReportShortage />
            </ProtectedRoute>
          } />
          <Route path="/local/alerts" element={
            <ProtectedRoute allowedRoles={['local_user']}>
              <MyAlerts />
            </ProtectedRoute>
          } />
          <Route path="/local/submit-alert" element={
            <ProtectedRoute allowedRoles={['local_user']}>
              <SubmitAlert />
            </ProtectedRoute>
          } />

          {/* Fallback redirect based on role */}
          <Route path="*" element={
            <Navigate to={isAdmin ? '/' : '/local'} replace />
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
