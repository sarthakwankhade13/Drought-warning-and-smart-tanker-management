import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { villageAPI, alertAPI, tankerAPI, analysisAPI } from '../../services/api';

const LocalDashboard = () => {
    const { user } = useAuth();
    const [villageData, setVillageData] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [wsi, setWsi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            if (!user?.village_id) {
                console.error('No village_id found for user');
                setLoading(false);
                return;
            }

            const [villageRes, alertsRes, allocationRes] = await Promise.all([
                villageAPI.getById(user.village_id),
                alertAPI.getMyVillage(),
                tankerAPI.getMyVillage()
            ]);
            
            // Set village data with real-time population
            const village = villageRes.data;
            console.log('Loaded village data:', village);
            setVillageData(village);
            setAlerts(alertsRes.data || []);
            setAllocations(allocationRes.data || []);
            setLastUpdated(new Date());

            // Try to load WSI data
            try {
                const wsiRes = await analysisAPI.getWSI(user.village_id);
                setWsi(wsiRes.data);
            } catch (wsiErr) {
                console.log('WSI data not available:', wsiErr.message);
                // WSI might not be available
            }
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getStoragePercentage = () => {
        if (!villageData || !villageData.storage_capacity || !villageData.current_storage) return 0;
        return Math.round((villageData.current_storage / villageData.storage_capacity) * 100);
    };

    const getStorageColor = () => {
        const pct = getStoragePercentage();
        if (pct < 30) return 'from-red-500 to-red-600';
        if (pct < 50) return 'from-orange-500 to-yellow-500';
        return 'from-green-500 to-emerald-500';
    };

    const getStorageTextColor = () => {
        const pct = getStoragePercentage();
        if (pct < 30) return 'text-red-600';
        if (pct < 50) return 'text-orange-600';
        return 'text-green-600';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const activeAlerts = alerts.filter(a => !a.is_resolved);
    const activeDeliveries = allocations.filter(a => a.status === 'pending' || a.status === 'in_progress');

    return (
        <div className="max-w-6xl mx-auto">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome, {user?.username} 👋
                        </h1>
                        <p className="text-gray-600 mt-1">
                            📍 {user?.village?.name}, {user?.village?.district} — Here's your village water status
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {lastUpdated && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Last Updated</p>
                                <p className="text-sm font-semibold text-gray-700">
                                    {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md disabled:opacity-50"
                        >
                            <motion.span
                                animate={refreshing ? { rotate: 360 } : {}}
                                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
                            >
                                🔄
                            </motion.span>
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">💧</span>
                        <span className={`text-2xl font-bold ${getStorageTextColor()}`}>
                            {getStoragePercentage()}%
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Water Storage</h3>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full bg-gradient-to-r ${getStorageColor()}`}
                            style={{ width: `${getStoragePercentage()}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        {villageData ? `${Number(villageData.current_storage).toLocaleString('en-IN')}L / ${Number(villageData.storage_capacity).toLocaleString('en-IN')}L` : 'Loading...'}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-green-600 font-medium">Live Data</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">⚠️</span>
                        <span className={`text-2xl font-bold ${activeAlerts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {activeAlerts.length}
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Active Alerts</h3>
                    <p className="text-xs text-gray-500 mt-2">
                        {activeAlerts.length > 0
                            ? `${activeAlerts.filter(a => a.severity === 'critical').length} critical`
                            : 'No active alerts'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">🚛</span>
                        <span className="text-2xl font-bold text-blue-600">{activeDeliveries.length}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Active Deliveries</h3>
                    <p className="text-xs text-gray-500 mt-2">
                        {activeDeliveries.length > 0 ? 'Tankers heading your way' : 'No pending deliveries'}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">👥</span>
                        <span className="text-2xl font-bold text-purple-600">
                            {villageData?.population ? villageData.population.toLocaleString('en-IN') : '—'}
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Population</h3>
                    <p className="text-xs text-gray-500 mt-2">
                        {villageData?.population ? 'Residents in your village' : 'Loading...'}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-green-600 font-medium">Live Data</span>
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link to="/local/report">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-green-200"
                    >
                        <span className="text-4xl block mb-3">📝</span>
                        <h3 className="font-bold text-gray-800 text-lg">Report Shortage</h3>
                        <p className="text-sm text-gray-600 mt-1">Submit a water shortage report for your village</p>
                    </motion.div>
                </Link>

                <Link to="/local/weather">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-blue-200"
                    >
                        <span className="text-4xl block mb-3">🌤️</span>
                        <h3 className="font-bold text-gray-800 text-lg">Weather Forecast</h3>
                        <p className="text-sm text-gray-600 mt-1">View 7-day weather forecast and rainfall predictions</p>
                    </motion.div>
                </Link>

                <Link to="/local/tankers">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-purple-200"
                    >
                        <span className="text-4xl block mb-3">🚛</span>
                        <h3 className="font-bold text-gray-800 text-lg">Track Tankers</h3>
                        <p className="text-sm text-gray-600 mt-1">View tanker deliveries assigned to your village</p>
                    </motion.div>
                </Link>
            </div>

            {/* Additional Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link to="/local/village">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-indigo-200"
                    >
                        <span className="text-4xl block mb-3">📊</span>
                        <h3 className="font-bold text-gray-800 text-lg">Village Data</h3>
                        <p className="text-sm text-gray-600 mt-1">View rainfall, groundwater, and WSI data</p>
                    </motion.div>
                </Link>

                <Link to="/local/alerts">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="card p-6 cursor-pointer border-2 border-transparent hover:border-orange-200"
                    >
                        <span className="text-4xl block mb-3">🔔</span>
                        <h3 className="font-bold text-gray-800 text-lg">My Alerts</h3>
                        <p className="text-sm text-gray-600 mt-1">View all alerts and notifications for your village</p>
                    </motion.div>
                </Link>
            </div>

            {/* Village Details Card */}
            {villageData && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🏘️ Village Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Village Name</p>
                            <p className="font-bold text-gray-800">{villageData.name}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">District</p>
                            <p className="font-bold text-gray-800">{villageData.district}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">State</p>
                            <p className="font-bold text-gray-800">{villageData.state}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Total Population</p>
                            <p className="font-bold text-purple-600 text-lg">
                                {villageData.population.toLocaleString('en-IN')} people
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Storage Capacity</p>
                            <p className="font-bold text-blue-600 text-lg">
                                {Number(villageData.storage_capacity).toLocaleString('en-IN')} L
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Current Storage</p>
                            <p className={`font-bold text-lg ${getStorageTextColor()}`}>
                                {Number(villageData.current_storage).toLocaleString('en-IN')} L
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Recent Alerts */}
            {activeAlerts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card p-6"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🔔 Recent Alerts</h2>
                    <div className="space-y-3">
                        {activeAlerts.slice(0, 3).map(alert => (
                            <div
                                key={alert.id}
                                className={`p-4 rounded-lg border-l-4 ${alert.severity === 'critical'
                                        ? 'bg-red-50 border-red-500'
                                        : alert.severity === 'alert'
                                            ? 'bg-orange-50 border-orange-500'
                                            : 'bg-yellow-50 border-yellow-500'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${alert.severity === 'critical' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(alert.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 mt-2">{alert.message}</p>
                            </div>
                        ))}
                    </div>
                    {activeAlerts.length > 3 && (
                        <Link to="/local/alerts" className="text-green-600 font-semibold text-sm mt-3 inline-block hover:underline">
                            View all alerts →
                        </Link>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default LocalDashboard;
