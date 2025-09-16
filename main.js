import * as THREE from 'three';
import { particlesCursor } from "https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js";

let scene, camera, renderer, stars;

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);
  scene.add(camera);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("starfield").appendChild(renderer.domElement);

  // ===== Starfield =====
  const particleCount = 9000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 800;
    const z = (Math.random() - 0.5) * 800;
    positions.set([x, y, z], i * 3);
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.3,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
  });

  stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // ===== Cursor particles (overlay canvas) =====
  particlesCursor({
    el: document.getElementById("cursor-canvas"),
    gpgpuSize: 512,
    colors: [0xffffff, 0xff0000],
    coordScale: 0.5,
    noiseIntensity: 0.005,
    noiseTimeCoef: 0.0001,
    pointSize: 2,
    pointDecay: 0.002,
    sleepRadiusX: 250,
    sleepRadiusY: 250,
    sleepTimeCoefX: 0.002,
    sleepTimeCoefY: 0.002,
  });

  // Resize handler
  window.addEventListener('resize', onResize, false);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0003;

  renderer.render(scene, camera);
}
