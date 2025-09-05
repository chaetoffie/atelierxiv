import * as THREE from 'three';

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 100;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create starfield
const particleCount = 8000; // more stars
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const x = (Math.random() - 0.5) * 800; // spread wider
  const y = (Math.random() - 0.5) * 800;
  const z = (Math.random() - 0.5) * 800;
  positions.set([x, y, z], i * 3);
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

// Star material
const material = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.3,              // much smaller
  sizeAttenuation: true,  // makes them shrink with distance
  transparent: true,
  opacity: 0.9,
  alphaTest: 0.01         // helps keep them circular
});

const stars = new THREE.Points(geometry, material);
scene.add(stars);

// Animate
function animate() {
  requestAnimationFrame(animate);

  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0003;

  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
