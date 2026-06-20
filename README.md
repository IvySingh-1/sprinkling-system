# AirOptima v3: AI-Driven Smart Sprinkling System for Delhi-NCR
### Winning Project – EPAM Climate Data Hackathon, Delhi 2026 | Awarded ₹1,00,000 Cash Prize (~USD 1060)

<!-- VISUAL 1: ANIMATED BANNER (SVG) -->
<div align="center">
  <img src="./assets/banner.svg" width="100%" alt="AirOptima Animated Banner" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(58, 45, 40, 0.25); pointer-events: none; cursor: default;">
</div>

---

## ◈ Air Pollution Challenge

Mitigating air pollution in a metropolitan city like Delhi is not a matter of simply "spraying water." uniform deployments lead to massive inefficiencies and dry reservoirs:

* **The Gaseous vs. Coarse Particle Dilemma**: Water spraying binds heavy dust (**PM10**), forcing it to settle. However, spraying combustion-dominant pollutants (**PM2.5** like vehicular exhaust or smoke) is virtually ineffective, resulting in water wastage in critical times.
* **Blind Logistics**: Deploying municipal tankers uniformly across multiple locations fails to prioritize the zones with critical needs and high human exposure.
* **Massive Resource Drain**: Uniform distribution wastes up to **68%** of municipal water resources while failing to lower PM density in combustion-heavy sectors.

---

## ◈ The Solution: AirOptima

**AirOptima** introduces an AI-driven, selective mitigation paradigm. By combining a **Hybrid Machine Learning Engine** with live GIS mapping and fleet routing simulators, it ensures that water is sprayed only when and where it is meteorologically and chemically effective.

<!-- THE SOLUTION COMPARISON TABLE (SVG) -->
<div align="center" style="margin: 20px 0;">
  <img src="./assets/comparison_table.svg" width="100%" alt="Traditional vs AirOptima Comparison Table" style="border-radius: 8px; border: 1.5px solid #D1C7BD; box-shadow: 0 4px 12px rgba(58, 45, 40, 0.15);">
</div>

---

## ◈ System Data Flow & Pipeline

The system fetches live weather, traffic, and particulate density coordinates. It runs the data through a Random Forest Classifier to route action triggers to the water tanker fleet.

<!-- VISUAL 2: FLOW CHART (SVG) -->
<div align="center">
  <img src="./assets/flowchart.svg" width="100%" alt="AirOptima Data Flow Pipeline" style="border-radius: 12px; border: 1px solid #A48374; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
</div>

### Pipeline Workflow Schematic

```mermaid
graph TD
    %% Define Styles using custom color palette
    classDef dark fill:#3A2D28,stroke:#CBAD8D,stroke-width:2px,color:#F1EDE6;
    classDef warm fill:#A48374,stroke:#CBAD8D,stroke-width:1px,color:#F1EDE6;
    classDef tan fill:#CBAD8D,stroke:#3A2D28,stroke-width:1px,color:#3A2D28;
    classDef cream fill:#EBE3DB,stroke:#A48374,stroke-width:1px,color:#3A2D28;
    
    %% Diagram Structure
    subgraph INPUTS ["Live Environmental Feeds"]
        A["WAQI API: PM2.5 & PM10"]:::cream
        B["OpenWeather API: Wind & Temp"]:::cream
        C["TomTom API: Traffic Congestion"]:::cream
    end
    
    subgraph ENGINE ["Decision Core"]
        D["Random Forest Classifier"]:::tan
        E{"Check Ratio & Wind"}:::tan
    end
    
    subgraph ACTIONS ["Fleet Command"]
        F["High/Low Water Spraying"]:::warm
        G["Combustion Skip Action"]:::warm
        H["Congestion Alert Trigger"]:::warm
    end
    
    %% Connections
    A --> D
    B --> D
    C --> D
    D --> E
    E -->|"Ratio > 1.85 & Wind < 8m/s"| F
    E -->|"Ratio < 1.35"| G
    C --> H
    
    %% Apply overall styling
    style INPUTS fill:#3A2D28,stroke:#A48374,color:#F1EDE6
    style ENGINE fill:#3A2D28,stroke:#CBAD8D,color:#F1EDE6
    style ACTIONS fill:#3A2D28,stroke:#A48374,color:#F1EDE6
```

---

## ◈ Tech Stack & Architecture

<!-- VISUAL 3: TECH MATRIX (HTML GRID) -->
<!-- TECH MATRIX GRIDS (SVG) -->
<div align="center" style="margin-top: 15px;">
  <img src="./assets/tech_matrix.svg" width="100%" alt="AirOptima Tech Stack & Architecture" style="border-radius: 12px; box-shadow: 0 4px 16px rgba(58, 45, 40, 0.15);">
</div>

---

## ◈ Classification & ML Engine

The Random Forest model determines the chemical composition of particulate matter using the PM10 vs. PM2.5 ratio boundary scale:

<!-- VISUAL 4: RATIO SCALE (SVG) -->
<div align="center" style="margin: 15px 0;">
  <img src="./assets/ratio_scale.svg" width="100%" alt="PM10 / PM2.5 Ratio Scale" style="border-radius: 12px; border: 1px solid #A48374;">
</div>

* **Combustion Dominant (Ratio < 1.35)**: Primarily vehicular exhaust, crop fires, and smoke. Sprinklers are **skipped** here because water droplets do not affect these fine particles.
* **Mixed Sources (Ratio 1.35 – 1.85)**: Combined particles. Prevents high concentration by utilizing a **preventive low-intensity spray**.
* **Dust Dominant (Ratio > 1.85)**: Heavy construction dust and sand. Triggers a **high-intensity water spray** to suppress the settling process.

---

## ◈ Getting Started

### Prerequisites

* Python 3.9+
* Active API keys for the following endpoints:
  * **WAQI API** (Air Quality Index mapping)
  * **OpenWeatherMap API** (Wind speed safety validation)
  * **TomTom API** (Traffic speed indices)

### 1. Installation

Clone the repository and install the backend modules:
```bash
git clone https://github.com/your-repo/airoptima.git
cd airoptima
pip install flask flask-cors numpy pandas scikit-learn requests python-dotenv
```

### 2. Configure Environment

Create a `.env` file in the root workspace folder:
```env
OPENWEATHER_KEY=your_openweather_key_here
TOMTOM_KEY=your_tomtom_key_here
WAQI_KEY=your_waqi_key_here
```

### 3. Run the Backend

Launch the multi-threaded Flask server:
```bash
python app.py
```
*The backend automatically trains the Random Forest classifier model and hosts endpoints on `http://localhost:5000`.*

### 4. Open the Command Center

Simply open `index.html` in your web browser. The dashboard automatically syncs with the live API server.

---

## ◈ Future Milestones

* **RAG Integration**: Developing Retrieval-Augmented Generation vectors to query municipal mitigation history via natural language prompts (e.g. *"Which sectors saved the most water last month?"*).
* **Adaptive Re-training**: Enabling online learning patterns to automatically adjust class boundaries during seasonal winter smog transitions.

---

<!-- FOOTER (SVG) -->
<div align="center" style="margin-top: 50px;">
  <a href="https://www.linkedin.com/in/ivysingh99/" target="_blank">
    <img src="./assets/footer.svg" width="100%" alt="Thank you for exploring this project. LinkedIn Profile: https://www.linkedin.com/in/ivysingh99/">
  </a>
</div>