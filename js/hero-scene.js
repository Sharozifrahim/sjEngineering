/* ============================================================
   SJ ENGINEERING — Hero 3D background
   A slow-moving field of steel-grey dust with a few rotating
   wireframe industrial forms (truss node, ring, plate) tinted
   in the brand's safety-orange accent.
   ============================================================ */
import * as THREE from "three";

export function initHeroScene(canvasId){
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  camera.position.set(0, 0, 34);

  function size(){
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  size();
  window.addEventListener("resize", size);

  // ---- lighting (subtle, mostly used for the metal plate) ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
  const key = new THREE.DirectionalLight(0xffb073, 1.1);
  key.position.set(8, 10, 12);
  scene.add(key);

  // ---- dust / weld-spark particle field ----
  const COUNT = 260;
  const positions = new Float32Array(COUNT * 3);
  const velocities = [];
  for(let i=0;i<COUNT;i++){
    positions[i*3]   = (Math.random()-0.5) * 70;
    positions[i*3+1] = (Math.random()-0.5) * 44;
    positions[i*3+2] = (Math.random()-0.5) * 30;
    velocities.push({
      x: (Math.random()-0.5) * 0.012,
      y: (Math.random()-0.5) * 0.012,
      z: (Math.random()-0.5) * 0.006
    });
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.16, color: 0xe0762c, transparent:true, opacity:0.55,
    blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ---- rotating wireframe industrial forms ----
  const shapes = [];
  const shapeDefs = [
    { geo: new THREE.IcosahedronGeometry(3.2, 0), color: 0xe0762c, x: 10, y: 6,  z: -10 },
    { geo: new THREE.TorusGeometry(2.4, 0.35, 8, 24), color: 0xf5a24a, x: -12, y: -5, z: -6 },
    { geo: new THREE.OctahedronGeometry(2.6, 0), color: 0x9a9fa8, x: 6, y: -9, z: -16 },
    { geo: new THREE.TetrahedronGeometry(2.2, 0), color: 0xe0762c, x: -8, y: 9, z: -14 },
    { geo: new THREE.BoxGeometry(3, 3, 3), color: 0x9a9fa8, x: 14, y: -2, z: -20 }
  ];
  shapeDefs.forEach(def=>{
    const mat = new THREE.MeshBasicMaterial({ color: def.color, wireframe:true, transparent:true, opacity:0.22 });
    const mesh = new THREE.Mesh(def.geo, mat);
    mesh.position.set(def.x, def.y, def.z);
    mesh.userData = {
      rx: (Math.random()-0.5) * 0.004,
      ry: (Math.random()-0.5) * 0.004,
      floatSpeed: Math.random()*0.3 + 0.15,
      floatOffset: Math.random()*Math.PI*2,
      baseY: def.y
    };
    scene.add(mesh);
    shapes.push(mesh);
  });

  // ---- a single "hero" solid form: a faceted steel plate/gear hub ----
  const hubGeo = new THREE.CylinderGeometry(4.2, 4.2, 1.1, 8, 1);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x2a2d33, metalness: 0.7, roughness: 0.35, flatShading:true });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.rotation.x = Math.PI/2.6;
  hub.position.set(9, -1, -4);
  scene.add(hub);

  const ringGeo = new THREE.TorusGeometry(5.4, 0.14, 8, 8);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xe0762c });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.copy(hub.rotation);
  ring.position.copy(hub.position);
  scene.add(ring);

  let raf;
  function animate(){
    raf = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    particles.rotation.y += 0.0004;
    const pos = pGeo.attributes.position.array;
    for(let i=0;i<COUNT;i++){
      pos[i*3]   += velocities[i].x;
      pos[i*3+1] += velocities[i].y;
      pos[i*3+2] += velocities[i].z;
      if(Math.abs(pos[i*3]) > 35) velocities[i].x *= -1;
      if(Math.abs(pos[i*3+1]) > 22) velocities[i].y *= -1;
      if(Math.abs(pos[i*3+2]) > 15) velocities[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;

    shapes.forEach(s=>{
      s.rotation.x += s.userData.rx;
      s.rotation.y += s.userData.ry;
      s.position.y = s.userData.baseY + Math.sin(t*s.userData.floatSpeed + s.userData.floatOffset) * 1.2;
    });

    hub.rotation.z += 0.0018;
    ring.rotation.z += 0.0018;

    renderer.render(scene, camera);
  }
  animate();

  // pause when off-screen to save battery
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ if(!raf) animate(); }
      else{ cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0 });
  io.observe(canvas);
}
