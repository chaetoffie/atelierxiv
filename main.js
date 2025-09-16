import * as THREE from 'three';

let scene, camera, renderer, stars, mouseMesh;
let mouse = { x: 0, y: 0 };

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Camera
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  camera = new THREE.PerspectiveCamera(
    75,
    screenWidth / screenHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 100);
  scene.add(camera);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(screenWidth, screenHeight);
  document.body.appendChild(renderer.domElement);

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
    alphaTest: 0.01,
  });

  stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // ===== Mouse Follower Sphere =====
  const mouseGeometry = new THREE.SphereGeometry(1, 16, 16);
  const mouseMaterial = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity: 0.8,
  });
  mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
  scene.add(mouseMesh);

  // Lights
  const light = new THREE.PointLight(0xffffff);
  light.position.set(20, 0, 20);
  scene.add(light);
  const lightAmb = new THREE.AmbientLight(0x777777);
  scene.add(lightAmb);

  // Mouse listener
  document.addEventListener('mousemove', onMouseMove, false);

  // Handle resize
  window.addEventListener('resize', onResize, false);
}

function onMouseMove(event) {
  event.preventDefault();

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));
  mouseMesh.position.copy(pos);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  // Rotate stars slowly
  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0003;

  render();
}

function render() {
  renderer.autoClear = true;
  renderer.clear();
  renderer.render(scene, camera);
}
