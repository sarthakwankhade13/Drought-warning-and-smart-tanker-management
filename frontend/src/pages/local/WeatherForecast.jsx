import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { weatherAPI } from '../../services/api';

const WeatherForecast = () => {
    const { user } = useAuth();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDay, setSelectedDay] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadWeatherData();
    }, []);

    const loadWeatherData = async () => {
        try {
            setError('');
            const res = await weatherAPI.getForecast(user.village_id);
            console.log('Weather API Response:', res.data);
            setWeatherData(res.data.forecast);
        } catch (err) {
            console.error('Failed to load weather data:', err);
            setError('Failed to load weather forecast. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadWeatherData();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getWeatherIcon = (condition) => {
        const conditionLower = condition?.toLowerCase() || '';
        if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
        if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return '⛈️';
        if (conditionLower.includes('cloud')) return '☁️';
        if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
        if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
        if (conditionLower.includes('snow')) return '❄️';
        return '🌤️';
    };

    const getRainfallColor = (amount) => {
        if (amount === 0) return 'text-gray-400';
        if (amount < 2.5) return 'text-blue-400';
        if (amount < 10) return 'text-blue-500';
        if (amount < 35) return 'text-blue-600';
        return 'text-blue-700';
    };

    const getUVLevel = (uv) => {
        if (uv <= 2) return { label: 'Low', color: 'bg-green-100 text-green-700' };
        if (uv <= 5) return { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700' };
        if (uv <= 7) return { label: 'High', color: 'bg-orange-100 text-orange-700' };
        if (uv <= 10) return { label: 'Very High', color: 'bg-red-100 text-red-700' };
        return { label: 'Extreme', color: 'bg-purple-100 text-purple-700' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card p-8 text-center">
                    <span className="text-6xl block mb-4">⚠️</span>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Weather Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={loadWeatherData}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const currentWeather = weatherData?.current;
    const forecast = weatherData?.forecast || [];
    const alerts = weatherData?.alerts || [];
    const selectedForecast = forecast[selectedDay];

    // Debug log
    console.log('Current Weather:', currentWeather);
    console.log('Forecast:', forecast);
    console.log('Selected Forecast:', selectedForecast);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">🌤️ Weather Forecast</h1>
                        <p className="text-gray-600 mt-1">
                            {user?.village?.name}, {user?.village?.district} • 7-Day Forecast
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50"
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
            </motion.div>

            {/* Weather Alerts */}
            <AnimatePresence>
                {alerts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                    >
                        {alerts.map((alert, i) => (
                            <div key={i} className="card p-4 mb-3 border-l-4 border-red-500 bg-red-50">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-red-800">{alert.headline || 'Weather Alert'}</h3>
                                        <p className="text-sm text-red-700 mt-1">{alert.desc || alert.event}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Current Weather Card */}
            {currentWeather && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50"
                >
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Current Weather</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Temperature */}
                        <div className="text-center">
                            <span className="text-6xl block mb-2">{getWeatherIcon(currentWeather.description)}</span>
                            <div className="text-5xl font-bold text-gray-800">
                                {currentWeather.temperature ? Math.round(currentWeather.temperature) : '--'}°C
                            </div>
                            <p className="text-gray-600 mt-2 capitalize">{currentWeather.description || 'Loading...'}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Feels like {currentWeather.feelsLike ? Math.round(currentWeather.feelsLike) : '--'}°C
                            </p>
                        </div>

                        {/* Weather Details */}
                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">💧 Humidity</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {currentWeather.humidity || '--'}%
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">🌧️ Rainfall</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {currentWeather.rainfall !== undefined ? currentWeather.rainfall : '--'} mm
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">💨 Wind Speed</p>
                                <p className="text-2xl font-bold text-gray-700">
                                    {currentWeather.windSpeed ? Math.round(currentWeather.windSpeed) : '--'} km/h
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">🌡️ Pressure</p>
                                <p className="text-2xl font-bold text-gray-700">
                                    {currentWeather.pressure || '--'} mb
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">☀️ UV Index</p>
                                {currentWeather.uv !== undefined ? (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getUVLevel(currentWeather.uv).color}`}>
                                        {currentWeather.uv} - {getUVLevel(currentWeather.uv).label}
                                    </span>
                                ) : (
                                    <p className="text-2xl font-bold text-gray-700">--</p>
                                )}
                            </div>
                            <div className="bg-white p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">👁️ Visibility</p>
                                <p className="text-2xl font-bold text-gray-700">
                                    {currentWeather.visibility || '--'} km
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 7-Day Forecast Tabs */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">7-Day Forecast</h2>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {forecast.map((day, index) => {
                        const date = new Date(day.date);
                        const isToday = index === 0;
                        const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
                        
                        return (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedDay(index)}
                                className={`flex-shrink-0 p-4 rounded-xl text-center transition-all min-w-[120px] ${
                                    selectedDay === index
                                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <p className="font-bold text-sm mb-1">{dayName}</p>
                                <p className="text-xs opacity-75 mb-2">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                <span className="text-3xl block mb-2">{getWeatherIcon(day.condition)}</span>
                                <p className="font-bold">
                                    {day.maxTemp ? Math.round(day.maxTemp) : '--'}° / {day.minTemp ? Math.round(day.minTemp) : '--'}°
                                </p>
                                <p className={`text-xs mt-1 font-medium ${selectedDay === index ? 'text-white' : getRainfallColor(day.totalRainfall || 0)}`}>
                                    {day.totalRainfall > 0 ? `${day.totalRainfall}mm` : 'No rain'}
                                </p>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Day Details */}
            {selectedForecast && (
                <motion.div
                    key={selectedDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Day Summary */}
                    <div className="lg:col-span-2 card p-6">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">
                            {selectedDay === 0 ? 'Today' : new Date(selectedForecast.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">🌡️ Max Temp</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {selectedForecast.maxTemp ? Math.round(selectedForecast.maxTemp) : '--'}°C
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">🌡️ Min Temp</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {selectedForecast.minTemp ? Math.round(selectedForecast.minTemp) : '--'}°C
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">🌡️ Avg Temp</p>
                                <p className="text-2xl font-bold text-gray-700">
                                    {selectedForecast.avgTemp ? Math.round(selectedForecast.avgTemp) : '--'}°C
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">🌧️ Total Rainfall</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {selectedForecast.totalRainfall !== undefined ? selectedForecast.totalRainfall : '--'} mm
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">💧 Avg Humidity</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {selectedForecast.avgHumidity || '--'}%
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">☔ Rain Chance</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {selectedForecast.chanceOfRain || '--'}%
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-purple-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">🌅 Sunrise</p>
                                    <p className="font-bold text-gray-800">{selectedForecast.sunrise || '--'}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-600 mb-1">🌙 Moon Phase</p>
                                    <p className="font-bold text-gray-800">{selectedForecast.moonPhase || '--'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-600 mb-1">🌇 Sunset</p>
                                    <p className="font-bold text-gray-800">{selectedForecast.sunset || '--'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Condition & Wind */}
                    <div className="space-y-4">
                        <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
                            <span className="text-6xl block mb-3">{getWeatherIcon(selectedForecast.condition)}</span>
                            <p className="font-bold text-gray-800 text-lg capitalize">{selectedForecast.condition}</p>
                        </div>
                        
                        <div className="card p-6">
                            <p className="text-xs text-gray-500 mb-2">💨 Max Wind Speed</p>
                            <p className="text-3xl font-bold text-gray-800">
                                {selectedForecast.maxWind ? Math.round(selectedForecast.maxWind) : '--'}
                            </p>
                            <p className="text-sm text-gray-600">km/h</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Data Source Info */}
            <div className="mt-6 text-center text-xs text-gray-500">
                <p>Weather data provided by {weatherData?.source || 'Weather API'}</p>
                <p className="mt-1">Last updated: {new Date().toLocaleString('en-IN')}</p>
            </div>
        </div>
    );
};

export default WeatherForecast;
