# AI-Driven Smart Pollution Control System for Delhi

[cite_start]**AirOptima** is an intelligent, data-driven system designed to optimize air pollution mitigation in Delhi-NCR[cite: 1, 2]. [cite_start]By moving away from traditional uniform water sprinkling, this platform uses real-time AI to identify pollution sources and deploy resources where they are most effective[cite: 4, 6].

---

## ◈ The Problem
[cite_start]Delhi's current air-pollution mitigation lacks source identification and impact validation, resulting in water wastage and minimal PM reduction[cite: 4].
* [cite_start]**Water Wastage**: Sprinkling water in combustion-dominated areas (PM2.5) is ineffective and wastes resources in a water-stressed city[cite: 16, 42].
* [cite_start]**Resource Inefficiency**: Deploying tankers uniformly across locations fails to address whether pollution is dust-based (PM10) or combustion-based (PM2.5)[cite: 14, 15, 16].
* [cite_start]**Economic Impact**: India faces an annual economic loss of nearly 8.6 lakh crore due to pollution-related health and productivity impacts[cite: 41].

## ◈ The Solution
[cite_start]AirOptima utilizes a **Hybrid AI Decision Engine** to classify pollution types and automate the response from a smart fleet of water trucks[cite: 66, 67, 74].
* [cite_start]**Source Classification**: Differentiates between **Dust-Dominant (PM10)** and **Combustion-Dominant (PM2.5)** using a Random Forest classifier[cite: 73, 81, 84].
* [cite_start]**Smart Sprinkling**: Automatically triggers variable droplet sizes and pump pressure only in zones where water is effective against dust[cite: 82, 83].
* [cite_start]**Real-Time Fleet Management**: Tracks MCD water trucks in real-time, simulating their movement from depots to hazardous zones[cite: 192, 193, 241].
* [cite_start]**Automated Logic**: Skips sprinkling in high-wind conditions or when combustion (smoke/fumes) is the primary pollutant to ensure resource optimization[cite: 73, 94].

---

## ◈ System Architecture

[cite_start]The project is built on a modern full-stack architecture designed for high-frequency data processing[cite: 113, 114].

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | Python / Flask / FastAPI | [cite_start]Decision engine, ML inference, and API management[cite: 137, 143]. |
| **Frontend** | React / Next.js / Tailwind | [cite_start]Real-time "Command Center" dashboard with GIS mapping[cite: 145]. |
| **AI/ML Engine** | Scikit-learn / NumPy / Pandas | [cite_start]Pollution source classification and trend analysis[cite: 131, 136, 141]. |
| **Data APIs** | WAQI / OpenWeather / TomTom | [cite_start]Live feeds for AQI, weather conditions, and traffic density[cite: 116, 120, 123]. |

---

## ◈ Key Features

### 1. Command Center Dashboard
[cite_start]A real-time interface for municipal authorities to monitor Delhi's major zones[cite: 77, 151].
* [cite_start]**Live Heatmaps**: Visualizes AQI intensity and risk zones across the city[cite: 151, 214].
* [cite_start]**Predictive Impact**: Estimates potential AQI reduction (Before vs. After) to validate mitigation efforts[cite: 109, 325].
* [cite_start]**Manual Overrides**: Allows administrators to adjust control thresholds and force-activate sprinklers for specific events[cite: 155, 156].

### 2. Fleet Status & Logistics
* [cite_start]**Real-Time Tracking**: Monitors the status of active sprinklers and truck deployment counts[cite: 192, 193].
* [cite_start]**Traffic Integration**: Factors in road density to prevent traffic disruptions during spraying operations[cite: 28, 70, 120].

### 3. Analytics & Impact Tracking
* [cite_start]**Water Usage Tracking**: Calculates water saved compared to traditional uniform deployment[cite: 326].
* [cite_start]**Social Impact**: Monitors the number of people protected by active dust suppression in high-risk zones[cite: 328, 329].

---

## ◈ Getting Started

### Prerequisites
* Python 3.9+
* API Keys for:
    * **WAQI** (Air Quality Data)
    * **OpenWeatherMap** (Weather Data)
    * **TomTom** (Traffic Flow Data)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/your-repo/airoptima.git](https://github.com/your-repo/airoptima.git)
    cd airoptima
    ```
2.  **Install dependencies**:
    ```bash
    pip install flask flask-cors numpy pandas scikit-learn requests python-dotenv
    ```
3.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    OPENWEATHER_KEY=your_key_here
    TOMTOM_KEY=your_key_here
    WAQI_KEY=your_key_here
    ```
4.  **Run the Backend**:
    ```bash
    python app.py
    ```
5.  **Launch the Dashboard**:
    Open `index.html` in your browser to access the Command Center.

---

## ◈ Future Scope
* [cite_start]**RAG Integration**: Implementing Retrieval-Augmented Generation to allow authorities to ask natural language questions like *"What is the predicted PM10 for my zone tomorrow?"*[cite: 346, 347].
* [cite_start]**Adaptive Machine Learning**: Continuously retraining the model with live data to adapt to seasonal pollution patterns[cite: 352, 363, 364].

---

* [cite_start]**Neha Sharma** [cite: 8]
* [cite_start]*Jaypee Institute of Information Technology (JIIT), Noida* [cite: 9]
