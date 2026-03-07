import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tankerAPI } from '../services/api';

const AllocationPanel = () => {
  const [allocations, setAllocations] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [allocationToCancel, setAllocationToCancel] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setPageLoading(true);
      const [allocRes, tankerRes] = await Promise.all([
        tankerAPI.getAllocations(),
        tankerAPI.getAll()
      ]);
      
      // Ensure data is valid
      const validAllocations = (allocRes.data || []).map(alloc => ({
        ...alloc,
        priority_score: alloc.priority_score ? parseFloat(alloc.priority_score) : 0,
        status: alloc.status || 'pending',
        createdAt: alloc.createdAt || new Date().toISOString()
      }));
      
      setAllocations(validAllocations);
      setTankers(tankerRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      setAllocations([]);
      setTankers([]);
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancelAllocation = async (allocationId) => {
    setAllocationToCancel(allocationId);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    if (!allocationToCancel) return;
    
    try {
      await tankerAPI.cancelAllocation(allocationToCancel);
      setMessage('✅ Allocation cancelled and entry deleted successfully!');
      setShowConfirm(false);
      setAllocationToCancel(null);
      await loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Cancel error:', error);
      setMessage(`❌ Failed to cancel allocation: ${error.response?.data?.error || error.message}`);
      setShowConfirm(false);
      setAllocationToCancel(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAllocate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await tankerAPI.allocate();
      setMessage(response.data.message || '✅ Tankers allocated successfully!');
      await loadData();
    } catch (error) {
      console.error('Allocation error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Allocation failed';
      setMessage(`❌ Allocation failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Loading State */}
      {pageLoading ? (
        <div className="flex items-center justify-center h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass-card p-8"
          >
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading allocation data...</p>
          </motion.div>
        </div>
      ) : (
        <>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 glass-card p-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Water Tanker Allocation
            </h1>
            <p className="text-gray-600 text-sm md:text-base">पानी टैंकर आवंटन - AI-powered smart allocation for critical villages</p>
          </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm mb-1">Total Tankers</p>
              <p className="text-3xl md:text-4xl font-bold text-blue-600">100</p>
            </div>
            <motion.span 
              className="text-4xl md:text-5xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚛
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="glass-card p-6 bg-gradient-to-br from-green-50 to-green-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm mb-1">Available</p>
              <p className="text-3xl md:text-4xl font-bold text-green-600">
                {100 - allocations.length}
              </p>
            </div>
            <motion.span 
              className="text-4xl md:text-5xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✅
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="glass-card p-6 bg-gradient-to-br from-purple-50 to-purple-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm mb-1">Allocated</p>
              <p className="text-3xl md:text-4xl font-bold text-purple-600">{allocations.length}</p>
            </div>
            <motion.span 
              className="text-4xl md:text-5xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📍
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="glass-card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs md:text-sm mb-1">In Progress</p>
              <p className="text-3xl md:text-4xl font-bold text-yellow-600">
                {allocations.filter(a => a.status === 'in_progress').length}
              </p>
            </div>
            <motion.span 
              className="text-4xl md:text-5xl"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              ⏳
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Allocation Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Alert-Based Smart Allocation</h2>
            <p className="text-gray-600">AI analyzes unresolved alerts and automatically assigns tankers to critical villages based on severity and WSI scores</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAllocate}
            disabled={loading}
            className="btn-primary px-8 py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Allocating...
              </span>
            ) : (
              '🤖Allocate Automatically'
            )}
          </motion.button>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg border-l-4 ${
              message.includes('success') || message.includes('allocated')
                ? 'bg-green-50 border-green-500 text-green-700'
                : message.includes('failed') || message.includes('No')
                ? 'bg-red-50 border-red-500 text-red-700'
                : 'bg-blue-50 border-blue-500 text-blue-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{message.includes('failed') || message.includes('No') ? '⚠️' : '✓'}</span>
              <span className="font-semibold">{message}</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Allocations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Allocations</h2>
        
        {allocations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-700">Village</th>
                  <th className="text-left p-4 font-semibold text-gray-700">District</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Priority</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Tanker</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Allocated</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc, idx) => (
                  <motion.tr
                    key={alloc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-800">{alloc.Village?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-600">📍 {alloc.Village?.district || 'N/A'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          alloc.priority_score >= 80 ? 'bg-red-100 text-red-700' :
                          alloc.priority_score >= 60 ? 'bg-orange-100 text-orange-700' :
                          alloc.priority_score >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {alloc.priority_score ? alloc.priority_score.toFixed(1) : '0.0'}
                        </span>
                        {alloc.priority_score >= 80 && <span className="text-red-500">🔴</span>}
                        {alloc.priority_score >= 60 && alloc.priority_score < 80 && <span className="text-orange-500">🟠</span>}
                        {alloc.priority_score >= 40 && alloc.priority_score < 60 && <span className="text-yellow-500">🟡</span>}
                        {alloc.priority_score < 40 && <span className="text-green-500">🟢</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-gray-800 font-medium">{alloc.Tanker?.registration_number || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{alloc.Tanker?.capacity ? `${alloc.Tanker.capacity}L` : ''}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        alloc.status === 'completed' ? 'bg-green-100 text-green-700' :
                        alloc.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alloc.status === 'pending' ? '✓ Allocated' : 
                         alloc.status === 'in_progress' ? '🚛 In Progress' :
                         '✅ Completed'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {alloc.createdAt ? new Date(alloc.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowComingSoon(true)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-1"
                        >
                          📍 Track
                        </motion.button>
                        {alloc.status !== 'completed' && (
                          <button
                            onClick={() => handleCancelAllocation(alloc.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-xl font-semibold text-gray-800 mb-2">No Active Allocations</p>
            <p className="text-gray-600">Click "Run Smart Allocation" to assign tankers to critical villages</p>
          </div>
        )}
      </motion.div>

      {/* Custom Confirmation Dialog */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="glass-card max-w-md w-full mx-4 p-6 md:p-8"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-3xl md:text-4xl"
                >
                  ⚠️
                </motion.span>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl font-bold text-gray-800 mb-2"
              >
                Cancel Allocation?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6 text-sm md:text-base"
              >
                Are you sure you want to cancel this tanker allocation? This action will delete the entry and free up the tanker.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowConfirm(false);
                    setAllocationToCancel(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-medium shadow-md"
                >
                  No, Keep It
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmCancel}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg"
                >
                  Yes, Cancel
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Coming Soon Dialog */}
      {showComingSoon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowComingSoon(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="glass-card max-w-md w-full mx-4 p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <motion.span
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity }
                  }}
                  className="text-4xl md:text-5xl"
                >
                  🚀
                </motion.span>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3"
              >
                Coming Soon!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-2 text-base md:text-lg font-medium"
              >
                Real-Time Tanker Tracking
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 mb-6 text-sm md:text-base"
              >
                Track your tanker's live location, estimated arrival time, and delivery status. This feature is under development and will be available soon!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-2 mb-4"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">📍</span>
                  <span>Live GPS tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">⏱️</span>
                  <span>ETA predictions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-lg">🔔</span>
                  <span>Delivery notifications</span>
                </div>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComingSoon(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-semibold shadow-lg"
              >
                Got It!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
        </>
      )}
    </div>
  );
};

export default AllocationPanel;
