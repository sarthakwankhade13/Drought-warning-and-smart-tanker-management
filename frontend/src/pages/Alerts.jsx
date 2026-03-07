import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { alertAPI } from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, alert, resolved
  const [districtFilter, setDistrictFilter] = useState('all');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadAlerts();
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const response = await alertAPI.getDistricts();
      setDistricts(response.data);
    } catch (error) {
      console.error('Failed to load districts:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      const params = {};
      if (filter !== 'all' && filter !== 'resolved') {
        params.severity = filter;
      }
      if (filter === 'resolved') {
        params.resolved = 'true';
      }
      if (districtFilter !== 'all') {
        params.district = districtFilter;
      }

      const response = await alertAPI.getAll(params);
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      loadAlerts();
    }
  }, [filter, districtFilter]);

  const handleResolve = async (id) => {
    try {
      await alertAPI.resolve(id);
      setMessage({ type: 'success', text: '✅ Alert marked as resolved' });
      loadAlerts();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to resolve alert' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this alert?')) return;
    
    try {
      await alertAPI.delete(id);
      setMessage({ type: 'success', text: '✅ Alert deleted successfully' });
      loadAlerts();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to delete alert' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleGenerateAlerts = async () => {
    setLoading(true);
    try {
      const response = await alertAPI.generateAutomatic();
      setMessage({ 
        type: 'success', 
        text: `✅ Generated ${response.data.created} new alerts, updated ${response.data.updated} existing alerts` 
      });
      loadAlerts();
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to generate alerts' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return !alert.is_resolved;
    if (filter === 'resolved') return alert.is_resolved;
    return alert.severity === filter && !alert.is_resolved;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Alerts & Notifications</h1>
            <p className="text-gray-600">अलर्ट और सूचनाएं - Real-time water crisis alerts for Vidarbha</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateAlerts}
            disabled={loading}
            className="btn-primary px-6 py-3"
          >
            {loading ? '⏳ Generating...' : '🤖 Generate Alerts'}
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <p className="text-sm text-gray-600 mb-1">Total Alerts</p>
          <p className="text-3xl font-bold text-gray-800">{alerts.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 bg-gradient-to-br from-red-50 to-red-100"
        >
          <p className="text-sm text-gray-600 mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-600">
            {alerts.filter(a => a.severity === 'critical' && !a.is_resolved).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100"
        >
          <p className="text-sm text-gray-600 mb-1">Alert</p>
          <p className="text-3xl font-bold text-yellow-600">
            {alerts.filter(a => a.severity === 'alert' && !a.is_resolved).length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 bg-gradient-to-br from-green-50 to-green-100"
        >
          <p className="text-sm text-gray-600 mb-1">Resolved</p>
          <p className="text-3xl font-bold text-green-600">
            {alerts.filter(a => a.is_resolved).length}
          </p>
        </motion.div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-semibold text-gray-700">Filter by Severity:</span>
          {['all', 'critical', 'alert', 'resolved'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-700">Filter by District:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <option value="all">All Districts</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message Display */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-4 p-4 rounded-xl border-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, idx) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`card p-6 border-l-4 ${
              alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
              alert.severity === 'alert' ? 'border-yellow-500 bg-yellow-50' :
              'border-green-500 bg-green-50'
            } ${alert.is_resolved ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    alert.severity === 'critical' ? 'bg-red-500 text-white' :
                    alert.severity === 'alert' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {alert.severity === 'critical' ? '🚨' : alert.severity === 'alert' ? '⚠️' : '✅'} {alert.severity.toUpperCase()}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    {alert.Village?.name || 'Unknown Village'}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    📍 {alert.Village?.district}
                  </span>
                </div>
                <p className="text-gray-700 mb-3 text-lg">{alert.message}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                  {alert.wsi_score && (
                    <span className="bg-white px-3 py-1 rounded-lg">
                      WSI Score: <span className="font-semibold">{parseFloat(alert.wsi_score).toFixed(1)}</span>
                    </span>
                  )}
                  <span className="bg-white px-3 py-1 rounded-lg">
                    📅 {new Date(alert.createdAt).toLocaleString('en-IN')}
                  </span>
                  {alert.is_resolved && (
                    <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-lg">
                      ✓ Resolved
                    </span>
                  )}
                </div>
              </div>
              {!alert.is_resolved && (
                <div className="flex gap-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResolve(alert.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    ✓ Resolve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(alert.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    🗑️ Delete
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-xl font-semibold text-gray-800 mb-2">No Alerts Found</p>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'All villages have sufficient water supply' 
                : `No ${filter} alerts at this time`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
