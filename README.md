# Crop Guard AI: Disease Early Warning Network

A complete full-stack IoT simulation platform for smart agriculture monitoring, built for SWAPD 453 IoT Applications Development.

## Overview
Crop Guard AI is a high-performance IoT platform designed to monitor environmental conditions and predict crop disease risks in real-time. It simulates 10 LoRaWAN sensor nodes distributed across multiple agricultural zones, implementing a complex disease risk engine and OTA firmware update lifecycle.

## Tech Stack
- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui, Recharts, Framer Motion.
- **Backend**: Node.js, Express, Prisma (PostgreSQL), JWT, MQTT.js.
- **Messaging**: Mosquitto (MQTT) broker.
- **Simulator**: Python 3.10 (Paho-MQTT).
- **Infrastructure**: Docker & Docker Compose.

## Features
- **Real-time Telemetry**: Monitoring temperature, humidity, leaf wetness, and rainfall.
- **Disease Risk Engine**: Automated risk assessment (LOW, MODERATE, HIGH, CRITICAL) based on sustained environmental patterns.
- **OTA Simulation**: End-to-end firmware update lifecycle with automatic rollback logic.
- **Security Monitoring**: Detection of rogue devices, suspicious telemetry, and authentication failures.
- **Futuristic Dashboard**: ThingsBoard-style UI with glassmorphism, dark mode, and neon accents.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Running with Docker
```bash
docker-compose up --build
```

### Local Development
1. **Backend**:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run seed
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Simulator**:
   ```bash
   cd simulator
   pip install -r requirements.txt
   python simulator.py
   ```

## Disease Risk Rules
- **LOW**: Normal conditions.
- **MODERATE**: Humidity 70-85% & Temp 15-25°C for 3+ hours.
- **HIGH**: Humidity > 85% & Temp 18-25°C for 6+ hours.
- **CRITICAL**: HIGH conditions + Leaf Wetness > 8 & Rainfall > 5mm.

## Security Features
- JWT-based authentication.
- Per-device authorization (simulated).
- Suspicious telemetry detection (Out-of-range values).
- Rogue device connection logging.

## License
This project is for educational purposes under SWAPD 453.
