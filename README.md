# AI-Driven Smart Pollution Control System for Delhi

**AirOptima** is an intelligent, data-driven system designed to optimize air pollution mitigation in Delhi-NCR. By moving away from traditional uniform water sprinkling, this platform uses real-time AI to identify pollution sources and deploy resources where they are most effective.

---

## ◈ The Problem
Delhi's current air-pollution mitigation lacks source identification and impact validation, resulting in water wastage and minimal PM reduction.
* **Water Wastage**: Sprinkling water in combustion-dominated areas (PM2.5) is ineffective and wastes resources in a water-stressed city.
* **Resource Inefficiency**: Deploying tankers uniformly across locations fails to address whether pollution is dust-based (PM10) or combustion-based (PM2.5).
* **Economic Impact**: India faces an annual economic loss of nearly 8.6 lakh crore due to pollution-related health and productivity impacts.

## ◈ The Solution
AirOptima utilizes a **Hybrid AI Decision Engine** to classify pollution types and automate the response from a smart fleet of water trucks.
* **Source Classification**: Differentiates between **Dust-Dominant (PM10)** and **Combustion-Dominant (PM2.5)** using a Random Forest classifier.
* **Smart Sprinkling**: Automatically triggers variable droplet sizes and pump pressure only in zones where water is effective against dust.
* **Real-Time Fleet Management**: Tracks MCD water trucks in real-time, simulating their movement from depots to hazardous zones.
* **Automated Logic**: Skips sprinkling in high-wind conditions or when combustion (smoke/fumes) is the primary pollutant to ensure resource optimization.

---

## ◈ System Architecture

The project is built on a modern full-stack architecture designed for high-frequency data processing.

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | Python / Flask / FastAPI | Decision engine, ML inference, and API management. |
| **Frontend** | React / Next.js / Tailwind | Real-time "Command Center" dashboard with GIS mapping. |
| **AI/ML Engine** | Scikit-learn / NumPy / Pandas | Pollution source classification and trend analysis. |
| **Data APIs** | WAQI / OpenWeather / TomTom | Live feeds for AQI, weather conditions, and traffic density. |

---

## ◈ Key Features

### 1. Command Center Dashboard
A real-time interface for municipal authorities to monitor Delhi's major zones.
* **Live Heatmaps**: Visualizes AQI intensity and risk zones across the city.
* **Predictive Impact**: Estimates potential AQI reduction (Before vs. After) to validate mitigation efforts.
* **Manual Overrides**: Allows administrators to adjust control thresholds and force-activate sprinklers for specific events.

### 2. Fleet Status & Logistics
* **Real-Time Tracking**: Monitors the status of active sprinklers and truck deployment counts.
* **Traffic Integration**: Factors in road density to prevent traffic disruptions during spraying operations.

### 3. Analytics & Impact Tracking
* **Water Usage Tracking**: Calculates water saved compared to traditional uniform deployment.
* **Social Impact**: Monitors the number of people protected by active dust suppression in high-risk zones.

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
* **RAG Integration**: Implementing Retrieval-Augmented Generation to allow authorities to ask natural language questions like *"What is the predicted PM10 for my zone tomorrow?"*
* **Adaptive Machine Learning**: Continuously retraining the model with live data to adapt to seasonal pollution patterns

---

