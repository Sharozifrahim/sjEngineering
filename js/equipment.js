/* ============================================================
   SJ ENGINEERING — Tools & Equipment grid
   Renders the full in-house fleet into #tools-grid, grouped into
   filterable categories. Uses lightweight inline SVG icons (no
   stock photography / external image hosts) so the page has no
   broken-image risk and stays on-brand — same approach as the
   procedural 3D models on product.html.

   NOTE: the 36 items below are representative placeholders built
   from the categories your site already advertises (fabrication,
   welding, drilling, earthmoving, survey). Swap in your real
   fleet register — names, capacities, brands, and/or photos — by
   editing the TOOLS array below.
   ============================================================ */

const CATEGORIES = [
  { id: "fabrication", label: "Fabrication & Welding", icon: "fabrication" },
  { id: "coating",     label: "Surface Prep & Coating", icon: "coating" },
  { id: "lifting",     label: "Lifting & Rigging",      icon: "lifting" },
  { id: "earthmoving", label: "Earthmoving & Civil",    icon: "earthmoving" },
  { id: "ducting",     label: "Ducting & Insulation",   icon: "ducting" },
  { id: "boiler",      label: "Boiler & Piping",        icon: "boiler" },
  { id: "firetest",    label: "Fire Safety & Testing",  icon: "firetest" },
  { id: "survey",      label: "Survey & QA",            icon: "survey" }
];

const TOOLS = [
  // Fabrication & Welding (12)
  { name: "Plate Rolling Machine",        category: "fabrication", spec: "3-roll, up to 20mm mild steel plate" },
  { name: "CNC Plasma Cutting Table",     category: "fabrication", spec: "Cuts up to 32mm carbon steel" },
  { name: "Hydraulic Guillotine Shear",   category: "fabrication", spec: "12mm x 3m capacity" },
  { name: "Hydraulic Press Brake",        category: "fabrication", spec: "100-ton, 3m bed" },
  { name: "SMAW Welding Sets",            category: "fabrication", spec: "400A, certified operators" },
  { name: "GTAW (TIG) Welding Machine",   category: "fabrication", spec: "For stainless & precision joints" },
  { name: "MIG/MAG Welding Machine",      category: "fabrication", spec: "High-deposition structural welds" },
  { name: "Submerged Arc Welder (SAW)",   category: "fabrication", spec: "Long-seam tank & vessel welds" },
  { name: "Pipe Beveling Machine",        category: "fabrication", spec: "Prepares weld-ready pipe ends" },
  { name: "Radial Arm Drilling Machine",  category: "fabrication", spec: "Up to 50mm bore, structural steel" },
  { name: "Surface Grinder",              category: "fabrication", spec: "Weld dressing & finishing" },
  { name: "Bandsaw Cutting Machine",      category: "fabrication", spec: "Straight & mitre cuts, structural sections" },

  // Surface Prep & Coating (3)
  { name: "Abrasive Sandblasting Unit",   category: "coating", spec: "Sa 2.5 surface prep standard" },
  { name: "Airless Spray Painting Rig",   category: "coating", spec: "Epoxy & polyurethane coating systems" },
  { name: "Industrial Air Compressor",    category: "coating", spec: "Powers blasting & pneumatic tools" },

  // Lifting & Rigging (5)
  { name: "Mobile Crane",                 category: "lifting", spec: "25-ton capacity, site rigging" },
  { name: "Crawler Crane",                category: "lifting", spec: "Heavy equipment installation" },
  { name: "Forklift",                     category: "lifting", spec: "3-ton, yard & workshop handling" },
  { name: "Chain Hoists & Block Sets",    category: "lifting", spec: "1–10 ton rated" },
  { name: "Gantry Crane",                 category: "lifting", spec: "Workshop overhead lifting" },

  // Earthmoving & Civil (5)
  { name: "Excavator",                    category: "earthmoving", spec: "Foundation & trenching works" },
  { name: "Backhoe Loader",               category: "earthmoving", spec: "Site grading & loading" },
  { name: "Bulldozer",                    category: "earthmoving", spec: "Site clearing & levelling" },
  { name: "Vibratory Roller Compactor",   category: "earthmoving", spec: "Sub-base & backfill compaction" },
  { name: "Concrete Mixer",               category: "earthmoving", spec: "Foundation & footing pours" },

  // Ducting & Insulation (3)
  { name: "Duct Fabrication Roll-Former", category: "ducting", spec: "GI & SS sheet forming" },
  { name: "Flange Forming Machine",       category: "ducting", spec: "TDF & slip-on duct flanges" },
  { name: "Insulation Cutting Table",     category: "ducting", spec: "Thermal & acoustic lagging" },

  // Boiler & Piping (3)
  { name: "Pipe Threading Machine",       category: "boiler", spec: "Up to 4\" NPT/BSP" },
  { name: "Hydrotest Pump",               category: "boiler", spec: "High-pressure line & vessel testing" },
  { name: "Tube Expander",                category: "boiler", spec: "Boiler tube-to-drum sealing" },

  // Fire Safety & Testing (2)
  { name: "Hydrostatic Test Rig",         category: "firetest", spec: "Fire line & hydrant network testing" },
  { name: "Pressure Gauge Calibration Bench", category: "firetest", spec: "NFPA-compliant instrument checks" },

  // Survey & QA (3)
  { name: "Total Station",                category: "survey", spec: "Site layout & as-built survey" },
  { name: "Digital Auto Level",           category: "survey", spec: "Elevation & levelling checks" },
  { name: "Ultrasonic Thickness Gauge",   category: "survey", spec: "NDT wall-thickness verification" }
];

const ICONS = {
  fabrication: `<path d="M4 20 14 10"/><path d="M13 5l6 6-2 2-6-6z"/><path d="M18 4l2 2"/><path d="M3 21l2-2"/>`,
  coating: `<rect x="7" y="8" width="8" height="13" rx="1.5"/><path d="M9 8V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/><path d="M17 6l2-1"/><path d="M18 9h2.2"/><path d="M17 12l2 1"/>`,
  lifting: `<path d="M3 20h9"/><path d="M4 20V7l14 4"/><path d="M18 11v3.2"/><circle cx="17" cy="16.2" r="2"/>`,
  earthmoving: `<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h6l4-6h4"/><path d="M16 11l3 2-2 4-5 1"/>`,
  ducting: `<path d="M4 4v8a4 4 0 0 0 4 4h8"/><path d="M20 20V4"/><path d="M4 4h4"/><path d="M16 20h4"/>`,
  boiler: `<circle cx="12" cy="12" r="7"/><path d="M12 12l3-2"/><path d="M12 5v1"/><path d="M12 18v1"/><path d="M5 12h1"/><path d="M18 12h1"/>`,
  firetest: `<path d="M8 3c2 3-2 4-1 7a3 3 0 0 0 6 0c0-2-1-2-1-4 2 1 3 3 3 5a5 5 0 0 1-10 0c0-3 1-5 3-8z"/>`,
  survey: `<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>`
};

function svgIcon(id){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[id] || ""}</svg>`;
}

function injectStyles(){
  if(document.getElementById("tools-grid-styles")) return;
  const style = document.createElement("style");
  style.id = "tools-grid-styles";
  style.textContent = `
    .tools-filters{
      display:flex; flex-wrap:wrap; gap:.5rem;
      margin:0 0 2rem;
    }
    .tools-chip{
      font-family:"Work Sans", sans-serif;
      font-size:.85rem; font-weight:600;
      padding:.45rem 1rem;
      border:1px solid rgba(58,61,67,.25);
      border-radius:999px;
      background:transparent;
      color:#3a3d43;
      cursor:pointer;
      transition:background .15s ease, color .15s ease, border-color .15s ease;
    }
    .tools-chip:hover{ border-color:#e0762c; }
    .tools-chip.active{
      background:#e0762c;
      border-color:#e0762c;
      color:#fff;
    }
    .tools-grid{
      display:grid;
      grid-template-columns:repeat(auto-fill, minmax(230px, 1fr));
      gap:1.1rem;
    }
    .tool-card{
      display:flex; flex-direction:column; gap:.75rem;
      padding:1.3rem 1.2rem;
      border:1px solid rgba(58,61,67,.15);
      border-radius:.5rem;
      background:#fff;
      transition:border-color .15s ease, transform .15s ease;
    }
    .tool-card:hover{ border-color:#e0762c; transform:translateY(-2px); }
    .tool-icon{
      width:2.6rem; height:2.6rem;
      display:flex; align-items:center; justify-content:center;
      border-radius:.4rem;
      background:rgba(224,118,44,.1);
      color:#e0762c;
    }
    .tool-icon svg{ width:1.5rem; height:1.5rem; }
    .tool-name{
      font-family:"Barlow Condensed", sans-serif;
      font-weight:700; font-size:1.15rem;
      color:#1c1e21; line-height:1.15;
    }
    .tool-spec{
      font-family:"Work Sans", sans-serif;
      font-size:.85rem; color:#5c6067;
      line-height:1.4;
    }
    .tool-tag{
      font-family:"Work Sans", sans-serif;
      font-size:.7rem; font-weight:600;
      letter-spacing:.02em;
      color:#8a8f98;
    }
    .tools-empty{
      font-family:"Work Sans", sans-serif;
      color:#8a8f98; padding:2rem 0;
    }
  `;
  document.head.appendChild(style);
}

function categoryLabel(id){
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.label : id;
}

function renderFilters(container, active, onSelect){
  const counts = { all: TOOLS.length };
  CATEGORIES.forEach(c => { counts[c.id] = TOOLS.filter(t => t.category === c.id).length; });

  const chips = [{ id: "all", label: "All Equipment" }, ...CATEGORIES];
  container.innerHTML = "";
  chips.forEach(c => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tools-chip" + (c.id === active ? " active" : "");
    btn.textContent = `${c.label} (${counts[c.id]})`;
    btn.addEventListener("click", () => onSelect(c.id));
    container.appendChild(btn);
  });
}

function renderGrid(grid, active){
  const items = active === "all" ? TOOLS : TOOLS.filter(t => t.category === active);
  grid.innerHTML = "";

  if(items.length === 0){
    const empty = document.createElement("p");
    empty.className = "tools-empty";
    empty.textContent = "No equipment listed in this category yet.";
    grid.appendChild(empty);
    return;
  }

  items.forEach(tool => {
    const card = document.createElement("article");
    card.className = "tool-card";
    card.innerHTML = `
      <div class="tool-icon">${svgIcon(tool.category)}</div>
      <div class="tool-tag">${categoryLabel(tool.category)}</div>
      <h3 class="tool-name">${tool.name}</h3>
      <p class="tool-spec">${tool.spec}</p>
    `;
    grid.appendChild(card);
  });
}

function initEquipmentGrid(){
  const grid = document.getElementById("tools-grid");
  if(!grid) return;

  injectStyles();

  const filters = document.createElement("div");
  filters.className = "tools-filters";
  grid.parentElement.insertBefore(filters, grid);

  let active = "all";
  function select(id){
    active = id;
    renderFilters(filters, active, select);
    renderGrid(grid, active);
  }
  select("all");
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", initEquipmentGrid);
} else {
  initEquipmentGrid();
}