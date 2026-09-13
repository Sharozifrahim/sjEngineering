/* ============================================================
   SJ ENGINEERING — Product 3D viewers
   Procedural, dependency-light models representing each service
   line (no external .glb files needed). Swap in real GLTF scans
   of your own products later — see the README for how.
   Drag / touch to rotate, auto-rotates when idle.

   Every model is auto-centered on its own bounding-box centre
   (see centerGroup) and the camera is auto-framed to that same
   box, so each viewer always puts its model dead-centre in the
   canvas regardless of how asymmetric the build is.
   ============================================================ */
import * as THREE from "three";

const STEEL = 0x8a8f98;
const STEEL_DARK = 0x3a3d43;
const ORANGE = 0xe0762c;
const GLASS = 0x2f78c2;
const CONCRETE = 0xb7b2a6;
const FIRE_RED = 0xaf3327;
const INSULATION = 0xd9d4c8;

const BUILDERS = {
  truss: buildTruss,
  tank: buildTank,
  duct: buildDuct,
  boiler: buildBoiler,
  firepump: buildFirePump,
  solar: buildSolar
};

export function initProductViewers(selector = "[data-model]"){
  document.querySelectorAll(selector).forEach(canvas => mountViewer(canvas));
}

function mountViewer(canvas){
  const type = canvas.dataset.model;
  const build = BUILDERS[type] || buildTruss;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(6, 10, 6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xe0762c, 0.4);
  fill.position.set(-6, -2, -4);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x6f9fd8, 0.3);
  rim.position.set(-4, 6, -8);
  scene.add(rim);

  const rig = new THREE.Group();
  const model = build();
  const box = centerGroup(model);   // guarantees the model is centred on the rig's origin
  rig.add(model);
  scene.add(rig);

  // Frame the camera to the model's actual measured size, so it's always
  // centred in view with consistent padding, no matter its geometry.
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z, 0.001);
  const viewDir = new THREE.Vector3(0.62, 0.46, 0.94).normalize();

  function resize(){
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.copy(viewDir).multiplyScalar(radius * 1.9);
    camera.near = Math.max(radius * 0.02, 0.05);
    camera.far = radius * 25;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  // ---- manual drag-to-rotate (no external controls dependency) ----
  let dragging = false, lastX = 0, lastY = 0, autoSpin = true, velX = 0.0025;
  function down(x, y){ dragging = true; autoSpin = false; lastX = x; lastY = y; canvas.style.cursor = "grabbing"; }
  function move(x, y){
    if(!dragging) return;
    const dx = x - lastX, dy = y - lastY;
    rig.rotation.y += dx * 0.008;
    rig.rotation.x = Math.max(-0.6, Math.min(0.6, rig.rotation.x + dy * 0.006));
    velX = dx * 0.0006;
    lastX = x; lastY = y;
  }
  function up(){ dragging = false; canvas.style.cursor = "grab"; }

  canvas.addEventListener("pointerdown", e => down(e.clientX, e.clientY));
  window.addEventListener("pointermove", e => move(e.clientX, e.clientY));
  window.addEventListener("pointerup", up);
  canvas.style.cursor = "grab";

  let raf;
  function animate(){
    raf = requestAnimationFrame(animate);
    if(autoSpin) rig.rotation.y += 0.0035;
    else { rig.rotation.y += velX; velX *= 0.94; }
    renderer.render(scene, camera);
  }
  animate();

  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ if(!raf) animate(); }
      else{ cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0 });
  io.observe(canvas);
}

/* Shifts every top-level child of a group so the group's combined
   bounding box is centred on the origin, then returns that box
   (recomputed post-shift) so the caller can frame a camera to it.
   This is what keeps every model dead-centre in its viewer even
   when the build itself is geometrically lopsided. */
function centerGroup(group){
  group.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(group);
  const center = box.getCenter(new THREE.Vector3());
  group.children.forEach(child => child.position.sub(center));
  group.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(group);
  return box;
}

/* ---------------- shared materials ---------------- */

function steelMat(){ return new THREE.MeshStandardMaterial({ color: STEEL, metalness:0.75, roughness:0.35 }); }
function darkMat(){ return new THREE.MeshStandardMaterial({ color: STEEL_DARK, metalness:0.6, roughness:0.5 }); }
function accentMat(){ return new THREE.MeshStandardMaterial({ color: ORANGE, metalness:0.3, roughness:0.4 }); }
function glassMat(){ return new THREE.MeshStandardMaterial({ color: GLASS, metalness:0.2, roughness:0.15 }); }
function concreteMat(){ return new THREE.MeshStandardMaterial({ color: CONCRETE, metalness:0.05, roughness:0.95 }); }
function fireMat(){ return new THREE.MeshStandardMaterial({ color: FIRE_RED, metalness:0.35, roughness:0.4 }); }
function insulationMat(){ return new THREE.MeshStandardMaterial({ color: INSULATION, metalness:0.05, roughness:0.9 }); }

/* ---------------- model builders ---------------- */

// Structural steel Warren truss / platform assembly with decking,
// bolted gusset plates, base plates and a full handrail run.
function buildTruss(){
  const g = new THREE.Group();
  const spanHalf = 3.2;
  const rows = [-1.4, 0, 1.4];

  const beamGeo = new THREE.BoxGeometry(spanHalf * 2, 0.22, 0.22);
  const postGeo = new THREE.BoxGeometry(0.22, 2, 0.22);
  const baseGeo = new THREE.BoxGeometry(0.5, 0.06, 0.5);
  const boltGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.08, 6);
  const gussetGeo = new THREE.BoxGeometry(0.3, 0.3, 0.04);

  rows.forEach(z => {
    const top = new THREE.Mesh(beamGeo, steelMat()); top.position.set(0, 1, z); g.add(top);
    const bottom = new THREE.Mesh(beamGeo, steelMat()); bottom.position.set(0, -1, z); g.add(bottom);
  });

  const postXs = [];
  for(let x = -spanHalf; x <= spanHalf + 0.01; x += 1.3) postXs.push(Number(x.toFixed(2)));

  postXs.forEach((x, i) => {
    [-1.4, 1.4].forEach(z => {
      const post = new THREE.Mesh(postGeo, darkMat());
      post.position.set(x, 0, z);
      g.add(post);

      const base = new THREE.Mesh(baseGeo, darkMat());
      base.position.set(x, -1.05, z);
      g.add(base);

      [[-0.18,-0.18],[0.18,-0.18],[-0.18,0.18],[0.18,0.18]].forEach(([bx,bz]) => {
        const bolt = new THREE.Mesh(boltGeo, accentMat());
        bolt.position.set(x + bx, -1.02, z + bz);
        g.add(bolt);
      });

      [1, -1].forEach(y => {
        const gusset = new THREE.Mesh(gussetGeo, darkMat());
        gusset.position.set(x, y, z + (z > 0 ? 0.13 : -0.13));
        g.add(gusset);
      });
    });

    if(i < postXs.length - 1){
      const midX = (x + postXs[i + 1]) / 2;
      [-1.4, 1.4].forEach(z => {
        const diag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.45, 0.14), accentMat());
        diag.position.set(midX, 0, z);
        diag.rotation.z = (i % 2 === 0 ? 1 : -1) * Math.PI / 3.4;
        g.add(diag);
      });
    }
  });

  // lateral cross-bracing between the two truss rails
  for(let x = -spanHalf + 0.65; x <= spanHalf - 0.6; x += 1.3){
    const cross = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 2.9), accentMat());
    cross.position.set(x, 1, 0);
    g.add(cross);
  }

  // decking with slat grating on top
  const deck = new THREE.Mesh(new THREE.BoxGeometry(spanHalf * 2 + 0.3, 0.05, 3.0), darkMat());
  deck.position.set(0, 1.16, 0);
  g.add(deck);
  for(let x = -spanHalf; x <= spanHalf; x += 0.35){
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 3.0), steelMat());
    slat.position.set(x, 1.2, 0);
    g.add(slat);
  }

  // handrail run with balusters, both edges
  [-1.5, 1.5].forEach(z => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(spanHalf * 2 + 0.3, 0.04, 0.04), accentMat());
    rail.position.set(0, 2.05, z);
    g.add(rail);
    for(let x = -spanHalf; x <= spanHalf; x += 1.3){
      const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8), steelMat());
      baluster.position.set(x, 1.6, z);
      g.add(baluster);
    }
  });

  g.scale.setScalar(0.55);
  return g;
}

// Cylindrical storage / process tank with manway, nozzles, PRV,
// sight glass, caged access ladder and roof handrail.
function buildTank(){
  const g = new THREE.Group();
  const radius = 2;
  const height = 4.2;

  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 32), steelMat());
  g.add(body);

  const roof = new THREE.Mesh(new THREE.ConeGeometry(radius, 0.9, 32), darkMat());
  roof.position.y = height / 2 + 0.35;
  g.add(roof);

  const skirt = new THREE.Mesh(new THREE.CylinderGeometry(radius + 0.05, radius + 0.25, 0.5, 32), darkMat());
  skirt.position.y = -height / 2 - 0.25;
  g.add(skirt);

  for(let i = 0; i < 3; i++){
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.02, 0.05, 8, 32), accentMat());
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.4 + i * 1.4;
    g.add(ring);
  }

  // bolted manway hatch on the shell
  const manway = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 20), darkMat());
  manway.rotation.z = Math.PI / 2;
  manway.position.set(0, 0.3, radius + 0.02);
  g.add(manway);
  for(let a = 0; a < 12; a++){
    const ang = (a / 12) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 6), accentMat());
    bolt.rotation.z = Math.PI / 2;
    bolt.position.set(0.02, 0.3 + Math.sin(ang) * 0.35, radius + 0.02 + Math.cos(ang) * 0.35);
    g.add(bolt);
  }

  // process nozzles with flanges
  [[1.2, 0.9], [-1.1, -0.4]].forEach(([zOff, yOff]) => {
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.5, 12), steelMat());
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(0.25, yOff, zOff);
    g.add(nozzle);
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 12), darkMat());
    flange.rotation.z = Math.PI / 2;
    flange.position.set(0.5, yOff, zOff);
    g.add(flange);
  });

  // roof-mounted pressure relief valve
  const prv = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.4, 12), accentMat());
  prv.position.set(0.6, height / 2 + 0.55, 0);
  g.add(prv);

  // external sight glass / level gauge
  const gaugeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, height * 0.8, 8), glassMat());
  gaugeTube.position.set(radius + 0.15, 0, 0);
  g.add(gaugeTube);

  // caged access ladder to the roof
  [-0.18, 0.18].forEach(x => {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, height + 0.6, 8), accentMat());
    rail.position.set(x, -0.1, radius + 0.18);
    g.add(rail);
  });
  for(let y = -height / 2 + 0.2; y < height / 2 + 0.4; y += 0.35){
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 6), darkMat());
    rung.rotation.z = Math.PI / 2;
    rung.position.set(0, y, radius + 0.18);
    g.add(rung);
  }
  for(let y = -height / 2 + 0.6; y < height / 2 + 0.2; y += 0.9){
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.02, 6, 16, Math.PI), darkMat());
    hoop.rotation.y = Math.PI / 2;
    hoop.position.set(0, y, radius + 0.18);
    g.add(hoop);
  }

  // roof handrail ring
  const roofRail = new THREE.Mesh(new THREE.TorusGeometry(radius * 0.55, 0.025, 8, 24), accentMat());
  roofRail.position.y = height / 2 + 0.15;
  g.add(roofRail);

  const legGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 8);
  [[-1.4, -1.4], [1.4, -1.4], [-1.4, 1.4], [1.4, 1.4]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, darkMat());
    leg.position.set(x, -height / 2 - 0.7, z);
    g.add(leg);
  });

  g.scale.setScalar(0.78);
  return g;
}

// HVAC ducting run with an insulated straight run, an elbow with
// turning vanes, bolted flange joints, ceiling hangers and a
// damper visible behind the supply grille.
function buildDuct(){
  const g = new THREE.Group();

  const seg1 = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 1), steelMat());
  seg1.position.set(-1.5, 1.5, 0); g.add(seg1);

  for(let x = -3.3; x <= 0.2; x += 0.45){
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.06, 1.06), insulationMat());
    ridge.position.set(x, 1.5, 0);
    g.add(ridge);
  }

  const elbow = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1), darkMat());
  elbow.position.set(0.6, 1.5, 0); g.add(elbow);

  for(let i = -1; i <= 1; i++){
    const vane = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.85, 0.85), accentMat());
    vane.position.set(0.6 + i * 0.28, 1.5, 0);
    vane.rotation.y = Math.PI / 4;
    g.add(vane);
  }

  const seg2 = new THREE.Mesh(new THREE.BoxGeometry(1, 3.2, 1), steelMat());
  seg2.position.set(1.2, -0.1, 0); g.add(seg2);

  const seg3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 3.2), steelMat());
  seg3.position.set(1.2, -1.7, 1.6); g.add(seg3);

  for(let y = 1.5; y >= -1.6; y -= 0.45){
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.06, 1.06), insulationMat());
    ridge.position.set(1.2, y, 0);
    g.add(ridge);
  }

  // bolted flange joints
  [[-1.5, 1.5, 0, "x"], [1.2, 1.5, 0, "x"], [1.2, -1.75, 1.6, "z"]].forEach(([x, y, z, axis]) => {
    const flange = new THREE.Mesh(
      new THREE.BoxGeometry(axis === "x" ? 0.08 : 1.08, 1.08, axis === "x" ? 1.08 : 0.08),
      darkMat()
    );
    flange.position.set(x, y, z);
    g.add(flange);
    for(let i = 0; i < 8; i++){
      const ang = (i / 8) * Math.PI * 2;
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 6), accentMat());
      if(axis === "x"){
        bolt.rotation.z = Math.PI / 2;
        bolt.position.set(x, y + Math.sin(ang) * 0.45, z + Math.cos(ang) * 0.45);
      } else {
        bolt.position.set(x + Math.sin(ang) * 0.45, y + Math.cos(ang) * 0.45, z);
      }
      g.add(bolt);
    }
  });

  // ceiling hanger rods + struts
  [-2.6, -0.6].forEach(x => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6), darkMat());
    rod.position.set(x, 2.1, 0);
    g.add(rod);
    const strut = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.05, 0.05), darkMat());
    strut.position.set(x, 1.98, 0);
    g.add(strut);
  });

  // damper blade visible behind the supply grille
  const damper = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.9), accentMat());
  damper.position.set(1.2, -1.7, 3.05);
  damper.rotation.x = Math.PI / 6;
  g.add(damper);

  const grille = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.06), darkMat());
  grille.position.set(1.2, -1.7, 3.2); g.add(grille);
  for(let i = -0.4; i <= 0.4; i += 0.16){
    const slat = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 0.02), accentMat());
    slat.position.set(1.2, -1.7 + i, 3.24);
    g.add(slat);
  }

  g.scale.setScalar(0.62);
  return g;
}

// Industrial fire-tube boiler with insulation lagging, saddle
// supports, a front burner assembly, feedwater pump, safety
// valve and a control panel.
function buildBoiler(){
  const g = new THREE.Group();

  const drum = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 3.6, 28), steelMat());
  drum.rotation.z = Math.PI / 2; g.add(drum);

  const capL = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), darkMat());
  capL.rotation.z = -Math.PI / 2; capL.position.x = -1.8; g.add(capL);
  const capR = capL.clone(); capR.rotation.z = Math.PI / 2; capR.position.x = 1.8; g.add(capR);

  for(let x = -1.4; x <= 1.4; x += 0.55){
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.63, 1.63, 0.12, 28), insulationMat());
    band.rotation.z = Math.PI / 2;
    band.position.x = x;
    g.add(band);
  }

  // saddle supports: a wrap-band, a leg and a concrete base each
  [-1.1, 1.1].forEach(x => {
    const strap = new THREE.Mesh(new THREE.TorusGeometry(1.67, 0.06, 8, 28), darkMat());
    strap.rotation.y = Math.PI / 2;
    strap.position.set(x, 0, 0);
    g.add(strap);

    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.3, 0.3), darkMat());
    leg.position.set(x, -2.1, 0);
    g.add(leg);

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.6), concreteMat());
    base.position.set(x, -2.8, 0);
    g.add(base);
  });

  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.2, 16), darkMat());
  stack.position.set(-0.6, 2.1, 0); g.add(stack);

  // burner assembly at the front face
  const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.6, 16), accentMat());
  burner.rotation.z = Math.PI / 2;
  burner.position.set(-2.15, 0, 0);
  g.add(burner);
  const burnerNozzle = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 16), darkMat());
  burnerNozzle.rotation.z = -Math.PI / 2;
  burnerNozzle.position.set(-2.5, 0, 0);
  g.add(burnerNozzle);

  // feedwater pump skid
  const pumpBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 14), steelMat());
  pumpBody.rotation.z = Math.PI / 2;
  pumpBody.position.set(0.3, -2.0, 1.0);
  g.add(pumpBody);
  const pumpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 14), darkMat());
  pumpMotor.rotation.z = Math.PI / 2;
  pumpMotor.position.set(0.8, -2.0, 1.0);
  g.add(pumpMotor);

  // pressure gauge, safety valve and manifold piping
  const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 16), accentMat());
  gauge.rotation.x = Math.PI / 2; gauge.position.set(1.2, 0.9, 1.55); g.add(gauge);

  const safetyValve = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 10), darkMat());
  safetyValve.position.set(1.0, 1.9, 0);
  g.add(safetyValve);

  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.4, 12), accentMat());
  pipe.rotation.z = Math.PI / 2; pipe.position.set(1.9, -0.6, 0); g.add(pipe);

  // control panel
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.2), darkMat());
  panel.position.set(-0.8, -1.1, 1.85);
  g.add(panel);

  g.scale.setScalar(0.7);
  return g;
}

// Fire pump station: main electric pump, diesel standby pump,
// jockey pump, discharge header with hydrant valves, gauges
// and a control/annunciator panel — all on a common baseplate.
function buildFirePump(){
  const g = new THREE.Group();

  const baseplate = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.15, 1.8), concreteMat());
  baseplate.position.y = -1.3; g.add(baseplate);

  // main electric pump set
  const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 20), fireMat());
  housing.rotation.z = Math.PI / 2; housing.position.set(-1.5, -0.55, -0.3); g.add(housing);
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.0, 20), steelMat());
  motor.rotation.z = Math.PI / 2; motor.position.set(-0.35, -0.55, -0.3); g.add(motor);
  const coupling = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 16), darkMat());
  coupling.rotation.z = Math.PI / 2; coupling.position.set(-0.92, -0.55, -0.3); g.add(coupling);

  // diesel standby pump set
  const dHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.0, 20), fireMat());
  dHousing.rotation.z = Math.PI / 2; dHousing.position.set(-1.5, -0.55, 0.65); g.add(dHousing);
  const dEngine = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 0.7), darkMat());
  dEngine.position.set(-0.15, -0.55, 0.65); g.add(dEngine);
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.2, 10), darkMat());
  exhaust.position.set(0.1, 0.35, 0.65); g.add(exhaust);

  // jockey pump
  const jockey = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 14), steelMat());
  jockey.rotation.z = Math.PI / 2; jockey.position.set(1.15, -0.85, 0.15); g.add(jockey);
  const jockeyMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.35, 14), darkMat());
  jockeyMotor.rotation.z = Math.PI / 2; jockeyMotor.position.set(1.5, -0.85, 0.15); g.add(jockeyMotor);

  // discharge header with hydrant outlet valves
  const header = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 3.6, 14), steelMat());
  header.position.set(-0.3, 0.55, 0); g.add(header);
  [-1.6, -0.3, 1.0].forEach(x => {
    const riser = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.75, 10), steelMat());
    riser.position.set(x, 0.15, 0); g.add(riser);
    const valve = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), fireMat());
    valve.position.set(x, 0.6, 0); g.add(valve);
    const handwheel = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 6, 16), darkMat());
    handwheel.position.set(x, 0.85, 0); g.add(handwheel);
  });

  // pressure gauges
  [-1.8, -1.1].forEach(x => {
    const gauge = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 14), accentMat());
    gauge.rotation.x = Math.PI / 2;
    gauge.position.set(x, 0.0, 0.35);
    g.add(gauge);
  });

  // control / annunciator panel
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.16), darkMat());
  panel.position.set(1.7, 0.0, -0.7); g.add(panel);
  const panelLight = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), fireMat());
  panelLight.position.set(1.7, 0.28, -0.62); g.add(panelLight);

  g.scale.setScalar(0.85);
  return g;
}

// Ground-mounted solar array: tilted panel field with visible
// cell lines, diagonal tilt bracing, concrete footings, an
// inverter on a post, a DC combiner box and cable conduit.
function buildSolar(){
  const g = new THREE.Group();
  const frame = new THREE.Group();

  for(let col = -1.5; col <= 1.5; col += 1.55){
    for(let row = -1; row <= 1; row += 1.05){
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.95), glassMat());
      panel.position.set(col, 0, row);
      frame.add(panel);

      const frameRail = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.03, 1.01), darkMat());
      frameRail.position.set(col, -0.02, row);
      frame.add(frameRail);

      for(let cx = -0.55; cx <= 0.55; cx += 0.28){
        const cellLine = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.07, 0.9),
          new THREE.MeshStandardMaterial({ color: 0x1c3a55, metalness: 0.1, roughness: 0.6 })
        );
        cellLine.position.set(col + cx, 0.02, row);
        frame.add(cellLine);
      }
    }
  }

  const grid = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(5.2, 0.08, 3.3)),
    new THREE.LineBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.5 })
  );
  frame.add(grid);
  frame.rotation.x = -0.35;
  frame.position.y = 0.6;
  g.add(frame);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.6, 10);
  [[-2, -1.2], [2, -1.2], [-2, 1.2], [2, 1.2]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(legGeo, darkMat());
    leg.position.set(x, -0.6, z);
    leg.rotation.x = 0.15;
    g.add(leg);

    const footing = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.35), concreteMat());
    footing.position.set(x, -1.45, z);
    g.add(footing);
  });

  // diagonal tilt braces from the rear legs up to the frame
  [[-2, 1.2], [2, 1.2]].forEach(([x, z]) => {
    const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.9, 8), accentMat());
    brace.position.set(x, 0.05, z - 0.55);
    brace.rotation.x = 0.55;
    g.add(brace);
  });

  // inverter on a mounting post
  const invPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.1, 8), darkMat());
  invPost.position.set(2.6, -0.8, 1.6); g.add(invPost);
  const inverter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.2), darkMat());
  inverter.position.set(2.6, -0.15, 1.6); g.add(inverter);
  const inverterFace = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.3, 0.02), accentMat());
  inverterFace.position.set(2.6, -0.05, 1.71); g.add(inverterFace);

  // DC combiner box under the array
  const combiner = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.15), steelMat());
  combiner.position.set(-1.8, -0.15, 1.2); g.add(combiner);

  // cable conduit running to the inverter
  const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.0, 8), darkMat());
  conduit.rotation.z = Math.PI / 2;
  conduit.position.set(0.4, -0.85, 1.6); g.add(conduit);

  g.scale.setScalar(0.85);
  return g;
}