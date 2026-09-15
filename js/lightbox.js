/* ============================================================
   SJ ENGINEERING — Gallery lightbox
   The photo grid itself is plain static HTML in gallery.html now
   (no JS builds it). This file only powers the click-to-enlarge
   overlay: it reads the already-rendered <a> tags in #gallery-grid.
   ============================================================ */

let links = [];
let current = 0;

function visibleLinks(){
  return links.filter(a => a.style.display !== "none");
}

function openLightbox(a){
  current = links.indexOf(a);
  const img = document.getElementById("lightbox-img");
  // Read the already-bundled <img> src (Parcel resolves this correctly),
  // not a.href — Parcel rewrites <a href="…jpeg"> into an internal
  // dependency placeholder rather than a usable URL, so reading it
  // directly here would show a broken image after a production build.
  const thumb = a.querySelector("img");
  img.src = thumb ? thumb.currentSrc || thumb.src : a.dataset.full;
  img.alt = thumb?.alt || "";
  document.getElementById("lightbox").classList.add("open");
}
function closeLightbox(){
  document.getElementById("lightbox").classList.remove("open");
}
function step(dir){
  const order = visibleLinks();
  if(order.length === 0) return;
  const pos = order.indexOf(links[current]);
  const next = order[(pos + dir + order.length) % order.length];
  openLightbox(next);
}

function init(){
  links = [...document.querySelectorAll("#gallery-grid a")];
  links.forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    openLightbox(a);
  }));

  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => step(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => step(1));
  document.getElementById("lightbox").addEventListener("click", e => {
    if(e.target.id === "lightbox") closeLightbox();
  });
  window.addEventListener("keydown", e => {
    if(!document.getElementById("lightbox").classList.contains("open")) return;
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowLeft") step(-1);
    if(e.key === "ArrowRight") step(1);
  });
}

init();