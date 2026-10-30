// 3D hero: a floating laptop writing code, with my tech stack orbiting around it.
// Falls back to the original illustration if WebGL isn't available.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const host = document.getElementById('hero3d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

if (host && webglOK()) start();

function start() {
  const canvas = host.querySelector('canvas');
  const small = window.matchMedia('(max-width: 991px)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 1.2, 9); camera.lookAt(0, 0.45, 0);

  // Lights
  scene.add(new THREE.HemisphereLight(0xcff6ff, 0x0f2b4a, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 6, 5); scene.add(key);
  const tealLight = new THREE.PointLight(0x00a8b5, 30, 12); tealLight.position.set(-3, 1, 3); scene.add(tealLight);

  const world = new THREE.Group(); scene.add(world);
  const laptop = new THREE.Group(); world.add(laptop);

  // Laptop body
  const shell = new THREE.MeshStandardMaterial({ color: 0xc9d6e2, metalness: 0.65, roughness: 0.32 });
  const base = new THREE.Mesh(new RoundedBoxGeometry(4.2, 0.18, 2.8, 4, 0.08), shell);
  laptop.add(base);
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(3.7, 1.55), new THREE.MeshStandardMaterial({ color: 0x1a2b3c, roughness: 0.8 }));
  deck.rotation.x = -Math.PI / 2; deck.position.set(0, 0.092, -0.32); laptop.add(deck);
  // keyboard keys
  const keyGeo = new THREE.BoxGeometry(0.2, 0.03, 0.2), keyMat = new THREE.MeshStandardMaterial({ color: 0x2d4257, roughness: 0.6 });
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, 13 * 5); const m4 = new THREE.Matrix4(); let k = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 13; c++) { m4.makeTranslation(-1.62 + c * 0.27, 0.11, -0.95 + r * 0.27); keys.setMatrixAt(k++, m4); }
  laptop.add(keys);
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7), new THREE.MeshStandardMaterial({ color: 0xaab9c7, metalness: 0.4, roughness: 0.4 }));
  pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.092, 0.9); laptop.add(pad);

  // Lid (hinged at the back edge)
  const hinge = new THREE.Group(); hinge.position.set(0, 0.09, -1.4); laptop.add(hinge);
  const lid = new THREE.Mesh(new RoundedBoxGeometry(4.2, 2.75, 0.12, 4, 0.06), shell);
  lid.position.set(0, 1.375, 0); hinge.add(lid);

  // Screen: a code editor drawn on a canvas
  const sc = document.createElement('canvas'); sc.width = 1024; sc.height = 640;
  const g = sc.getContext('2d');
  const screenTex = new THREE.CanvasTexture(sc); screenTex.colorSpace = THREE.SRGBColorSpace; screenTex.anisotropy = 4;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.9, 2.44), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  screen.position.set(0, 1.375, 0.065); hinge.add(screen);

  const CODE = [
    [['#c678dd', '@RestController']],
    [['#c678dd', 'public class '], ['#e5c07b', 'BookingController'], ['#abb2bf', ' {']],
    [],
    [['#abb2bf', '  '], ['#c678dd', '@PostMapping'], ['#abb2bf', '('], ['#98c379', '"/bookings"'], ['#abb2bf', ')']],
    [['#abb2bf', '  '], ['#c678dd', 'public '], ['#e5c07b', 'Booking'], ['#61afef', ' create'], ['#abb2bf', '(@RequestBody '], ['#e5c07b', 'Booking'], ['#abb2bf', ' b) {']],
    [['#abb2bf', '    b.'], ['#61afef', 'setDeposit'], ['#abb2bf', '(b.'], ['#61afef', 'total'], ['#abb2bf', '() * '], ['#d19a66', '0.5'], ['#abb2bf', ');']],
    [['#abb2bf', '    '], ['#c678dd', 'return '], ['#abb2bf', 'repo.'], ['#61afef', 'save'], ['#abb2bf', '(b);']],
    [['#abb2bf', '  }']],
    [['#abb2bf', '}']],
    [],
    [['#5c6370', '// Spring Boot · SQL · React · AWS']],
  ];
  const total = CODE.reduce((n, l) => n + l.reduce((m, s) => m + s[1].length, 0) + 1, 0);
  function drawScreen(chars) {
    g.fillStyle = '#0d1b2a'; g.fillRect(0, 0, 1024, 640);
    g.fillStyle = '#132a40'; g.fillRect(0, 0, 1024, 52);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(30 + i * 28, 26, 9, 0, 7); g.fill(); });
    g.fillStyle = '#7fd8e0'; g.font = '600 22px monospace'; g.fillText('BookingController.java', 130, 34);
    g.fillStyle = '#0a1622'; g.fillRect(0, 52, 70, 588);
    g.font = '500 30px monospace'; let left = chars, y = 104, cursor = null;
    CODE.forEach((line, i) => {
      g.fillStyle = '#3d5368'; g.fillText(String(i + 1).padStart(2, ' '), 14, y);
      let x = 92;
      for (const [col, txt] of line) {
        if (left <= 0) break;
        const part = txt.slice(0, left); left -= part.length;
        g.fillStyle = col; g.fillText(part, x, y); x += g.measureText(part).width;
      }
      if (left > 0) { left -= 1; cursor = [x, y]; } else if (!cursor) cursor = [x, y];
      y += 48;
    });
    if (cursor && Math.floor(performance.now() / 450) % 2 === 0) { g.fillStyle = '#00d4e0'; g.fillRect(cursor[0] + 2, cursor[1] - 26, 14, 32); }
    screenTex.needsUpdate = true;
  }

  // Orbiting tech chips
  function chip(label, color) {
    const c = document.createElement('canvas'), cg = c.getContext('2d');
    cg.font = '800 56px "Nunito Sans", sans-serif';
    const w = Math.ceil(cg.measureText(label).width) + 110; c.width = w; c.height = 112;
    cg.font = '800 56px "Nunito Sans", sans-serif';
    cg.fillStyle = 'rgba(255,255,255,0.96)'; cg.beginPath(); cg.roundRect(4, 4, w - 8, 104, 52); cg.fill();
    cg.fillStyle = color; cg.beginPath(); cg.arc(56, 56, 16, 0, 7); cg.fill();
    cg.fillStyle = '#0F2B4A'; cg.textBaseline = 'middle'; cg.fillText(label, 86, 60);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    const h = 0.36; s.scale.set(h * w / 112, h, 1); return s;
  }
  const STACK = [['Java', '#E76F00'], ['Spring Boot', '#6DB33F'], ['React', '#61DAFB'], ['SQL', '#00A8B5'], ['AWS', '#FF9900'], ['Python', '#3776AB'], ['REST APIs', '#7C5CFF'], ['Docker', '#2496ED']];
  const chips = STACK.map(([l, c], i) => { const s = chip(l, c); s.userData = { a: (i / STACK.length) * Math.PI * 2, y: (i % 2 ? 0.45 : -0.25) + (i % 3) * 0.3 }; world.add(s); return s; });

  // Orbit ring and particles
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.012, 8, 160), new THREE.MeshBasicMaterial({ color: 0x00d4e0, transparent: true, opacity: 0.55 }));
  ring.rotation.x = 1.25; ring.position.y = -0.35; world.add(ring);
  const N = small ? 220 : 520, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const r = 4 + Math.random() * 5, a = Math.random() * 6.283, y = (Math.random() - 0.5) * 7; pos.set([Math.cos(a) * r, y, Math.sin(a) * r - 2], i * 3); }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dots = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x7fe9f0, size: 0.045, transparent: true, opacity: 0.8 }));
  scene.add(dots);

  // Shadow-like glow under the laptop
  const glowC = document.createElement('canvas'); glowC.width = glowC.height = 128;
  const gg = glowC.getContext('2d'), grad = gg.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,212,224,0.55)'); grad.addColorStop(1, 'rgba(0,212,224,0)'); gg.fillStyle = grad; gg.fillRect(0, 0, 128, 128);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(7, 4.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(glowC), transparent: true, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = -1.05; world.add(glow);

  laptop.position.y = -0.7; laptop.rotation.y = -0.35;
  world.rotation.x = 0.08;

  // Interaction
  const target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
  window.addEventListener('pointermove', e => { target.x = (e.clientX / innerWidth - 0.5) * 2; target.y = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });

  function resize() {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.position.z = w / h < 1.4 ? 11 : 9; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(host); resize();

  let visible = true, t0 = performance.now();
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !reduceMotion) loop(); }).observe(host);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !reduceMotion) loop(); });

  let running = false;
  function frame(now) {
    const t = (now - t0) / 1000;
    // lid opens on load, code types itself, then loops
    hinge.rotation.x = -0.12 + (1 - Math.min(1, t / 1.6)) ** 3 * 1.62;
    const cycle = total + 60, chars = reduceMotion ? total : Math.floor((t * 22) % cycle);
    drawScreen(chars);
    cur.x += (target.x - cur.x) * 0.06; cur.y += (target.y - cur.y) * 0.06;
    const scroll = Math.min(1, scrollY / 600);
    world.rotation.y = cur.x * 0.35 + Math.sin(t * 0.3) * 0.08;
    world.rotation.x = 0.08 + cur.y * 0.12 + scroll * 0.25;
    laptop.position.y = -0.7 + Math.sin(t * 1.2) * 0.08;
    chips.forEach(s => { const a = s.userData.a + t * 0.35; s.position.set(Math.cos(a) * 2.75, s.userData.y + Math.sin(t * 1.5 + s.userData.a) * 0.12 - 0.2, Math.sin(a) * 2.1); s.material.opacity = 0.55 + 0.45 * (Math.sin(a) + 1) / 2; });
    ring.rotation.z = t * 0.1;
    dots.rotation.y = t * 0.02;
    renderer.render(scene, camera);
  }
  function loop() {
    if (running) return; running = true;
    const tick = now => { if (!visible || document.hidden) { running = false; return; } frame(now); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  window.__hero3dFrame = frame; // lets screenshots render a set moment
  host.classList.add('is-3d');
  if (reduceMotion) frame(t0 + 3000); else loop();
}
