import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { alertAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const SubmitAlert = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('alert');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await alertAPI.submitUserAlert({ title, description, severity });
      setMessage({ type: 'success', text: '✅ Alert submitted successfully! Admin will review it.' });
      setTitle('');
      setDescription('');
      setSeverity('alert');
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to submit alert. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📢 Submit Water Alert</h1>
        <p className="text-gray-600">अलर्ट सबमिट करें - Report water shortage or issues in your village</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-700">
            <span className="font-bold">ℹ️ Note:</span> Your alert will be submitted to the admin for review. 
            Please provide accurate information about the water situation in your village.
          </p>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-700'
                : 'bg-red-50 border-red-500 text-red-700'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alert Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="e.g., Water supply disrupted for 3 days"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Severity Level *
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSeverity('normal')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  severity === 'normal'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="text-3xl mb-2">🟢</div>
                <div className="font-semibold text-gray-800">Normal</div>
                <div className="text-xs text-gray-500">Minor issue</div>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('alert')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  severity === 'alert'
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
              >
                <div className="text-3xl mb-2">⚠️</div>
                <div className="font-semibold text-gray-800">Alert</div>
                <div className="text-xs text-gray-500">Needs attention</div>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('critical')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  severity === 'critical'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="text-3xl mb-2">🚨</div>
                <div className="font-semibold text-gray-800">Critical</div>
                <div className="text-xs text-gray-500">Urgent</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[150px]"
              placeholder="Describe the water shortage situation in detail. Include information about:
- How long has the issue been occurring?
- How many people are affected?
- What is the current water availability?
- Any other relevant details..."
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-bold">Your Village:</span> {user?.village?.name || 'Not specified'} ({user?.village?.district || 'N/A'})
            </p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary py-3"
            >
              {loading ? '⏳ Submitting...' : '📤 Submit Alert'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => {
                setTitle('');
                setDescription('');
                setSeverity('alert');
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Clear
            </motion.button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
      >
        <h3 className="font-bold text-gray-800 mb-3">💡 Tips for Submitting Alerts</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Be specific about the water shortage situation</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Include the duration and severity of the issue</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Mention how many people are affected</span>
          </li>
          <li className="flex items-start gap-2">
            <span>✓</span>
            <span>Provide any relevant details that can help admin take action</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default SubmitAlert;
