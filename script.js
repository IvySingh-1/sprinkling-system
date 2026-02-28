const API_BASE = "http://localhost:5000/api";
const REFRESH_SEC = 30;
const DEPOT = { lat: 28.6139, lng: 77.209 };

let lastData = null;
let selectedZone = null;
let pm25Hist = {};
let pm10Hist = {};
let pmViewMode = "realtime";
let mapMode = "normal";
let heatLayer = null;
let hotspotMarkers = [];
let newsItems = [];
let newsTimer = null;
let reviewItems = [];

// ── TRUCK FLEET STATE ────────────────────────────────────────────────
// Each truck: id, status('spray'|'return'|'idle'), zone, progress(0–100), lat, lng
const TRUCK_COUNT = 5;
let fleetState = Array.from({ length: TRUCK_COUNT }, (_, i) => ({
  id: i + 1,
  status: "idle",
  zone: null,
  progress: 0,
  lat: DEPOT.lat,
  lng: DEPOT.lng,
}));
const truckMapMarkers = {}; // Leaflet markers for moving trucks
const zoneMarkers = {};
const rippleMarkers = {};

// ────────────────────────────────────────────────────────────
// CLOCK
// ────────────────────────────────────────────────────────────
setInterval(() => {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString(
    "en-IN",
    { hour12: false },
  );
}, 1000);

// ────────────────────────────────────────────────────────────
// SVG HELPERS
// ────────────────────────────────────────────────────────────
function truckSVG(color, size = 16, spray = false) {
  const s = size;
  const dropLines = spray
    ? `
    <line x1="2" y1="3" x2="0"  y2="0" stroke="${color}" stroke-width="0.9" opacity="0.7"/>
    <line x1="4" y1="3" x2="3"  y2="0" stroke="${color}" stroke-width="0.9" opacity="0.7"/>
    <line x1="6" y1="3" x2="5.5" y2="0" stroke="${color}" stroke-width="0.9" opacity="0.7"/>`
    : "";
  return `<svg width="${s}" height="${Math.round(s * 0.85)}" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="3" width="12" height="8" rx="1.2" fill="${color}"/>
    <polygon points="12,2 20,5.5 20,11 12,11" fill="${color}" opacity="0.85"/>
    <rect x="1" y="4" width="5" height="4" rx="0.5" fill="rgba(0,20,40,0.7)"/>
    <circle cx="4"  cy="12.8" r="2.4" fill="${color}" opacity="0.9"/>
    <circle cx="4"  cy="12.8" r="1.1" fill="rgba(0,20,40,0.8)"/>
    <circle cx="16" cy="12.8" r="2.4" fill="${color}" opacity="0.9"/>
    <circle cx="16" cy="12.8" r="1.1" fill="rgba(0,20,40,0.8)"/>
    ${dropLines}
  </svg>`;
}

function makeTruckMapIcon(color, spray = false, returning = false) {
  const glow = spray
    ? `drop-shadow(0 0 5px ${color})`
    : returning
      ? `drop-shadow(0 0 4px ${color})`
      : "none";
  const animStyle = spray
    ? `animation:truck-drive .6s ease-in-out infinite;`
    : returning
      ? `opacity:0.85;`
      : "";
  const label = spray
    ? '<text x="10" y="20.5" text-anchor="middle" fill="rgba(0,0,0,0.7)" font-size="3.5" font-weight="bold" font-family="monospace">SPRAY</text>'
    : returning
      ? '<text x="10" y="20.5" text-anchor="middle" fill="rgba(0,0,0,0.65)" font-size="3.5" font-weight="bold" font-family="monospace">RETURN</text>'
      : "";
  const dropLines = spray
    ? `
    <line x1="1" y1="3.5" x2="-0.5" y2="0" stroke="${color}" stroke-width="1" opacity="0.8" style="animation:truck-spray-drop .5s ease-in-out infinite"/>
    <line x1="3" y1="3.5" x2="2"    y2="0" stroke="${color}" stroke-width="1" opacity="0.8" style="animation:truck-spray-drop .5s .15s ease-in-out infinite"/>
    <line x1="5" y1="3.5" x2="5"    y2="0" stroke="${color}" stroke-width="1" opacity="0.8" style="animation:truck-spray-drop .5s .3s ease-in-out infinite"/>`
    : "";
  const html = `<div style="filter:${glow};${animStyle}">
    <svg width="22" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="4" width="12" height="8" rx="1.2" fill="${color}"/>
      <polygon points="12,3 20,6.5 20,12 12,12" fill="${color}" opacity="0.85"/>
      <rect x="1" y="5" width="5" height="4" rx="0.5" fill="rgba(0,20,40,0.7)"/>
      <circle cx="4"  cy="13.5" r="2.3" fill="${color}" opacity="0.9"/>
      <circle cx="4"  cy="13.5" r="1"   fill="rgba(0,20,40,0.8)"/>
      <circle cx="16" cy="13.5" r="2.3" fill="${color}" opacity="0.9"/>
      <circle cx="16" cy="13.5" r="1"   fill="rgba(0,20,40,0.8)"/>
      ${dropLines}${label}
    </svg>
  </div>`;
  return L.divIcon({
    html,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });
}

// ────────────────────────────────────────────────────────────
// FLEET ANIMATION ENGINE
// Simulates trucks moving depot→zone (outbound) and zone→depot (return)
// ────────────────────────────────────────────────────────────
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function updateFleetPositions(zones, spkls) {
  const deployedZones = (zones || [])
    .filter((z) => z.truck)
    .sort((a, b) => b.aqi - a.aqi);

  // Assign trucks: first N deployed zones get spray trucks, rest idle/returning
  fleetState.forEach((truck, i) => {
    if (i < deployedZones.length) {
      const z = deployedZones[i];
      if (truck.status === "idle" || (truck.zone && truck.zone !== z.name)) {
        // New deployment → outbound
        truck.status = "spray";
        truck.zone = z.name;
        truck.progress =
          truck.progress > 80
            ? truck.progress
            : Math.min(truck.progress + 15, 100);
        truck.targetLat = z.lat;
        truck.targetLng = z.lng;
      } else if (truck.status === "spray") {
        // Move towards zone
        truck.progress = Math.min(truck.progress + 8, 100);
      }
    } else {
      if (truck.status === "spray") {
        // Start returning
        truck.status = "return";
        truck.progress = 100;
        truck.targetLat = DEPOT.lat;
        truck.targetLng = DEPOT.lng;
      } else if (truck.status === "return") {
        truck.progress = Math.max(truck.progress - 10, 0);
        if (truck.progress === 0) {
          truck.status = "idle";
          truck.zone = null;
          truck.lat = DEPOT.lat;
          truck.lng = DEPOT.lng;
        }
      }
    }

    // Interpolate position
    const t = truck.progress / 100;
    if (truck.status === "spray" && truck.targetLat) {
      truck.lat = lerp(DEPOT.lat, truck.targetLat, t);
      truck.lng = lerp(DEPOT.lng, truck.targetLng, t);
    } else if (truck.status === "return") {
      const zone = (zones || []).find((z) => z.name === truck.zone);
      if (zone) {
        truck.lat = lerp(zone.lat, DEPOT.lat, 1 - t);
        truck.lng = lerp(zone.lng, DEPOT.lng, 1 - t);
      }
    } else {
      truck.lat = DEPOT.lat + i * 0.003;
      truck.lng = DEPOT.lng + i * 0.002;
    }
  });

  // Update map markers
  fleetState.forEach((truck) => {
    const color =
      truck.status === "spray"
        ? "#00ffb3"
        : truck.status === "return"
          ? "#ffd84d"
          : "rgba(200,232,255,0.3)";
    const icon = makeTruckMapIcon(
      color,
      truck.status === "spray",
      truck.status === "return",
    );
    const tooltip =
      truck.status === "spray"
        ? `MCD-0${truck.id} 🟢 SPRAYING → ${truck.zone}`
        : truck.status === "return"
          ? `MCD-0${truck.id} 🟡 RETURNING to depot`
          : `MCD-0${truck.id} ⚪ IDLE at depot`;

    if (!truckMapMarkers[truck.id]) {
      truckMapMarkers[truck.id] = L.marker([truck.lat, truck.lng], {
        icon,
        zIndexOffset: 900,
      })
        .addTo(map)
        .bindTooltip(tooltip, { direction: "top" });
    } else {
      truckMapMarkers[truck.id].setLatLng([truck.lat, truck.lng]);
      truckMapMarkers[truck.id].setIcon(icon);
      truckMapMarkers[truck.id].setTooltipContent(tooltip);
    }
  });
}

function renderFleetPanel() {
  document.getElementById("fleet-list").innerHTML = fleetState
    .map((truck) => {
      const color =
        truck.status === "spray"
          ? "#00ffb3"
          : truck.status === "return"
            ? "#ffd84d"
            : "rgba(200,232,255,0.2)";
      const pct =
        truck.status === "idle"
          ? 0
          : truck.status === "spray"
            ? truck.progress
            : 100 - truck.progress;
      const badge =
        truck.status === "spray"
          ? `<span class="fleet-badge fb-spray">SPRAYING</span>`
          : truck.status === "return"
            ? `<span class="fleet-badge fb-return">RETURNING</span>`
            : `<span class="fleet-badge fb-idle">IDLE</span>`;
      const dest =
        truck.status === "spray"
          ? truck.zone?.split(" ")[0] || "…"
          : truck.status === "return"
            ? "← Depot"
            : "Depot";
      return `<div class="fleet-row">
      <span class="fleet-id">MCD-0${truck.id}</span>
      <div class="fleet-status-bar"><div class="fleet-progress" style="width:${pct}%;background:${color}"></div></div>
      <span class="fleet-label" style="color:${color};font-size:7px;">${dest}</span>
      ${badge}
    </div>`;
    })
    .join("");
}

// Animate fleet independently at 1 fps
setInterval(() => {
  if (!lastData) return;
  updateFleetPositions(lastData.zones, lastData.sprinklers || {});
  renderFleetPanel();
  renderTruckBar(lastData.summary, lastData.zones);
}, 1000);

// ────────────────────────────────────────────────────────────
// AQI BEFORE / AFTER IMPACT ENGINE
// ────────────────────────────────────────────────────────────
function estimateAQIAfter(z) {
  if (!z) return null;
  const action = z.final_action || "no_spray";
  const wind = z.weather?.wind_speed || 3;
  const type = z.pollution_type;

  if (action === "no_spray" || type === "combustion") return null;

  // Model: high spray reduces more, wind disperses, dust responds better
  const baseReduction = action === "spray_high" ? 0.22 : 0.12;
  const windBonus = Math.min(wind / 10, 0.06); // mild wind helps disperse
  const typeBonus = type === "dust" ? 0.05 : 0.0; // dust responds to water better
  const reduction = Math.min(baseReduction + windBonus + typeBonus, 0.35);

  const before = z.aqi;
  const after = Math.round(before * (1 - reduction));
  const drop = before - after;
  const pct = Math.round(reduction * 100);
  return { before, after, drop, pct };
}

function renderAIImpact(z) {
  const impact = estimateAQIAfter(z);
  const strip = document.getElementById("ai-impact-strip");

  if (!impact) {
    document.getElementById("aqi-before").textContent = Math.round(z?.aqi || 0);
    document.getElementById("aqi-after").textContent = "—";
    document.getElementById("aqi-change").textContent = "No spray";
    document.getElementById("aqi-change").style.color = "var(--muted)";
    document.getElementById("impact-bar-fill").style.width = "50%";
    document.getElementById("impact-note").textContent =
      z?.pollution_type === "combustion"
        ? "Combustion source — water spray ineffective, skip justified"
        : "AQI below threshold — no intervention needed";
    return;
  }

  document.getElementById("aqi-before").textContent = impact.before;
  document.getElementById("aqi-after").textContent = impact.after;
  document.getElementById("aqi-change").textContent =
    `−${impact.drop} (${impact.pct}%)`;
  document.getElementById("aqi-change").style.color = "var(--green)";

  // Bar: current AQI position from left (0=good, full=hazardous)
  const beforePct = Math.min((impact.before / 500) * 100, 100);
  const afterPct = Math.min((impact.after / 500) * 100, 100);
  document.getElementById("impact-bar-fill").style.width = `${afterPct}%`;

  const hrs = z.final_action === "spray_high" ? "3–4" : "4–6";
  document.getElementById("impact-note").textContent =
    `Est. ${impact.pct}% AQI reduction within ${hrs} hours at ${z.weather?.wind_speed || "—"} m/s wind`;
}

// ────────────────────────────────────────────────────────────
// SMART TRAFFIC ALERT ENGINE
// Fires when a truck is spraying in a high-congestion zone
// ────────────────────────────────────────────────────────────
const trafficAlertCooldown = {};
function checkTrafficAlerts(zones) {
  if (!document.getElementById("tgl-traffic")?.classList.contains("on")) return;
  const now = Date.now();
  zones.forEach((z) => {
    if (!z.truck) return;
    const tLvl = z.traffic?.traffic_level || 0;
    const congestion = z.traffic?.congestion_index || 0;
    if (tLvl >= 2 || congestion > 0.65) {
      const key = z.name;
      if (
        !trafficAlertCooldown[key] ||
        now - trafficAlertCooldown[key] > 120000
      ) {
        trafficAlertCooldown[key] = now;
        const speed = z.traffic?.current_speed || "—";
        addAlert(
          `⚠ MCD truck spraying in HIGH TRAFFIC zone: ${z.name} — congestion ${Math.round(congestion * 100)}%, speed ${speed} km/h. Consider off-peak rescheduling.`,
          "traffic",
        );
        // Also push to news
        pushNewsItem({
          headline: `MCD water truck active in heavy traffic at ${z.name} — spray efficiency may be reduced, AQI still ${Math.round(z.aqi)}`,
          tag: "warning",
          source: "AirOptima",
          time: "just now",
        });
      }
    }
    // Alert if spraying helps a high-traffic zone significantly
    if (z.truck && tLvl >= 1 && z.aqi > 200) {
      const key2 = z.name + "_benefit";
      if (
        !trafficAlertCooldown[key2] ||
        now - trafficAlertCooldown[key2] > 180000
      ) {
        trafficAlertCooldown[key2] = now;
        addAlert(
          `✅ Spray truck in ${z.name} reducing dust stirred by traffic — AQI ${Math.round(z.aqi)}, est. ${Math.round(z.aqi * 0.18)} point improvement`,
          "dust",
        );
      }
    }
  });
}

// ────────────────────────────────────────────────────────────
// MAP
// ────────────────────────────────────────────────────────────
const map = L.map("map", {
  center: [28.65, 77.18],
  zoom: 11,
  zoomControl: false,
  attributionControl: false,
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);
L.control.zoom({ position: "bottomright" }).addTo(map);

// Depot marker
L.marker([DEPOT.lat, DEPOT.lng], {
  icon: L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
      <polygon points="20,2 38,36 2,36" fill="none" stroke="#ffc940" stroke-width="2" opacity=".9"/>
      <text x="20" y="26" text-anchor="middle" fill="#ffc940" font-size="6.5" font-family="monospace" font-weight="bold">DEPOT</text>
      <circle cx="20" cy="32" r="1.5" fill="#ffc940" opacity=".6"/>
    </svg>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 38],
  }),
  zIndexOffset: 1200,
})
  .bindTooltip("<b>MCD Water Depot</b><br>All trucks dispatched from here", {
    direction: "top",
  })
  .addTo(map);

function aqiColor(aqi) {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#ff0000";
  if (aqi <= 300) return "#8f3f97";
  return "#7e0023";
}
function makeZoneIcon(aqi, active, selected) {
  const c = aqiColor(aqi);
  const ring = active
    ? `<circle cx="22" cy="22" r="20" fill="none" stroke="#00ffb3" stroke-width="2" opacity=".8"/>`
    : "";
  const sel = selected
    ? `<circle cx="22" cy="22" r="21" fill="none" stroke="#00c8ff" stroke-width="1.5" stroke-dasharray="4 2"/>`
    : "";
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="18" fill="${c}" fill-opacity=".2" stroke="${c}" stroke-width="2"/>
      ${ring}${sel}
      <text x="22" y="27" text-anchor="middle" fill="white" font-size="11" font-weight="bold" font-family="monospace">${Math.round(Math.min(aqi, 999))}</text>
    </svg>`,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}
function makeRippleIcon() {
  return L.divIcon({
    html: `<div style="position:relative;width:58px;height:58px;">${[0, 0.5, 1].map((d) => `<div style="position:absolute;top:50%;left:50%;width:48px;height:48px;border-radius:50%;border:2px solid #00ffb3;margin:-24px;animation:rpl 2s ease-out ${d}s infinite;opacity:0;"></div>`).join("")}<style>@keyframes rpl{0%{transform:scale(.3);opacity:.8;}100%{transform:scale(2.3);opacity:0;}}</style></div>`,
    className: "",
    iconSize: [58, 58],
    iconAnchor: [29, 29],
  });
}

// ────────────────────────────────────────────────────────────
// MAP MODE
// ────────────────────────────────────────────────────────────
function setMapMode(mode, btn) {
  mapMode = mode;
  document
    .querySelectorAll(".mmode-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("map-legend").style.display =
    mode !== "heatmap" ? "block" : "none";
  document.getElementById("heatmap-legend").style.display =
    mode === "heatmap" ? "block" : "none";
  if (heatLayer) {
    map.removeLayer(heatLayer);
    heatLayer = null;
  }
  hotspotMarkers.forEach((m) => map.removeLayer(m));
  hotspotMarkers = [];
  Object.values(zoneMarkers).forEach((m) => {
    if (m._icon) m._icon.style.opacity = mode === "heatmap" ? "0.3" : "1";
  });
  if (!lastData) return;
  if (mode === "heatmap") buildHeatmap(lastData.zones);
  else if (mode === "hotspot") buildHotspotMarkers(lastData.zones);
}
function buildHeatmap(zones) {
  const pts = [];
  zones.forEach((z) => {
    const intensity = Math.min(z.aqi / 500, 1.0);
    pts.push([z.lat, z.lng, intensity]);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const dist = 0.025 * (0.3 + Math.random() * 0.7);
      pts.push([
        z.lat + Math.sin(angle) * dist,
        z.lng + Math.cos(angle) * dist,
        intensity * 0.4,
      ]);
    }
  });
  heatLayer = L.heatLayer(pts, {
    radius: 55,
    blur: 40,
    maxZoom: 13,
    gradient: {
      0.1: "#00e400",
      0.3: "#ffff00",
      0.5: "#ff7e00",
      0.7: "#ff0000",
      0.85: "#8f3f97",
      1.0: "#7e0023",
    },
  }).addTo(map);
}
function buildHotspotMarkers(zones) {
  [...zones]
    .filter((z) => z.aqi > 220)
    .sort((a, b) => b.aqi - a.aqi)
    .forEach((z, i) => {
      const c = aqiColor(z.aqi);
      const m = L.marker([z.lat, z.lng], {
        icon: L.divIcon({
          html: `<div style="position:relative;"><div style="position:absolute;top:50%;left:50%;width:44px;height:44px;border-radius:50%;border:2px solid ${c};margin:-22px;animation:hs-pulse 1.8s ease-out ${i * 0.3}s infinite;opacity:0;"></div><div style="background:${c};color:#000;font-family:monospace;font-size:9px;font-weight:bold;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${c};">#${i + 1}</div><style>@keyframes hs-pulse{0%{transform:scale(.5);opacity:.9;}100%{transform:scale(2.5);opacity:0;}}</style></div>`,
          className: "",
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
        zIndexOffset: 900,
      })
        .addTo(map)
        .bindTooltip(
          `🎯 HOTSPOT #${i + 1}: ${z.name}<br>AQI: ${Math.round(z.aqi)} | ${z.pollution_type.toUpperCase()}<br>PM2.5: ${Math.round(z.pm25)} μg/m³`,
          { direction: "top" },
        );
      hotspotMarkers.push(m);
    });
}

// ────────────────────────────────────────────────────────────
// CHARTS
// ────────────────────────────────────────────────────────────
Chart.defaults.color = "rgba(200,232,255,0.5)";
Chart.defaults.borderColor = "rgba(255,255,255,0.05)";
const mf = { family: "'JetBrains Mono',monospace", size: 8.5 };

const pmChart = new Chart(document.getElementById("pmChart").getContext("2d"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "PM2.5 (μg/m³)",
        data: [],
        borderColor: "#ff6b9d",
        backgroundColor: "rgba(255,107,157,0.10)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
        borderWidth: 2,
        pointBackgroundColor: "#ff6b9d",
      },
      {
        label: "PM10 (μg/m³)",
        data: [],
        borderColor: "#00c8ff",
        backgroundColor: "rgba(0,200,255,0.07)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 4,
        borderWidth: 2,
        pointBackgroundColor: "#00c8ff",
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 400 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: mf,
          boxWidth: 10,
          padding: 8,
          color: "rgba(200,232,255,0.7)",
        },
      },
      tooltip: {
        backgroundColor: "rgba(6,18,32,0.95)",
        borderColor: "rgba(0,200,255,0.25)",
        borderWidth: 1,
        titleFont: mf,
        bodyFont: mf,
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ${ctx.raw !== null ? ctx.raw.toFixed(1) : "N/A"} μg/m³`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        ticks: { font: mf, maxTicksLimit: 8, color: "rgba(200,232,255,0.4)" },
        grid: { color: "rgba(255,255,255,.03)" },
      },
      y: {
        display: true,
        ticks: { font: mf, color: "rgba(200,232,255,0.4)" },
        grid: { color: "rgba(255,255,255,.04)" },
        title: {
          display: true,
          text: "μg/m³",
          font: mf,
          color: "rgba(200,232,255,0.3)",
        },
      },
    },
  },
});
const fcChart = new Chart(document.getElementById("fcChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "History",
        data: [],
        borderColor: "#00c8ff",
        backgroundColor: "rgba(0,200,255,.07)",
        tension: 0.4,
        pointRadius: 1,
        borderWidth: 1.5,
        fill: true,
      },
      {
        label: "Forecast",
        data: [],
        borderColor: "#ffc940",
        borderDash: [5, 3],
        backgroundColor: "rgba(255,201,64,.05)",
        tension: 0.4,
        pointRadius: 1,
        borderWidth: 1.5,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 300 },
    interaction: { mode: "index", intersect: false },
    plugins: { legend: { labels: { font: mf, boxWidth: 8 } } },
    scales: {
      x: {
        ticks: { font: mf, color: "rgba(200,232,255,0.4)" },
        grid: { color: "rgba(255,255,255,.03)" },
      },
      y: {
        ticks: { font: mf, color: "rgba(200,232,255,0.4)" },
        grid: { color: "rgba(255,255,255,.04)" },
      },
    },
  },
});
const aqiBarChart = new Chart(document.getElementById("aqiBarChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      { label: "AQI", data: [], backgroundColor: [], borderRadius: 3 },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 300 },
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { font: mf } },
      y: { ticks: { font: mf }, grid: { color: "rgba(255,255,255,.04)" } },
    },
  },
});
const pieChart = new Chart(document.getElementById("pieChart"), {
  type: "doughnut",
  data: {
    labels: ["Dust", "Combustion", "Mixed"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          "rgba(0,200,255,.7)",
          "rgba(255,123,47,.7)",
          "rgba(255,201,64,.7)",
        ],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    cutout: "62%",
    plugins: { legend: { labels: { font: mf, boxWidth: 10 } } },
  },
});

// ────────────────────────────────────────────────────────────
// PM CHART VIEW MODES
// ────────────────────────────────────────────────────────────
function setPMView(mode, btn) {
  pmViewMode = mode;
  document
    .querySelectorAll(".chart-tab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  if (mode === "bar") {
    pmChart.config.type = "bar";
    document.getElementById("pm-chart-title").textContent =
      "PM2.5 & PM10 — All Zones";
    if (lastData) renderPMBar(lastData.zones);
  } else if (mode === "ratio") {
    pmChart.config.type = "line";
    document.getElementById("pm-chart-title").textContent =
      "PM10/PM2.5 Ratio — Trend";
    if (lastData) renderPMRatio(lastData.zones);
  } else {
    pmChart.config.type = "line";
    document.getElementById("pm-chart-title").textContent =
      "PM2.5 & PM10 — Real-time";
    const z = lastData
      ? lastData.zones.find((x) => x.name === selectedZone) ||
        lastData.zones.reduce(
          (a, b) => (a.aqi > b.aqi ? a : b),
          lastData.zones[0],
        )
      : null;
    if (z) updatePMChart(z);
  }
  pmChart.update();
}
function updatePMChart(z) {
  if (!z || pmViewMode !== "realtime") return;
  if (!pm25Hist[z.name]) {
    pm25Hist[z.name] = [];
    pm10Hist[z.name] = [];
  }
  const last = pm25Hist[z.name][pm25Hist[z.name].length - 1];
  if (last !== z.pm25) {
    pm25Hist[z.name].push(parseFloat(z.pm25.toFixed(1)));
    pm10Hist[z.name].push(parseFloat(z.pm10.toFixed(1)));
  }
  if (pm25Hist[z.name].length > 20) {
    pm25Hist[z.name].shift();
    pm10Hist[z.name].shift();
  }
  const n = pm25Hist[z.name].length;
  pmChart.config.type = "line";
  pmChart.data.labels = pm25Hist[z.name].map((_, i) => {
    const m = (n - 1 - i) * 0.5;
    return m === 0 ? "now" : `-${m.toFixed(1)}m`;
  });
  pmChart.data.datasets[0] = {
    label: "PM2.5 (μg/m³)",
    data: [...pm25Hist[z.name]],
    borderColor: "#ff6b9d",
    backgroundColor: "rgba(255,107,157,0.10)",
    fill: true,
    tension: 0.4,
    pointRadius: 2,
    pointHoverRadius: 4,
    borderWidth: 2,
    pointBackgroundColor: "#ff6b9d",
  };
  pmChart.data.datasets[1] = {
    label: "PM10 (μg/m³)",
    data: [...pm10Hist[z.name]],
    borderColor: "#00c8ff",
    backgroundColor: "rgba(0,200,255,0.07)",
    fill: true,
    tension: 0.4,
    pointRadius: 2,
    pointHoverRadius: 4,
    borderWidth: 2,
    pointBackgroundColor: "#00c8ff",
  };
  pmChart.update("none");
}
function renderPMBar(zones) {
  if (!zones || pmViewMode !== "bar") return;
  pmChart.data.labels = zones.map((z) => z.name.split(" ")[0]);
  pmChart.data.datasets[0] = {
    label: "PM2.5",
    data: zones.map((z) => parseFloat(z.pm25.toFixed(1))),
    backgroundColor: "rgba(255,107,157,0.6)",
    borderColor: "#ff6b9d",
    borderWidth: 1,
    borderRadius: 3,
  };
  pmChart.data.datasets[1] = {
    label: "PM10",
    data: zones.map((z) => parseFloat(z.pm10.toFixed(1))),
    backgroundColor: "rgba(0,200,255,0.5)",
    borderColor: "#00c8ff",
    borderWidth: 1,
    borderRadius: 3,
  };
  pmChart.update("none");
}
function renderPMRatio(zones) {
  if (!zones || pmViewMode !== "ratio") return;
  const sorted = [...zones].sort((a, b) => b.aqi - a.aqi);
  pmChart.data.labels = sorted.map((z) => z.name.split(" ")[0]);
  pmChart.data.datasets[0] = {
    label: "PM10/PM2.5 Ratio",
    data: sorted.map((z) => parseFloat(z.pm_ratio)),
    borderColor: "#ffc940",
    backgroundColor: "rgba(255,201,64,0.08)",
    fill: true,
    tension: 0.4,
    pointRadius: 3,
    pointBackgroundColor: sorted.map((z) =>
      z.pm_ratio > 1.85 ? "#00ffb3" : z.pm_ratio < 1.35 ? "#ff7b2f" : "#ffc940",
    ),
    borderWidth: 2,
  };
  pmChart.data.datasets[1] = {
    data: [],
    label: "",
    borderWidth: 0,
    pointRadius: 0,
  };
  pmChart.update("none");
}
function updateFcChart(z) {
  if (!z?.forecast) return;
  const hist = z.forecast.history || [],
    fore = z.forecast.forecast || [];
  fcChart.data.labels = [
    ...hist.map((_, i) => `-${hist.length - i}h`),
    ...fore.map((_, i) => `+${i + 1}h`),
  ];
  fcChart.data.datasets[0].data = [...hist, ...Array(fore.length).fill(null)];
  fcChart.data.datasets[1].data = [
    ...Array(hist.length - 1).fill(null),
    hist[hist.length - 1] || null,
    ...fore,
  ];
  fcChart.update("none");
}
function updateAnalyticsCharts(zones) {
  aqiBarChart.data.labels = zones.map((z) => z.name.split(" ")[0]);
  aqiBarChart.data.datasets[0].data = zones.map((z) => Math.round(z.aqi));
  aqiBarChart.data.datasets[0].backgroundColor = zones.map(
    (z) => aqiColor(z.aqi) + "bb",
  );
  aqiBarChart.update("none");
  const dc = zones.filter((z) => z.pollution_type === "dust").length,
    cc = zones.filter((z) => z.pollution_type === "combustion").length;
  pieChart.data.datasets[0].data = [dc, cc, zones.length - dc - cc];
  pieChart.update("none");
}

// ────────────────────────────────────────────────────────────
// HOTSPOT PANEL
// ────────────────────────────────────────────────────────────
function renderHotspotPanel(zones) {
  const sorted = [...zones].sort((a, b) => b.aqi - a.aqi).slice(0, 4);
  const maxAqi = sorted[0]?.aqi || 1;
  document.getElementById("hotspot-list").innerHTML = sorted
    .map((z, i) => {
      const c = aqiColor(z.aqi);
      const pct = Math.round((z.aqi / Math.max(maxAqi, 1)) * 100);
      const hist = pm25Hist[z.name] || [];
      const trend =
        hist.length >= 2
          ? hist[hist.length - 1] - hist[0] > 5
            ? "▲"
            : hist[0] - hist[hist.length - 1] > 5
              ? "▼"
              : "→"
          : "→";
      const tColor =
        trend === "▲"
          ? "var(--red)"
          : trend === "▼"
            ? "var(--green)"
            : "var(--muted)";
      const impact = estimateAQIAfter(z);
      const impactStr = impact ? `→${impact.after}` : "—";
      return `<div class="hs-item">
      <span style="font-family:var(--mono);font-size:8px;color:${c};width:14px;">#${i + 1}</span>
      <span class="hs-name">${z.name}</span>
      <div class="hs-bar-wrap"><div class="hs-bar" style="width:${pct}%;background:${c}"></div></div>
      <span class="hs-aqi" style="color:${c}">${Math.round(z.aqi)}</span>
      <span style="font-family:var(--mono);font-size:7.5px;color:var(--green);margin-left:3px;">${impactStr}</span>
      <span class="hs-trend" style="color:${tColor};margin-left:4px;">${trend}</span>
    </div>`;
    })
    .join("");
}

// ────────────────────────────────────────────────────────────
// NEWS FEED
// ────────────────────────────────────────────────────────────
const NEWS_TEMPLATES = [
  {
    tpl: (z) =>
      `${z.name} records AQI ${Math.round(z.aqi)} — residents advised to limit outdoor exposure`,
    tag: "alert",
    src: "CPCB",
  },
  {
    tpl: (z) =>
      `MCD deploys water sprinkler at ${z.name} as PM2.5 crosses ${Math.round(z.pm25)} μg/m³`,
    tag: "action",
    src: "MCD",
  },
  {
    tpl: (z) =>
      `Construction dust primary pollutant in ${z.name} area (PM ratio: ${z.pm_ratio})`,
    tag: "info",
    src: "IMD",
  },
  {
    tpl: (z) =>
      `Air quality worsens in ${z.name} — PM10 at ${Math.round(z.pm10)} μg/m³ (${Math.round(z.pm10 / 50)}× safe limit)`,
    tag: "warning",
    src: "SAFAR",
  },
  {
    tpl: (z) =>
      `Wind at ${z.weather?.wind_speed || 3} m/s in ${z.name} — low dispersion tonight`,
    tag: "warning",
    src: "IMD",
  },
  {
    tpl: (z) =>
      `GRAP Stage ${z.aqi > 300 ? "IV" : z.aqi > 250 ? "III" : "II"} restrictions near ${z.name}`,
    tag: "alert",
    src: "CAQM",
  },
  {
    tpl: () =>
      `Delhi overall AQI forecast: improvement expected after 6 AM due to northwesterly winds`,
    tag: "info",
    src: "SAFAR",
  },
  {
    tpl: () =>
      `Crop residue burning detected in neighbouring states — transboundary advection`,
    tag: "warning",
    src: "ISRO",
  },
  {
    tpl: (z) =>
      `AirOptima AI truck dispatched to ${z.name} — est. ${Math.round(z.aqi * 0.18)} AQI reduction in 4hrs`,
    tag: "action",
    src: "AirOptima",
  },
  {
    tpl: () => `8/10 Delhi monitoring stations report "Very Poor" air quality`,
    tag: "alert",
    src: "CPCB",
  },
  {
    tpl: (z) =>
      `Truck spraying in heavy traffic at ${z.name} — dust suppression effective despite congestion`,
    tag: "info",
    src: "AirOptima",
  },
  {
    tpl: (z) =>
      `Hotspot analysis: ${z.name} highest PM concentration in past 3 hours`,
    tag: "alert",
    src: "AirOptima",
  },
];
let newsRotIdx = 0;
function generateNewsItem(zones) {
  if (!zones?.length) return null;
  const tpl = NEWS_TEMPLATES[newsRotIdx % NEWS_TEMPLATES.length];
  newsRotIdx++;
  const z = zones[Math.floor(Math.random() * Math.min(4, zones.length))];
  return {
    headline: tpl.tpl(z),
    tag: tpl.tag,
    source: tpl.src,
    time: "just now",
  };
}
function pushNewsItem(item) {
  if (!item) return;
  newsItems.unshift(item);
  if (newsItems.length > 5) newsItems.pop();
  renderNewsFeed();
}
function renderNewsFeed() {
  document.getElementById("news-feed").innerHTML = newsItems
    .map(
      (n) => `
    <div class="news-item">
      <div class="news-headline">${n.headline}</d
      <div class="news-meta"><span class="news-source">${n.source}</span><span class="news-time">${n.time}</span><span class="news-tag tag-${n.tag}">${n.tag.toUpperCase()}</span></div>
    </div>`,
    )
    .join("");
}
function startNewsSimulator(zones) {
  if (newsTimer) clearInterval(newsTimer);
  for (let i = 0; i < 3; i++) {
    const it = generateNewsItem(zones);
    if (it) {
      it.time = `${(i + 1) * 2}m ago`;
      newsItems.push(it);
    }
  }
  renderNewsFeed();
  newsTimer = setInterval(() => {
    const it = generateNewsItem(lastData?.zones || zones);
    if (it) pushNewsItem(it);
  }, 7000);
}

// ────────────────────────────────────────────────────────────
// USER REVIEW / CUSTOM ALERT
// ────────────────────────────────────────────────────────────
function populateZoneSelect(zones) {
  const sel = document.getElementById("review-zone");
  const existing = Array.from(sel.options).map((o) => o.value);
  (zones || []).forEach((z) => {
    if (!existing.includes(z.name)) {
      const opt = document.createElement("option");
      opt.value = z.name;
      opt.textContent = z.name;
      sel.appendChild(opt);
    }
  });
}

function submitReview() {
  const text = document.getElementById("review-input").value.trim();
  if (!text) return;
  const type = document.getElementById("review-type").value;
  const zone = document.getElementById("review-zone").value;
  const now = new Date().toLocaleTimeString("en-IN", { hour12: false });
  const item = { text, type, zone, time: now };
  reviewItems.unshift(item);
  if (reviewItems.length > 8) reviewItems.pop();
  document.getElementById("review-input").value = "";
  renderReviewFeed();
  // Also push to main alert feed
  addAlert(
    `[Admin] ${zone !== "All Zones" ? zone + ": " : ""}${text}`,
    type === "alert" ? "warn" : type === "action" ? "dust" : "info",
  );
  // Push to news feed
  pushNewsItem({
    headline: `Field report: ${text}`,
    tag: type,
    source: "MCD Admin",
    time: "just now",
  });
}

function renderReviewFeed() {
  const typeClass = {
    alert: "rv-alert",
    warning: "rv-warning",
    action: "rv-action",
    info: "rv-info",
  };
  document.getElementById("review-feed").innerHTML = reviewItems
    .map(
      (r) => `
    <div class="review-item ${typeClass[r.type] || "rv-info"}">
      <div class="rv-text">${r.text}</div>
      <div class="rv-meta"><span>${r.zone}</span><span>${r.time}</span></div>
    </div>`,
    )
    .join("");
}

// Allow Enter to submit review (Shift+Enter = newline)
document.getElementById("review-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submitReview();
  }
});

// ────────────────────────────────────────────────────────────
// DATA FETCH
// ────────────────────────────────────────────────────────────
async function fetchData() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    lastData = data;
    setBadge(true);
    hideErrToast();
    document.getElementById("loading").style.display = "none";
    render(data);
  } catch (e) {
    setBadge(false);
    showErrToast(`Backend error: ${e.message}`);
    document.getElementById("loading").style.display = "none";
    addAlert(`⚠ Backend unreachable: ${e.message}`, "warn");
  }
}
function setBadge(ok) {
  const el = document.getElementById("api-badge");
  el.textContent = ok ? "API ●" : "API ✕";
  el.style.color = ok ? "var(--green)" : "var(--red)";
  el.style.borderColor = ok ? "rgba(0,255,179,.3)" : "rgba(255,61,90,.3)";
}
function showErrToast(msg) {
  const el = document.getElementById("err-toast");
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => (el.style.display = "none"), 6000);
}
function hideErrToast() {
  document.getElementById("err-toast").style.display = "none";
}

// ────────────────────────────────────────────────────────────
// RENDER
// ────────────────────────────────────────────────────────────
function render(data) {
  const zones = data.zones || [];
  const sum = data.summary || {};
  const spkls = data.sprinklers || {};

  const wkl = (sum.water_saved_L || 0) / 1000;
  document.getElementById("kw").textContent = wkl.toFixed(1);
  document.getElementById("kp").textContent = fmtNum(sum.people_covered || 0);
  document.getElementById("kc").textContent =
    "₹" + fmtNum(sum.cost_saved_INR || 0);
  document.getElementById("ka").textContent = Math.round(sum.avg_aqi || 0);
  document.getElementById("who-x").textContent =
    Math.round(((sum.avg_aqi || 0) * 0.45) / 15) + "x";
  document.getElementById("who-avg").textContent = Math.round(sum.avg_aqi || 0);
  document.getElementById("who-trucks").textContent =
    `${sum.trucks_deployed || 0}/5`;

  renderZoneList(zones, spkls);
  renderMap(zones, spkls);
  populateZoneSelect(zones);

  const crit = zones.reduce((a, b) => (a.aqi > b.aqi ? a : b), zones[0] || {});
  const focus = selectedZone
    ? zones.find((z) => z.name === selectedZone) || crit
    : crit;
  if (focus) {
    renderAICard(focus);
    renderAIImpact(focus);
  }

  if (pmViewMode === "realtime" && focus) updatePMChart(focus);
  else if (pmViewMode === "bar") renderPMBar(zones);
  else if (pmViewMode === "ratio") renderPMRatio(zones);

  updateFcChart(focus);
  updateAnalyticsCharts(zones);
  renderHotspotPanel(zones);
  checkTrafficAlerts(zones);

  if (mapMode === "heatmap" && heatLayer) {
    map.removeLayer(heatLayer);
    heatLayer = null;
    buildHeatmap(zones);
  }
  if (mapMode === "hotspot") {
    hotspotMarkers.forEach((m) => map.removeLayer(m));
    hotspotMarkers = [];
    buildHotspotMarkers(zones);
  }

  document.getElementById("imp-t").textContent =
    `${sum.trucks_deployed || 0}/5`;
  document.getElementById("imp-s").textContent =
    `${sum.combustion_skipped || 0} zones`;
  document.getElementById("imp-e").textContent = Math.round(
    ((sum.combustion_skipped || 0) / Math.max(zones.length, 1)) * 100 * 1.4,
  );
  document.getElementById("imp-w").textContent = `${wkl.toFixed(1)} kL`;
  document.getElementById("an-w").textContent = wkl.toFixed(1);
  document.getElementById("an-c").textContent =
    "₹" + fmtNum(sum.cost_saved_INR || 0);
  document.getElementById("an-p").textContent = fmtNum(sum.people_covered || 0);
  document.getElementById("an-a").textContent = Math.round(sum.avg_aqi || 0);
  renderLogTable(zones);
  renderAdminZones(zones, spkls);

  const items = zones
    .slice(0, 8)
    .map(
      (z) =>
        `${z.name}: AQI ${Math.round(z.aqi)} [${z.pollution_type.toUpperCase()}]${spkls[z.name]?.active ? " SPRAY" : ""}`,
    )
    .join("  ◈  ");
  document.getElementById("tick-text").innerHTML =
    `<span class="tick-sep">◈ LIVE FEED</span>${items}<span class="tick-sep">◈</span>${items}`;

  const ni = generateNewsItem(zones);
  if (ni) pushNewsItem(ni);
}

// ────────────────────────────────────────────────────────────
// ZONE LIST & MAP
// ────────────────────────────────────────────────────────────
function renderZoneList(zones, spkls) {
  const hotspotNames = new Set(
    [...zones]
      .sort((a, b) => b.aqi - a.aqi)
      .slice(0, 3)
      .map((z) => z.name),
  );
  const el = document.getElementById("zone-list");
  el.innerHTML = "";
  [...zones]
    .sort((a, b) => b.aqi - a.aqi)
    .forEach((z) => {
      const col = aqiColor(z.aqi),
        pct = Math.min(100, (z.aqi / 500) * 100);
      const active = spkls[z.name]?.active || false,
        isSel = selectedZone === z.name;
      const div = document.createElement("div");
      div.className = [
        "zone-card",
        active ? "spray-on" : "",
        z.pollution_type === "combustion" ? "combustion" : "",
        isSel ? "sel" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const truckState = fleetState.find((t) => t.zone === z.name);
      const truckBadge = z.truck
        ? `<span class="badge bd-truck" style="color:${truckState?.status === "return" ? "var(--yellow)" : "var(--cyan)"}">${truckState?.status === "return" ? "↩ RETURNING" : "↗ SPRAYING"}</span>`
        : "";
      div.innerHTML = `
      <div class="zc-top"><span class="zc-name">${z.name}</span><span class="zc-aqi" style="color:${col}">${Math.round(z.aqi)}</span></div>
      <div class="zc-badges">
        <span class="badge ${typeBadge(z.pollution_type)}">${typeLabel(z.pollution_type)}</span>
        <span class="badge ${active ? "bd-on" : "bd-off"}">${active ? "💧 ON" : "OFF"}</span>
        ${truckBadge}
        ${hotspotNames.has(z.name) ? '<span class="badge bd-hotspot">🎯</span>' : ""}
        ${z.reason?.includes("Manual") ? '<span class="badge bd-manual">⚡ MANUAL</span>' : ""}
      </div>
      <div class="zc-bar-bg"><div class="zc-bar" style="width:${pct}%;background:${col}"></div></div>
      <div class="zc-foot">
        <span>PM2.5 <b>${Math.round(z.pm25)}</b></span>
        <span>PM10 <b>${Math.round(z.pm10)}</b></span>
        <span>${z.weather?.temp ?? "—"}°C</span>
        <span>${z.weather?.wind_speed ?? "—"} m/s</span>
      </div>`;
      div.onclick = () => {
        selectedZone = z.name;
        renderZoneList(lastData.zones, lastData.sprinklers || {});
        renderAICard(z);
        renderAIImpact(z);
        updatePMChart(z);
        updateFcChart(z);
        Object.keys(zoneMarkers).forEach((id) => {
          const mz = lastData.zones.find((x) => x.id == id);
          if (mz)
            zoneMarkers[id].setIcon(
              makeZoneIcon(
                mz.aqi,
                (lastData.sprinklers || {})[mz.name]?.active || false,
                mz.name === z.name,
              ),
            );
        });
      };
      el.appendChild(div);
    });
}

function renderMap(zones, spkls) {
  zones.forEach((z) => {
    const active = spkls[z.name]?.active || false,
      isSel = selectedZone === z.name;
    if (!zoneMarkers[z.id]) {
      const m = L.marker([z.lat, z.lng], {
        icon: makeZoneIcon(z.aqi, active, isSel),
      }).addTo(map);
      m.on("click", () => {
        selectedZone = z.name;
        renderAICard(z);
        renderAIImpact(z);
        updatePMChart(z);
        updateFcChart(z);
        renderZoneList(lastData.zones, lastData.sprinklers || {});
      });
      zoneMarkers[z.id] = m;
    } else zoneMarkers[z.id].setIcon(makeZoneIcon(z.aqi, active, isSel));

    const tLvl = ["LOW", "MODERATE", "HIGH"][z.traffic?.traffic_level || 0];
    zoneMarkers[z.id].bindTooltip(
      `<b>${z.name}</b><br>AQI:<b style="color:${aqiColor(z.aqi)}">${Math.round(z.aqi)}</b> | ${z.pollution_type}<br>PM2.5:${Math.round(z.pm25)} | PM10:${Math.round(z.pm10)}<br>Temp:${z.weather?.temp}°C | Wind:${z.weather?.wind_speed}m/s<br>Traffic:${tLvl} | ${active ? "✅ SPRAY" : "❌ OFF"}`,
      { direction: "top" },
    );

    if (active) {
      if (!rippleMarkers[z.id])
        rippleMarkers[z.id] = L.marker([z.lat, z.lng], {
          icon: makeRippleIcon(),
          zIndexOffset: 500,
        }).addTo(map);
    } else {
      if (rippleMarkers[z.id]) {
        map.removeLayer(rippleMarkers[z.id]);
        delete rippleMarkers[z.id];
      }
    }
  });
}

function renderAICard(z) {
  const tc =
    z.pollution_type === "dust"
      ? "var(--cyan)"
      : z.pollution_type === "combustion"
        ? "var(--orange)"
        : "var(--gold)";
  const conf = Math.round((z.confidence || 0) * 100);
  document.getElementById("ai-text").textContent =
    z.reason || "No reason available";
  document.getElementById("ai-zone").textContent = z.name || "—";
  document.getElementById("ai-type").textContent = (
    z.pollution_type || "—"
  ).toUpperCase();
  document.getElementById("ai-type").style.color = tc;
  document.getElementById("ai-ratio").textContent = z.pm_ratio
    ? `${z.pm_ratio} (PM10/PM2.5)`
    : "—";
  document.getElementById("ai-action").textContent = (z.final_action || "—")
    .replace(/_/g, " ")
    .toUpperCase();
  document.getElementById("ai-conf").textContent = `${conf}%`;
  document.getElementById("conf-fill").style.width = `${conf}%`;
}

function renderTruckBar(summary, zones) {
  const deployed = fleetState
    .filter((t) => t.status !== "idle")
    .concat(fleetState.filter((t) => t.status === "idle"));
  document.getElementById("truck-bar").innerHTML = fleetState
    .map((truck) => {
      const color =
        truck.status === "spray"
          ? "#00ffb3"
          : truck.status === "return"
            ? "#ffd84d"
            : "rgba(200,232,255,0.3)";
      const cls =
        truck.status === "spray"
          ? "tc-spray"
          : truck.status === "return"
            ? "tc-return"
            : "tc-idle";
      const label =
        truck.status === "spray"
          ? truck.zone?.split(" ")[0] || "…"
          : truck.status === "return"
            ? "← Depot"
            : "IDLE";
      const pct =
        truck.status === "idle"
          ? 0
          : truck.status === "spray"
            ? truck.progress
            : 100 - truck.progress;
      return `<div class="truck-chip ${cls}" title="MCD-0${truck.id}: ${truck.status.toUpperCase()}${truck.zone ? " → " + truck.zone : ""}">
      ${truckSVG(color, 14, truck.status === "spray")}
      MCD-0${truck.id}: ${label}
    </div>`;
    })
    .join("");
}

function renderLogTable(zones) {
  document.getElementById("log-body").innerHTML = zones
    .map((z) => {
      const tC =
        z.pollution_type === "dust"
          ? "var(--cyan)"
          : z.pollution_type === "combustion"
            ? "var(--orange)"
            : "var(--gold)";
      const aC = z.final_action?.includes("high")
        ? "var(--green)"
        : z.final_action?.includes("low")
          ? "var(--cyan)"
          : "var(--muted)";
      const impact = estimateAQIAfter(z);
      return `<tr>
      <td>${z.name}</td>
      <td style="color:${aqiColor(z.aqi)}">${Math.round(z.aqi)}</td>
      <td style="color:var(--red)">${Math.round(z.aqi)}</td>
      <td style="color:var(--green)">${impact ? impact.after : "—"}</td>
      <td>${Math.round(z.pm25)}</td>
      <td>${Math.round(z.pm10)}</td>
      <td>${z.pm_ratio}</td>
      <td style="color:${tC}">${z.pollution_type}</td>
      <td>${Math.round((z.confidence || 0) * 100)}%</td>
      <td style="color:${aC}">${(z.final_action || "—").replace(/_/g, " ")}</td>
      <td>${z.truck ? truckSVG("#00ffb3", 12, true) : "—"}</td>
      <td>${z.weather?.wind_speed ?? "—"} m/s</td>
      <td style="color:var(--muted);font-size:7.5px;">${(z.reason || "").slice(0, 50)}</td>
    </tr>`;
    })
    .join("");
}

function renderAdminZones(zones, spkls) {
  document.getElementById("adm-zones").innerHTML = zones
    .map((z) => {
      const on = spkls[z.name]?.active || false;
      return `<div class="adm-zone"><div class="adm-zone-name">${z.name.split(" ")[0]}</div><div class="adm-zone-aqi" style="color:${aqiColor(z.aqi)}">AQI ${Math.round(z.aqi)}</div><div class="adm-zone-tgl ${on ? "on" : ""}" onclick="toggleZone('${z.name}')"><div class="adm-zone-tgl-t"></div></div><div style="font-family:var(--mono);font-size:7.5px;color:var(--muted);margin-top:3px;">${on ? "✅ Manual ON" : "Auto"}</div></div>`;
    })
    .join("");
}

// ────────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────────
function typeBadge(t) {
  return t === "dust" ? "bd-dust" : t === "combustion" ? "bd-comb" : "bd-mixed";
}
function typeLabel(t) {
  return t === "dust" ? "🌫 DUST" : t === "combustion" ? "🔥 COMB" : "⚡ MIXED";
}
function fmtNum(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return Math.round(n / 1000) + "K";
  return n.toString();
}
function addAlert(msg, type = "info") {
  if (!document.getElementById("tgl-alerts").classList.contains("on")) return;
  const el = document.getElementById("alert-feed");
  const cls =
    type === "dust"
      ? "al-dust"
      : type === "comb"
        ? "al-comb"
        : type === "warn"
          ? "al-warn"
          : type === "traffic"
            ? "al-traffic"
            : "al-info";
  const now = new Date().toLocaleTimeString("en-IN");
  const div = document.createElement("div");
  div.className = `alert-item ${cls}`;
  div.innerHTML = `<div>${msg}</div><div class="al-time">${now}</div>`;
  el.prepend(div);
  while (el.children.length > 12) el.removeChild(el.lastChild);
}

// ────────────────────────────────────────────────────────────
// TAB / ADMIN
// ────────────────────────────────────────────────────────────
function switchTab(tab, btn) {
  document
    .querySelectorAll(".tab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("body").style.display =
    tab === "command" ? "grid" : "none";
  document.getElementById("analytics").style.display =
    tab === "analytics" ? "grid" : "none";
  document.getElementById("admin").style.display =
    tab === "admin" ? "grid" : "none";
  if (tab === "analytics")
    setTimeout(() => {
      aqiBarChart.resize();
      pieChart.resize();
    }, 60);
}
function adminRefresh() {
  addAlert("↺ Manual refresh triggered", "info");
  fetchData();
}
function adminDeployAll() {
  if (!lastData?.zones) return;
  const eligible = [...lastData.zones]
    .sort((a, b) => b.aqi - a.aqi)
    .filter(
      (z) =>
        !lastData.sprinklers?.[z.name]?.active &&
        z.pollution_type !== "combustion",
    );
  if (!eligible.length) {
    addAlert("All eligible zones already active", "info");
    return;
  }
  addAlert(`Deploying to ${eligible.length} eligible zones…`, "info");
  Promise.all(eligible.map((z) => toggleZone(z.name, false))).then(() => {
    addAlert(`Deployed: ${eligible.map((z) => z.name).join(", ")}`, "dust");
    fetchData();
  });
}
function adminResetOverrides() {
  if (!lastData?.zones) return;
  const on = lastData.zones.filter(
    (z) => lastData.sprinklers?.[z.name]?.active,
  );
  addAlert(`✕ Resetting ${on.length} override(s)`, "warn");
  Promise.all(on.map((z) => toggleZone(z.name, false))).then(() => fetchData());
}
async function toggleZone(name, refetch = true) {
  try {
    const res = await fetch(`${API_BASE}/sprinkler/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zone: name }),
    });
    const d = await res.json();
    addAlert(
      `${d.active ? "✅ Manual ON" : "❌ Manual OFF"}: ${name}`,
      d.active ? "dust" : "info",
    );
    if (refetch) fetchData();
    return d;
  } catch (e) {
    addAlert(`⚠ Toggle failed for ${name}: ${e.message}`, "warn");
  }
}

// ────────────────────────────────────────────────────────────
// BOOT
// ────────────────────────────────────────────────────────────
(async function init() {
  document.getElementById("analytics").style.display = "none";
  document.getElementById("admin").style.display = "none";
  await fetchData();
  if (lastData?.zones) startNewsSimulator(lastData.zones);
  setInterval(async () => {
    await fetchData();
    addAlert("🔄 Data auto-refreshed", "info");
  }, REFRESH_SEC * 1000);
})();
