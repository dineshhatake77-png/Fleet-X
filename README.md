# FLEETX - Autonomous Fleet Management System

**Move Smart. Operate Better.**

FleetX is a production-grade, full-stack Fleet Management Platform combining real-time IoT telematics, heuristic predictive maintenance AI, driver behavior scoring, corridor route optimization, fuel consumption anomaly detection, and end-to-end delivery tracking.

The user interface duplicates the avant-garde futuristic design language specified in the reference design, pairing tactile pill navigations, high-contrast monochrome cards, organic cutouts, and bespoke typography with a full enterprise SaaS operational suite.

---

## 🚀 Key Features

### 1. Reference Design Showcase & Landing
* **Pixel-Perfect Reference Architecture**: Complete recreation of the avant-garde layout from the specification:
  * Left black capsule navigation column with 4-node telematics badge, vertical rotated brand typography, and interactive user profile pill.
  * Preview card with high-tech thumbnail, overview description, and capsule action buttons.
  * Milestone status track (`06 - LAUNCH / 05 - LIVE OPS`).
  * Capsule category pills (`ARTIFICIAL INTELLIGENCE`, `TELEMATICS`, `FLEET IOT`, `TECHNOLOGIES`, `CYBER RADAR`).
  * Iconic bottom typography (`Futuristic ◓ ✱ technologies`).
  * Organic cutout container featuring the high-detail cyber sculpture, double-trapezoid geometric insignia, top-right circular `MENU` pill, and live telematics HUD chip.

### 2. Live Fleet Radar & GPS Simulation (Leaflet + OpenStreetMap)
* **Real-Time Moving Coordinates**: Leaflet map tracking vehicles across regional transport corridors (Chennai, Bangalore, Coimbatore, Salem, Tirupati, Hyderabad).
* **Telemetry Markers**: Distinct color-coded status pins:
  * 🟢 **Active** • 🔵 **In Transit** • 🟡 **Warning** • 🔴 **Critical** • 🟣 **Maintenance** • ⚪ **Offline**
* **Detailed Popups**: Live speed (km/h), fuel tank %, engine temperature (°C), destination, and dynamic ETA.
* **Filter & Center**: Instant search by vehicle registration, driver name, vehicle type, and status with smooth map fly-to animations.

### 3. Heuristic Predictive Maintenance Engine
* **Rule-Based ML Diagnostic Architecture**:
  * Rule 1: Mileage > 150,000 km (+35% risk)
  * Rule 2: Engine coolant thermal stress > 95°C / 100°C (+30% risk)
  * Rule 3: Chassis age degradation (+15% risk)
  * Rule 4: Composite telematics health index inversion (+20% risk)
  * Rule 5: Sensor fault flags and hard braking frequencies
* **Risk Categorization**: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW` with predicted component failure (e.g. Pneumatic Brake Boosters, Radiator Core Leak, Alternator Belt) and estimated service window in days.
* **Work Order Scheduling**: Instant digital service ticket generation with technician assignment and cost estimation.

### 4. Driver Intelligence & Safety Scoring
* **Comprehensive Driver Profiles**: Commercial licenses, assigned vehicles, trip counts, ratings.
* **Granular Behavior Metrics**:
  * Speeding events adherence score
  * Harsh braking smoothness score
  * Rapid acceleration discipline
  * Idling fuel waste penalty
  * Route adherence percentage
* Circular SVG safety index gauges with certified tier classifications.

### 5. Corridor Route Intelligence & AI Optimizer
* Active, planned, delayed, and completed regional corridors.
* **Interactive Route Optimizer**:
  * Computes deadhead reductions and bypass routes.
  * Quantifies **distance reduction (-12%)**, **travel time saved**, **liters of diesel saved**, and **cost savings (₹)**.

### 6. Fuel Analytics & Anomaly Detection
* Telematics consumption tracking per 100 kilometers.
* **High Consumption Anomaly Alert**: Automatic flags for vehicles exceeding baseline consumption by >15% (e.g., TN 04 XZ 2211 consuming 35.8 L/100km).
* Daily consumption trends and vehicle efficiency comparison charts (Recharts).

### 7. Delivery Consignment Tracking
* End-to-end milestone tracker: `Order Created` ➔ `Vehicle Assigned` ➔ `Picked Up` ➔ `In Transit` ➔ `Delivered`.
* Live status updating with priority tags (Urgent, High, Normal).

### 8. Role-Based Access Simulation
* One-click role switcher in the UI:
  * **Fleet Manager**
  * **Admin**
  * **Dispatcher**
  * **Driver**
  * **Maintenance Manager**

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Motion (Framer), Lucide React, Recharts |
| **Mapping** | Leaflet, OpenStreetMap, CartoDB Positron tiles |
| **Backend** | Node.js, Express.js REST API architecture, Server-Sent Events (SSE) |
| **Simulation** | Real-time GPS coordinate drift engine, dynamic speed & fuel consumption |
| **Tooling** | Vite, tsx |

---

## 🔌 REST API Endpoints

### Authentication
* `POST /api/auth/register` - Create operator account
* `POST /api/auth/login` - Sign in
* `GET /api/auth/me` - Current session

### Vehicles
* `GET /api/vehicles` - List vehicles (supports `status`, `type`, `search`)
* `GET /api/vehicles/:id` - Detailed telemetry and diagnostic risk
* `POST /api/vehicles` - Register new vehicle
* `PUT /api/vehicles/:id` - Update vehicle parameters
* `DELETE /api/vehicles/:id` - Remove vehicle from fleet

### Drivers
* `GET /api/drivers` - List drivers with safety scores
* `GET /api/drivers/:id` - Driver profile
* `POST /api/drivers` - Enroll driver
* `PUT /api/drivers/:id` - Update status/score

### Tracking & Telematics
* `GET /api/tracking` - Real-time vehicle coordinates & heading
* `GET /api/events` - Server-Sent Events streaming live GPS telemetry updates every 3 seconds

### Routes & Optimization
* `GET /api/routes` - All logistics corridors
* `POST /api/routes/optimize` - AI route optimizer calculating distance, time, and fuel savings

### Predictive Maintenance
* `GET /api/maintenance` - Historical maintenance records
* `GET /api/maintenance/predictions` - Heuristic failure predictions & risk scores
* `POST /api/maintenance` - Create scheduled work order

### Fuel Analytics
* `GET /api/fuel` - Fuel logs
* `GET /api/fuel/analytics` - Fleet efficiency stats, anomalies & cost per km

### Alerts
* `GET /api/alerts` - Notification feed
* `PUT /api/alerts/:id/read` - Mark alert as acknowledged

---

## 🏃 Getting Started

### Installation
```bash
npm install
```

### Development Server
Starts the Express full-stack server mounted with Vite middleware on port 3000:
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## 🛡️ Demo Credentials
* **Fleet Manager**: `fleet.manager@fleetx.io`
* **Admin**: `admin@fleetx.io`
* **Driver**: `arun.k@fleetx.io`
*(Any credentials will authenticate; you can also use Google Sign-In or the instant role switcher in the UI)*

---

## 🚀 Pushing to GitHub & Deploying to Vercel

### Step 1: Push Code to Your GitHub Repository
1. On GitHub ([github.com/new](https://github.com/new)), create a new repository (e.g. `fleetx-autonomous`).
2. Run the following commands in your terminal:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/fleetx-autonomous.git
git push -u origin main
```

### Step 2: Deploy to Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** > **Project**.
2. Select your `fleetx-autonomous` repository.
3. Vercel automatically detects the Vite configuration via `vercel.json`:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
4. Click **Deploy**.

### Step 3: Firebase Authorized Domains (For Google Sign-In on Vercel)
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select project **`citric-branch-083d0`**.
3. Navigate to **Authentication** > **Settings** > **Authorized domains**.
4. Add your Vercel deployment domain (e.g. `your-project.vercel.app`).

