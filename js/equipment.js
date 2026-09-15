/* ============================================================
   SJ ENGINEERING — Tools & Equipment grid
   Renders the full in-house fleet into #tools-grid, grouped into
   filterable categories. Uses lightweight inline SVG icons (no
   stock photography / external image hosts) so the page has no
   broken-image risk and stays on-brand — same approach as the
   procedural 3D models on product.html.
   ============================================================ */

const CATEGORIES = [
  { id: "fabrication", label: "Fabrication & Machining", icon: "fabrication" },
  { id: "welding",     label: "Welding",                 icon: "welding" },
  { id: "gas_supply",  label: "Gas & Air Supply",         icon: "gas_supply" },
  { id: "drilling",    label: "Drilling",                 icon: "drilling" },
  { id: "ducting",     label: "Sheet Metal & Ducting",    icon: "ducting" },
  { id: "press",       label: "Press & Punch",            icon: "press" },
  { id: "survey",      label: "Survey & Measurement",     icon: "survey" }
];

const TOOLS = [
  // Fabrication & Machining
  { name: "Sheet Rolling Machine",      category: "fabrication", spec: "Plate & sheet forming to required radius" },
  { name: "Grinder 4\" & 9\"",          category: "fabrication", spec: "Surface finishing & weld dressing" },
  { name: "Auto Cutter",                category: "fabrication", spec: "Automated straight-line cutting" },
  { name: "Gas Cutter",                 category: "fabrication", spec: "Oxy-fuel flame cutting, mild steel" },
  { name: "Profile Cutter",             category: "fabrication", spec: "CNC profile cutting of steel plate" },
  { name: "Milling Machine",            category: "fabrication", spec: "Precision milling of metal components" },
  { name: "Shaper Machine",             category: "fabrication", spec: "Flat surface & slot machining" },
  { name: "Lathe Machine",              category: "fabrication", spec: "Turning, facing & threading of parts" },
  { name: "Bench Grander",              category: "fabrication", spec: "Bench-mounted grinding & sharpening" },

  // Welding
  { name: "Welding Plant",              category: "welding", spec: "Central welding power supply unit" },
  { name: "CO2 Welding",                category: "welding", spec: "MIG/MAG welding with CO2 shielding gas" },
  { name: "Argon Welding",              category: "welding", spec: "TIG welding with argon shielding gas" },
  { name: "HDPE Welding Machine",       category: "welding", spec: "Butt/electrofusion welding of HDPE pipe" },

  // Gas & Air Supply
  { name: "Oxygen Gas Cylinder",        category: "gas_supply", spec: "Oxygen supply for gas cutting/welding" },
  { name: "Faun Gas Cylinder",          category: "gas_supply", spec: "Fuel gas supply for cutting torches" },
  { name: "Air Compressor",             category: "gas_supply", spec: "Compressed air for pneumatic tools" },

  // Drilling
  { name: "Hilti Drill Machine",        category: "drilling", spec: "Heavy-duty rotary/hammer drilling" },
  { name: "Drill Machine",              category: "drilling", spec: "General-purpose portable drilling" },
  { name: "Radial Drilling Machine",    category: "drilling", spec: "Large bore drilling on structural steel" },
  { name: "Bench Drill Machine",        category: "drilling", spec: "Bench-mounted precision drilling" },
  { name: "Magnetic Drill Machine",     category: "drilling", spec: "Portable magnetic-base drilling on steel" },

  // Sheet Metal & Ducting
  { name: "Banding Machine",            category: "ducting", spec: "Banding/strapping of duct sections" },
  { name: "Scape Folding",              category: "ducting", spec: "Sheet metal folding for scape/duct work" },
  { name: "Cladding Machine",           category: "ducting", spec: "Metal cladding sheet forming" },
  { name: "Ducting Machine",            category: "ducting", spec: "Fabrication of ductwork sections" },

  // Press & Punch
  { name: "Power Press",                category: "press", spec: "Sheet metal pressing & forming" },
  { name: "Punching Machine",           category: "press", spec: "Hole punching in metal sheet/plate" },

  // Survey & Measurement
  { name: "Laser Level",                category: "survey", spec: "Site levelling & alignment checks" }
];

const ICONS = {
  fabrication: `<path d="M4 20 14 10"/><path d="M13 5l6 6-2 2-6-6z"/><path d="M18 4l2 2"/><path d="M3 21l2-2"/>`,
  welding: `<path d="M3 21l6-6"/><path d="M9 15l6-6"/><path d="M12 3l4 4-2 2-4-4z"/><path d="M17 6l2 2"/><path d="M2 12l3 3"/>`,
  gas_supply: `<rect x="9" y="7" width="6" height="14" rx="2"/><path d="M11 7V4a1 1 0 0 1 1-1 1 1 0 0 1 1 1v3"/><path d="M9 12h6"/>`,
  drilling: `<rect x="10" y="3" width="4" height="9" rx="1"/><path d="M12 12v3"/><path d="M8 15h8l-1 6H9z"/>`,
  ducting: `<path d="M4 4v8a4 4 0 0 0 4 4h8"/><path d="M20 20V4"/><path d="M4 4h4"/><path d="M16 20h4"/>`,
  press: `<rect x="5" y="3" width="14" height="6" rx="1"/><path d="M12 9v5"/><rect x="7" y="14" width="10" height="7" rx="1"/>`,
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