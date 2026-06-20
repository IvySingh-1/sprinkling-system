# 🌌 AirOptima v3: AI-Driven Smart Sprinkling System for Delhi-NCR
### 🏆 Winning Project – EPAM Climate Data Hackathon, Delhi 2026 | Awarded ₹1,00,000 Cash Prize (~USD 1060)

<!-- VISUAL 1: ANIMATED BANNER (SVG) -->
<div align="center">
<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(58, 45, 40, 0.25);">
  <style>
    @keyframes windFlow {
      0% { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -100; }
    }
    @keyframes droplet {
      0% { transform: translateY(-20px) translateX(0); opacity: 0; }
      10% { opacity: 0.8; }
      80% { opacity: 0.8; }
      100% { transform: translateY(180px) translateX(-20px); opacity: 0; }
    }
    @keyframes pulseGlow {
      0% { fill: #A48374; opacity: 0.6; }
      50% { fill: #CBAD8D; opacity: 0.9; }
      100% { fill: #A48374; opacity: 0.6; }
    }
    @keyframes floatDust {
      0% { transform: translateY(0px) translateX(0); opacity: 0.8; }
      50% { transform: translateY(-15px) translateX(10px); opacity: 0.4; }
      100% { transform: translateY(-30px) translateX(0); opacity: 0; }
    }
    .grid-line { stroke: #D1C7BD; stroke-width: 0.5; opacity: 0.15; }
    .flow-wave { stroke: #A48374; stroke-width: 1.5; fill: none; stroke-dasharray: 20 10; animation: windFlow 6s linear infinite; opacity: 0.4; }
    .flow-wave-accent { stroke: #CBAD8D; stroke-width: 1; fill: none; stroke-dasharray: 15 15; animation: windFlow 4s linear infinite; opacity: 0.6; }
    .drop { fill: #CBAD8D; animation: droplet 2s infinite linear; }
    .dust { fill: #A48374; animation: floatDust 4s infinite ease-in-out; }
    .headline { fill: #F1EDE6; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 42px; font-weight: 900; letter-spacing: 6px; }
    .tagline { fill: #CBAD8D; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: bold; letter-spacing: 2px; }
    .status-badge { fill: #3A2D28; stroke: #CBAD8D; stroke-width: 1.5; rx: 4px; }
  </style>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="#3A2D28" />
  
  <!-- Grid Matrix Overlay (Futuristic HUD feel) -->
  <line x1="0" y1="40" x2="800" y2="40" class="grid-line" />
  <line x1="0" y1="80" x2="800" y2="80" class="grid-line" />
  <line x1="0" y1="120" x2="800" y2="120" class="grid-line" />
  <line x1="0" y1="160" x2="800" y2="160" class="grid-line" />
  <line x1="0" y1="200" x2="800" y2="200" class="grid-line" />
  <line x1="100" y1="0" x2="100" y2="240" class="grid-line" />
  <line x1="200" y1="0" x2="200" y2="240" class="grid-line" />
  <line x1="300" y1="0" x2="300" y2="240" class="grid-line" />
  <line x1="400" y1="0" x2="400" y2="240" class="grid-line" />
  <line x1="500" y1="0" x2="500" y2="240" class="grid-line" />
  <line x1="600" y1="0" x2="600" y2="240" class="grid-line" />
  <line x1="700" y1="0" x2="700" y2="240" class="grid-line" />

  <!-- Animated Wind Wave Paths -->
  <path d="M -50 150 Q 150 50 350 150 T 750 150 T 1150 150" class="flow-wave" />
  <path d="M -50 180 Q 200 120 450 180 T 950 180" class="flow-wave-accent" />
  <path d="M -50 90 Q 100 190 250 90 T 550 90 T 850 90" class="flow-wave" style="animation-duration: 8s;" />

  <!-- Radar circle details -->
  <circle cx="700" cy="120" r="60" fill="none" stroke="#A48374" stroke-width="1" opacity="0.3" />
  <circle cx="700" cy="120" r="40" fill="none" stroke="#CBAD8D" stroke-width="1" opacity="0.2" />
  <circle cx="700" cy="120" r="5" fill="#CBAD8D" class="pulse-glow" style="animation: pulseGlow 2s infinite;" />
  <line x1="700" y1="60" x2="700" y2="180" stroke="#A48374" stroke-dasharray="2 2" opacity="0.4" />
  <line x1="640" y1="120" x2="760" y2="120" stroke="#A48374" stroke-dasharray="2 2" opacity="0.4" />

  <!-- Animated spray droplets (falling) -->
  <circle cx="120" cy="0" r="2.5" class="drop" style="animation-delay: 0s; animation-duration: 1.8s;" />
  <circle cx="190" cy="0" r="3" class="drop" style="animation-delay: 0.3s; animation-duration: 2.2s;" />
  <circle cx="280" cy="0" r="2" class="drop" style="animation-delay: 0.7s; animation-duration: 1.5s;" />
  <circle cx="340" cy="0" r="3.5" class="drop" style="animation-delay: 1.1s; animation-duration: 2.5s;" />
  <circle cx="480" cy="0" r="2.5" class="drop" style="animation-delay: 0.5s; animation-duration: 2s;" />
  <circle cx="560" cy="0" r="3" class="drop" style="animation-delay: 1.3s; animation-duration: 1.9s;" />
  <circle cx="630" cy="0" r="2" class="drop" style="animation-delay: 0.9s; animation-duration: 2.3s;" />

  <!-- Animated dust particles (rising/dissipating) -->
  <circle cx="150" cy="180" r="4" class="dust" style="animation-delay: 0s; animation-duration: 3s;" />
  <circle cx="250" cy="200" r="6" class="dust" style="animation-delay: 1s; animation-duration: 4.5s;" />
  <circle cx="320" cy="190" r="5" class="dust" style="animation-delay: 2.2s; animation-duration: 3.5s;" />
  <circle cx="420" cy="185" r="4" class="dust" style="animation-delay: 1.5s; animation-duration: 4.8s;" />
  <circle cx="500" cy="210" r="5" class="dust" style="animation-delay: 0.7s; animation-duration: 3.8s;" />
  <circle cx="610" cy="195" r="4.5" class="dust" style="animation-delay: 2.8s; animation-duration: 4.1s;" />

  <!-- Typography -->
  <text x="60" y="115" class="headline">AIROPTIMA</text>
  <text x="63" y="145" class="tagline">SMART AI POLLUTION MITIGATION &amp; LOGISTICS</text>

  <!-- Small details: HUD corner ticks -->
  <path d="M 15 15 L 15 35 M 15 15 L 35 15" stroke="#CBAD8D" stroke-width="2" fill="none" />
  <path d="M 785 15 L 785 35 M 785 15 L 765 15" stroke="#CBAD8D" stroke-width="2" fill="none" />
  <path d="M 15 225 L 15 205 M 15 225 L 35 225" stroke="#CBAD8D" stroke-width="2" fill="none" />
  <path d="M 785 225 L 785 205 M 785 225 L 765 225" stroke="#CBAD8D" stroke-width="2" fill="none" />
  
  <!-- Version Tag -->
  <g transform="translate(63, 165)">
    <rect width="78" height="18" class="status-badge" />
    <text x="39" y="13" fill="#CBAD8D" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="900" text-anchor="middle">VERSION 3.0</text>
  </g>
  <g transform="translate(147, 165)">
    <rect width="64" height="18" fill="#A48374" rx="4" />
    <text x="32" y="13" fill="#F1EDE6" font-family="'Segoe UI', sans-serif" font-size="9" font-weight="900" text-anchor="middle">ACTIVE ML</text>
  </g>
</svg>
</div>

---

## ◈ The Air Quality Paradox

Mitigating air pollution in a metropolitan city like Delhi is not a matter of simply "spraying water." uniform deployments lead to massive inefficiencies and dry reservoirs:

* ** The Gaseous vs. Coarse Particle Dilemma**: Water spraying binds heavy dust (**PM10**), forcing it to settle. However, spraying combustion-dominant pollutants (**PM2.5** like vehicular exhaust or smoke) is virtually ineffective, resulting in water wastage in critical times.
* ** Blind Logistics**: Deploying municipal tankers uniformly across multiple locations fails to prioritize the zones with critical needs and high human exposure.
* ** Massive Resource Drain**: Uniform distribution wastes up to **68%** of municipal water resources while failing to lower PM density in combustion-heavy sectors.

---

## ◈ The Solution: AirOptima

**AirOptima** introduces an AI-driven, selective mitigation paradigm. By combining a **Hybrid Machine Learning Engine** with live GIS mapping and fleet routing simulators, it ensures that water is sprayed only when and where it is meteorologically and chemically effective.

<div align="center" style="margin: 20px 0;">
  <table style="width: 100%; border-collapse: collapse; border-spacing: 0; font-family: 'Segoe UI', sans-serif; font-size: 13px;">
    <thead>
      <tr style="background-color: #3A2D28; color: #F1EDE6; border-bottom: 2px solid #CBAD8D;">
        <th style="padding: 12px; text-align: left; border-right: 1px solid #D1C7BD;">Feature</th>
        <th style="padding: 12px; text-align: left; border-right: 1px solid #D1C7BD;">Traditional Sprinkling</th>
        <th style="padding: 12px; text-align: left;">AirOptima Smart System</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color: #F1EDE6; color: #3A2D28; border-bottom: 1px solid #D1C7BD;">
        <td style="padding: 12px; font-weight: bold; border-right: 1px solid #D1C7BD;">Deployment Trigger</td>
        <td style="padding: 12px; border-right: 1px solid #D1C7BD;">Scheduled (Blind to active pollution types)</td>
        <td style="padding: 12px; font-weight: bold; color: #A48374;">AI Classification (Dust vs. Combustion)</td>
      </tr>
      <tr style="background-color: #EBE3DB; color: #3A2D28; border-bottom: 1px solid #D1C7BD;">
        <td style="padding: 12px; font-weight: bold; border-right: 1px solid #D1C7BD;">Water Conservation</td>
        <td style="padding: 12px; border-right: 1px solid #D1C7BD;">0% (Uniform water drain)</td>
        <td style="padding: 12px; font-weight: bold; color: #A48374;">68.5% Water Saved Daily</td>
      </tr>
      <tr style="background-color: #F1EDE6; color: #3A2D28; border-bottom: 1px solid #D1C7BD;">
        <td style="padding: 12px; font-weight: bold; border-right: 1px solid #D1C7BD;">Safety Integration</td>
        <td style="padding: 12px; border-right: 1px solid #D1C7BD;">None (Spraying continues in high winds)</td>
        <td style="padding: 12px; font-weight: bold; color: #A48374;">Wind speed &amp; Direction checks</td>
      </tr>
      <tr style="background-color: #EBE3DB; color: #3A2D28;">
        <td style="padding: 12px; font-weight: bold; border-right: 1px solid #D1C7BD;">Fleet Coordination</td>
        <td style="padding: 12px; border-right: 1px solid #D1C7BD;">Fixed static routes</td>
        <td style="padding: 12px; font-weight: bold; color: #A48374;">Dynamic TomTom Traffic Routing</td>
      </tr>
    </tbody>
  </table>
</div>

---

## ◈ System Data Flow & Pipeline

The system fetches live weather, traffic, and particulate density coordinates. It runs the data through a Random Forest Classifier to route action triggers to the water tanker fleet.

<!-- VISUAL 2: FLOW CHART (SVG) -->
<div align="center">
<svg viewBox="0 0 800 260" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: #3A2D28; border-radius: 12px; border: 1px solid #A48374; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
  <style>
    @keyframes dash {
      to {
        stroke-dashoffset: -20;
      }
    }
    .flow-line { stroke: #CBAD8D; stroke-width: 2; stroke-dasharray: 6 4; animation: dash 1s linear infinite; }
    .box-bg { fill: #EBE3DB; stroke: #A48374; stroke-width: 1.5; rx: 8px; }
    .engine-box { fill: #CBAD8D; stroke: #A48374; stroke-width: 2; rx: 8px; }
    .box-title { fill: #3A2D28; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; font-weight: bold; }
    .box-body { fill: #3A2D28; font-family: 'JetBrains Mono', monospace; font-size: 10px; }
    .arrow-head { fill: #CBAD8D; }
    .header-text { fill: #F1EDE6; font-family: 'Segoe UI', sans-serif; font-size: 11px; font-weight: bold; letter-spacing: 1px; }
  </style>

  <!-- Section Headers -->
  <text x="30" y="30" class="header-text" opacity="0.6">ENVIRONMENTAL INPUTS</text>
  <text x="320" y="30" class="header-text" opacity="0.6">DECISION CORE</text>
  <text x="610" y="30" class="header-text" opacity="0.6">FLEET ACTIONS</text>
  <line x1="30" y1="38" x2="770" y2="38" stroke="#A48374" stroke-width="0.5" opacity="0.3" />

  <!-- Node 1: API Streams -->
  <g transform="translate(30, 60)">
    <rect width="180" height="150" class="box-bg" />
    <text x="90" y="28" class="box-title" text-anchor="middle"> Live Data Feeds</text>
    <line x1="15" y1="42" x2="165" y2="42" stroke="#A48374" stroke-width="0.5" />
    <text x="25" y="65" class="box-body">● WAQI API (PM2.5/PM10)</text>
    <text x="25" y="95" class="box-body">● Weather (Wind/Temp)</text>
    <text x="25" y="125" class="box-body">● TomTom (Traffic Speed)</text>
  </g>

  <!-- Flow Line 1 -->
  <path d="M 210 135 L 320 135" class="flow-line" />
  <polygon points="320,135 310,130 310,140" class="arrow-head" />

  <!-- Node 2: ML Engine -->
  <g transform="translate(320, 60)">
    <rect width="200" height="150" class="engine-box" />
    <text x="100" y="28" class="box-title" text-anchor="middle" style="fill: #3A2D28;"> AI Decision Core</text>
    <line x1="15" y1="42" x2="185" y2="42" stroke="#3A2D28" stroke-width="0.5" />
    <text x="25" y="65" class="box-body" style="font-weight: bold;">Random Forest Classifier</text>
    <text x="25" y="85" class="box-body">Checks: PM10/PM2.5 Ratio</text>
    <text x="25" y="115" class="box-body" style="font-weight: bold;">Safety Override Logic</text>
    <text x="25" y="135" class="box-body">Checks: Wind Safety (&lt; 8m/s)</text>
  </g>

  <!-- Flow Line 2 -->
  <path d="M 520 135 L 610 135" class="flow-line" />
  <polygon points="610,135 600,130 600,140" class="arrow-head" />

  <!-- Node 3: Fleet Deployment -->
  <g transform="translate(610, 60)">
    <rect width="160" height="150" class="box-bg" />
    <text x="80" y="28" class="box-title" text-anchor="middle"> Smart Dispatch</text>
    <line x1="15" y1="42" x2="145" y2="42" stroke="#A48374" stroke-width="0.5" />
    <text x="20" y="65" class="box-body">● 5-Truck Sprinkler</text>
    <text x="20" y="80" class="box-body">   Lerp Fleet System</text>
    <text x="20" y="110" class="box-body">● Droplet Variation</text>
    <text x="20" y="125" class="box-body">   (High/Low/Off)</text>
    <text x="20" y="140" class="box-body">● Traffic Rerouting</text>
  </g>
</svg>
</div>

---

## ◈ Tech Stack & Architecture

AirOptima is architected as a modular, responsive full-stack system designed to handle real-time geospatial data.

<!-- VISUAL 3: TECH MATRIX (HTML GRID) -->
<div align="center" style="margin-top: 15px;">
  <table style="width: 100%; border-spacing: 12px; border-collapse: separate; background: transparent; font-family: 'Segoe UI', system-ui, sans-serif;">
    <tr>
      <!-- Column 1: Core System -->
      <td width="33.3%" style="background-color: #3A2D28; border: 1.5px solid #A48374; border-radius: 12px; padding: 20px; vertical-align: top; color: #F1EDE6; box-shadow: 0 4px 12px rgba(58,45,40,0.15);">
        <h3 style="margin-top: 0; color: #CBAD8D; border-bottom: 1.5px solid #A48374; padding-bottom: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px;">🎛️ CORE BACKEND</h3>
        <p style="font-size: 12.5px; line-height: 1.6; color: #EBE3DB;">The analytical foundation driving real-time intelligence.</p>
        <ul style="padding-left: 18px; margin: 0; font-size: 12px; color: #D1C7BD; line-height: 1.8;">
          <li><b>Flask &amp; CORS:</b> Multi-threaded REST API server.</li>
          <li><b>Python Live Feeds:</b> Connects to real-time APIs.</li>
          <li><b>Dotenv Config:</b> Secure local credential management.</li>
        </ul>
      </td>
      <!-- Column 2: Decision Engine -->
      <td width="33.3%" style="background-color: #3A2D28; border: 1.5px solid #CBAD8D; border-radius: 12px; padding: 20px; vertical-align: top; color: #F1EDE6; box-shadow: 0 4px 12px rgba(58,45,40,0.15);">
        <h3 style="margin-top: 0; color: #F1EDE6; border-bottom: 1.5px solid #CBAD8D; padding-bottom: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px;"> HYBRID ML ENGINE</h3>
        <p style="font-size: 12.5px; line-height: 1.6; color: #EBE3DB;">Distinguishes dust from smoke to prevent water wastage.</p>
        <ul style="padding-left: 18px; margin: 0; font-size: 12px; color: #D1C7BD; line-height: 1.8;">
          <li><b>Scikit-Learn:</b> Random Forest Classifier model.</li>
          <li><b>Pandas &amp; NumPy:</b> Data processing pipelines.</li>
          <li><b>StandardScaler:</b> Feature normalization.</li>
        </ul>
      </td>
      <!-- Column 3: Dashboard & GIS -->
      <td width="33.3%" style="background-color: #3A2D28; border: 1.5px solid #A48374; border-radius: 12px; padding: 20px; vertical-align: top; color: #F1EDE6; box-shadow: 0 4px 12px rgba(58,45,40,0.15);">
        <h3 style="margin-top: 0; color: #CBAD8D; border-bottom: 1.5px solid #A48374; padding-bottom: 8px; font-family: 'JetBrains Mono', monospace; font-size: 14px;"> COMMAND SYSTEM</h3>
        <p style="font-size: 12.5px; line-height: 1.6; color: #EBE3DB;">Real-time dispatch controls and map animations.</p>
        <ul style="padding-left: 18px; margin: 0; font-size: 12px; color: #D1C7BD; line-height: 1.8;">
          <li><b>Leaflet Maps:</b> Live truck tracking &amp; heatmaps.</li>
          <li><b>Chart.js Plots:</b> PM2.5/PM10 ratio &amp; AQI forecasts.</li>
          <li><b>Glassmorphic UI:</b> Neon-highlighted dark interfaces.</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

---

## ◈ Classification & ML Engine

The Random Forest model determines the chemical composition of particulate matter using the PM10 vs. PM2.5 ratio boundary scale:

<!-- VISUAL 4: RATIO SCALE (SVG) -->
<div align="center" style="margin: 15px 0;">
<svg viewBox="0 0 600 130" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: #3A2D28; border-radius: 12px; border: 1px solid #A48374;">
  <style>
    .scale-bg { fill: #EBE3DB; opacity: 0.1; }
    .label { fill: #EBE3DB; font-family: 'Segoe UI', sans-serif; font-size: 11px; }
    .scale-val { fill: #F1EDE6; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: bold; }
    .scale-title { fill: #CBAD8D; font-family: 'Segoe UI', sans-serif; font-size: 12px; font-weight: bold; }
  </style>
  <text x="20" y="25" class="scale-title">🔬 PM10 / PM2.5 Ratio Classification Scale</text>
  
  <!-- Scale Line -->
  <rect x="20" y="45" width="560" height="20" rx="4" class="scale-bg" />
  
  <!-- Segments -->
  <!-- Combustion (<1.35) -->
  <rect x="20" y="45" width="180" height="20" fill="#A48374" rx="4" />
  <!-- Mixed (1.35 - 1.85) -->
  <rect x="200" y="45" width="160" height="20" fill="#CBAD8D" />
  <!-- Dust (>1.85) -->
  <rect x="360" y="45" width="220" height="20" fill="#F1EDE6" rx="4" />
  
  <text x="110" y="80" class="label" text-anchor="middle">Combustion Dominant</text>
  <text x="110" y="95" class="scale-val" text-anchor="middle">Ratio &lt; 1.35</text>
  
  <text x="280" y="80" class="label" text-anchor="middle">Mixed Sources</text>
  <text x="280" y="95" class="scale-val" text-anchor="middle">1.35 - 1.85</text>
  
  <text x="470" y="80" class="label" text-anchor="middle">Dust Dominant</text>
  <text x="470" y="95" class="scale-val" text-anchor="middle">Ratio &gt; 1.85</text>
</svg>
</div>

* ** Combustion Dominant (Ratio < 1.35)**: Primarily vehicular exhaust, crop fires, and smoke. Sprinklers are **skipped** here because water droplets do not affect these fine particles.
* ** Mixed Sources (Ratio 1.35 – 1.85)**: Combined particles. Prevents high concentration by utilizing a **preventive low-intensity spray**.
* ** Dust Dominant (Ratio > 1.85)**: Heavy construction dust and sand. Triggers a **high-intensity water spray** to suppress the settling process.

---

## ◈ Simulated Water & Cost Efficiencies

By actively skipping combustion-dominant zones and adapting pressure thresholds based on wind conditions, AirOptima achieves major resource optimizations.

<!-- VISUAL 5: PERFORMANCE CHART (SVG) -->
<div align="center" style="margin: 15px 0;">
<svg viewBox="0 0 600 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto; background: #3A2D28; border-radius: 12px; border: 1px solid #A48374; box-shadow: 0 4px 16px rgba(0,0,0,0.15);">
  <style>
    @keyframes grow-x {
      from { width: 0; }
    }
    .bar { height: 26px; rx: 5px; animation: grow-x 1.5s cubic-bezier(0.1, 0.9, 0.2, 1) forwards; }
    .axis { stroke: #A48374; stroke-width: 1; }
    .label { fill: #EBE3DB; font-family: 'Segoe UI', sans-serif; font-size: 11px; font-weight: bold; }
    .val-text { fill: #F1EDE6; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
    .title { fill: #F1EDE6; font-family: 'Segoe UI', sans-serif; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }
    .subtitle { fill: #CBAD8D; font-family: 'JetBrains Mono', monospace; font-size: 9px; }
  </style>

  <!-- Title -->
  <text x="25" y="32" class="title"> Daily Water Usage Simulation</text>
  <text x="25" y="47" class="subtitle">COMPARING 10 DELHI ZONES (UNIFORM MITIGATION vs. AIROPTIMA ACTION)</text>

  <!-- Y-Axis -->
  <line x1="160" y1="60" x2="160" y2="190" class="axis" />

  <!-- Bar 1: Uniform Spraying -->
  <text x="25" y="86" class="label">Uniform Spraying</text>
  <rect x="160" y="70" width="370" class="bar" fill="#A48374" />
  <text x="540" y="87" class="val-text" fill="#A48374">20.0 kL</text>

  <!-- Bar 2: AirOptima Smart -->
  <text x="25" y="131" class="label">AirOptima AI</text>
  <rect x="160" y="115" width="116" class="bar" fill="#CBAD8D" />
  <text x="286" y="132" class="val-text" fill="#CBAD8D">6.3 kL</text>

  <!-- Bar 3: Water Saved -->
  <text x="25" y="176" class="label" style="fill: #CBAD8D;">Water Saved (68.5%)</text>
  <rect x="160" y="160" width="254" class="bar" fill="#F1EDE6" />
  <text x="424" y="177" class="val-text" style="fill: #F1EDE6; font-weight: bold;">13.7 kL</text>
</svg>
</div>

---

## ◈ Getting Started

Follow these steps to deploy and run the AirOptima command dashboard locally.

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

* **📖 RAG Integration**: Developing Retrieval-Augmented Generation vectors to query municipal mitigation history via natural language prompts (e.g. *"Which sectors saved the most water last month?"*).
* **📈 Adaptive Re-training**: Enabling online learning patterns to automatically adjust class boundaries during seasonal winter smog transitions.

---

<div align="center" style="margin-top: 50px; padding: 25px; background: #3A2D28; border-radius: 12px; border: 1.5px solid #CBAD8D; font-family: 'Segoe UI', sans-serif; color: #F1EDE6;">
  <p style="font-size: 15px; font-weight: bold; margin-top: 0; color: #CBAD8D;">Thank you for exploring this project.</p>
  <p style="font-size: 12px; color: #EBE3DB; margin-bottom: 20px;">⭐ If you found value in it, consider starring the repository.</p>
  
  <div style="width: 60px; height: 1.5px; background: #A48374; margin: 15px auto;"></div>
  
  <!-- <p style="font-size: 13px; font-weight: bold; margin-bottom: 5px;">Developed by Ivy Singh</p> -->
  <p style="font-size: 12px; margin-bottom: 12px; font-family: 'JetBrains Mono', monospace;"><a href="mailto:ivysingh99@gmail.com" style="color: #CBAD8D; text-decoration: none;">ivysingh99@gmail.com</a></p>
  
  <a href="https://www.linkedin.com/in/ivysingh99/" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: #A48374; color: #F1EDE6; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: bold; transition: background 0.3s;">
    🔗 LinkedIn
  </a>
</div>