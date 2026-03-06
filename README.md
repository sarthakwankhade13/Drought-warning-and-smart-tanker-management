<<<<<<< HEAD
# Water Governance & Tanker Allocation System

A comprehensive water resource management platform for monitoring drought conditions, optimizing tanker allocations, and managing water distribution in rural areas.

## 🌊 Overview

This system provides real-time drought monitoring, intelligent tanker allocation, and water resource management for villages in water-stressed regions. It combines weather data analysis, groundwater monitoring, and automated allocation algorithms to ensure efficient water distribution.

## ✨ Key Features

### Admin Features
- **Real-time Drought Monitoring**: Track rainfall deviation and groundwater levels
- **Interactive Heatmap**: Geographic visualization of water stress across villages
- **Intelligent Tanker Allocation**: Automated priority-based tanker assignment
- **Route Optimization**: Optimize delivery routes for tanker fleet
- **Weather Integration**: Automatic sync with Open-Meteo API (every 12 hours)
- **Alert Management**: Severity-based alerts (normal/alert/critical)
- **Data Analytics**: Comprehensive dashboard with charts and statistics

### Local User Features
- **Village Dashboard**: View local water status and metrics
- **Tanker Tracking**: Real-time tracking of assigned tankers
- **Report Shortages**: Submit water shortage reports
- **Alert Notifications**: Receive critical water alerts

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Dashboard  │  │   Heatmap    │  │  Allocation  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  DroughtEngine │ AllocationService │ WeatherSync    │   │
│  │  WSICalculator │ RouteOptimizer    │ DemandPredictor│   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (SQLite + Sequelize ORM)               │
│  Villages │ Tankers │ Allocations │ Weather │ Alerts        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL API (Open-Meteo Weather)               │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Sequelize** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Axios** - External API calls

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SQLite3

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/water-governance-system.git
cd water-governance-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key_here
DB_PATH=./water_governance.db
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Database Initialization
```bash
cd backend
node create-db.js
node seed-database.js
```

## 🎯 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 👤 Default Login Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`

### Local User Account
- **Username**: `local_user`
- **Password**: `local123`

## 📊 Core Algorithms

### Water Stress Index (WSI)
```
WSI = (Rainfall Deviation × 0.6) + (Groundwater Trend × 0.4)
```

### Priority Score Calculation
```
Priority = (WSI × 0.5) + (Population × 0.3) + (Storage Deficit × 0.2)
```

### Severity Classification
- **Normal**: WSI ≤ 30
- **Alert**: 30 < WSI ≤ 70
- **Critical**: WSI > 70

## 🔄 Automated Processes

- **Weather Sync**: Runs every 12 hours automatically
- **Historical Backfill**: 8 months of rainfall data on first run
- **Groundwater Estimation**: Based on 30-day rainfall patterns
- **Alert Generation**: Triggered by severity thresholds

## 📁 Project Structure

```
water-governance-system/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth & error handling
│   ├── models/          # Sequelize models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   │   ├── droughtEngine.js
│   │   ├── allocationService.js
│   │   ├── wsiCalculator.js
│   │   ├── weatherSync.js
│   │   └── openMeteoService.js
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Route pages
│   │   │   ├── local/   # Local user pages
│   │   │   └── ...      # Admin pages
│   │   ├── services/    # API client
│   │   └── App.jsx      # Main app component
│   └── index.html
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Villages
- `GET /api/villages` - List all villages
- `GET /api/villages/:id` - Get village details
- `POST /api/villages` - Create village (admin)

### Analysis
- `GET /api/analysis/drought/:villageId` - Drought analysis
- `GET /api/analysis/wsi/:villageId` - Water Stress Index

### Tankers
- `GET /api/tankers` - List all tankers
- `POST /api/tankers/allocate` - Allocate tankers (admin)

### Weather
- `GET /api/weather/rainfall/:villageId` - Rainfall data
- `GET /api/weather/groundwater/:villageId` - Groundwater data

### Alerts
- `GET /api/alerts` - List all alerts
- `POST /api/alerts` - Create alert (admin)

## 🧪 Testing

### Backend Tests
```bash
cd backend
node test-connection.js    # Test database connection
node test-weather.js       # Test weather API
node test-allocation.js    # Test allocation logic
```

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (Admin/Local User)
- Password hashing with bcryptjs
- Protected API routes
- CORS configuration

## 🌐 External APIs

- **Open-Meteo API**: Free weather data API
  - Historical rainfall data
  - Daily precipitation updates
  - No API key required

## 📈 Future Enhancements

- [ ] Mobile application (React Native)
- [ ] SMS alert notifications
- [ ] Machine learning for demand prediction
- [ ] Integration with IoT water sensors
- [ ] Multi-language support
- [ ] Advanced route optimization with traffic data
- [ ] Blockchain for transparent allocation records

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Open-Meteo for weather data API
- React and Node.js communities
- Contributors and testers

## 📞 Support

For support, email support@watergovernance.com or open an issue in the repository.

---

**Made with ❤️ for sustainable water management**
=======
# Drought-warning-and-smart-tanker-management
>>>>>>> 610d941a57a6d7775bd904833ab877d577a177db
