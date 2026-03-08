# 🌊 Water Governance & Tanker Allocation System

A comprehensive water resource management platform for monitoring drought conditions, optimizing tanker allocations, and managing water distribution in rural areas.

## � Overview

This system provides real-time drought monitoring, intelligent tanker allocation, and water resource management for villages in water-stressed regions. It combines weather data analysis, groundwater monitoring, and automated allocation algorithms to ensure efficient water distribution.

## ✨ Key Features

### Admin Features
- **Real-time Drought Monitoring**: Track rainfall deviation and groundwater levels
- **Interactive Heatmap**: Geographic visualization of water stress across villages
- **Intelligent Tanker Allocation**: Automated priority-based tanker assignment
- **Route Optimization**: Optimize delivery routes for tanker fleet
- **Weather Integration**: Automatic sync with Open-Meteo API
- **Alert Management**: Severity-based alerts (normal/alert/critical)
- **Data Analytics**: Comprehensive dashboard with charts and statistics

### Local User Features
- **Village Dashboard**: View local water status and metrics
- **Tanker Tracking**: Real-time tracking of assigned tankers
- **Report Shortages**: Submit water shortage reports
- **Alert Notifications**: Receive critical water alerts

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Leaflet** - Interactive maps

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Sequelize ORM** - Database abstraction
- **MySQL** - Relational database
- **JWT** - Stateless authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/sarthakwankhade13/Drought-warning-and-smart-tanker-management.git
cd Drought-warning-and-smart-tanker-management
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=water_governance
JWT_SECRET=your_secure_jwt_secret_key

# WSI Weight Configuration
WSI_RAINFALL_WEIGHT=0.35
WSI_GROUNDWATER_WEIGHT=0.30
WSI_POPULATION_WEIGHT=0.20
WSI_STORAGE_WEIGHT=0.15

# Demand Calculation
DAILY_WATER_PER_CAPITA=55
HIGH_WSI_THRESHOLD=70
HIGH_WSI_ADJUSTMENT=1.20
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### 4. Database Setup
```bash
cd backend
node init-db.js
node seed-database.js
```

## 🎯 Running the Application

### Start Backend
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

## 👤 Default Credentials

**Admin Account:**
- Email: `admin@water.gov`
- Password: `admin123`

## 📊 Core Algorithms

### Water Stress Index (WSI)
```javascript
WSI = (Rainfall × 0.35) + (Groundwater × 0.30) + 
      (Population × 0.20) + (Storage × 0.15)
```

### Priority Score Calculation
```javascript
Priority = WSI × Population Factor × Storage Deficit
```

### Severity Classification
- **Normal**: WSI ≤ 30
- **Alert**: 30 < WSI ≤ 70
- **Critical**: WSI > 70

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
│   │   ├── weatherService.js
│   │   └── routeOptimizer.js
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Route pages
│   │   ├── services/    # API client
│   │   └── App.jsx      # Main component
│   └── index.html
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Villages
- `GET /api/villages` - List all villages
- `GET /api/villages/:id` - Get village details
- `POST /api/villages` - Create village (admin)
- `PUT /api/villages/:id` - Update village (admin)

### Analysis
- `GET /api/analysis/drought/:villageId` - Drought analysis
- `GET /api/analysis/wsi/:villageId` - Water Stress Index
- `GET /api/analysis/wsi` - All villages WSI
- `GET /api/analysis/predict/:villageId` - Demand prediction

### Tankers
- `GET /api/tankers` - List all tankers
- `POST /api/tankers` - Create tanker (admin)
- `POST /api/tankers/allocate` - Auto-allocate tankers
- `GET /api/tankers/allocations` - Get allocations
- `POST /api/tankers/optimize-route` - Optimize route

### Weather
- `GET /api/weather/village/:villageId` - Village weather
- `GET /api/weather/forecast/:villageId` - Weather forecast
- `POST /api/weather/sync` - Sync weather data

### Alerts
- `GET /api/alerts` - List all alerts
- `GET /api/alerts/active` - Active alerts only
- `POST /api/alerts` - Create alert (admin)
- `PUT /api/alerts/:id/resolve` - Resolve alert

### Reports
- `POST /api/reports/water-shortage` - Submit shortage report
- `GET /api/reports/my-reports` - User's reports
- `GET /api/reports/all` - All reports (admin)

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (Admin/Local User)
- Password hashing with bcryptjs (10 rounds)
- Protected API routes with middleware
- CORS configuration
- SQL injection prevention (Sequelize ORM)

## 🌐 External APIs

- **Open-Meteo API**: Free weather data
  - Historical rainfall data
  - Daily precipitation updates
  - No API key required

## 📈 Technical Highlights

- **RESTful API** design
- **MVC architecture** pattern
- **Sequelize ORM** for database abstraction
- **JWT authentication** for stateless sessions
- **Responsive design** with Tailwind CSS
- **Real-time data** visualization
- **Automated weather sync** with cron jobs
- **Error handling** middleware
- **Input validation** on all endpoints

## 📝 License

This project is licensed under the MIT License.

## 👥 Author

Sarthak Wankhade

## 🔗 Links

- **GitHub**: https://github.com/sarthakwankhade13/Drought-warning-and-smart-tanker-management
- **Live Demo**: [Coming Soon]

---

**Made with ❤️ for sustainable water management**
