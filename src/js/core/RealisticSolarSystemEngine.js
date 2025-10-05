import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

import { REALISTIC_SOLAR_SYSTEM_DATA, REALISTIC_SCALE_FACTORS, calculateOptimalScale } from '../data/realisticSolarSystemData.js';
import { Planet } from '../objects/Planet.js';
import { Sun } from '../objects/Sun.js';
import { AsteroidBelt } from '../objects/AsteroidBelt.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class RealisticSolarSystemEngine extends EventEmitter {
  constructor(container) {
    super();
    
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.composer = null;
    this.outlinePass = null;
    
    // Objects
    this.sun = null;
    this.planets = new Map();
    this.asteroidBelts = new Map();
    
    // State
    this.isRunning = false;
    this.currentScale = 'educational'; // realistic, semiRealistic, educational
    this.scaleFactors = calculateOptimalScale(this.currentScale);
    this.selectedObject = null;
    this.animationSpeed = {
      orbit: 1,
      rotation: 1
    };
    
    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Visual settings
    this.showOrbits = true;
    this.showLabels = true;
    
    this.init();
  }

  async init() {
    try {
      this.emit('loading:start');
      
      // Setup basic 3D environment
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupControls();
      this.setupPostProcessing();
      this.setupLighting();
      await this.setupBackground();
      
      // Create solar system objects with realistic scales
      await this.createRealisticSolarSystem();
      
      // Start animation loop
      this.start();
      
      this.emit('loading:complete');
      
    } catch (error) {
      this.emit('loading:error', error);
      console.error('Failed to initialize Realistic Solar System Engine:', error);
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    
    // Set fog based on scale for depth perception
    const fogDistance = this.currentScale === 'realistic' ? 50000 : 10000;
    this.scene.fog = new THREE.Fog(0x000011, fogDistance * 0.1, fogDistance);
  }

  setupCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, this.scaleFactors.cameraLimits.far);
    
    // Position initiale adaptée à l'échelle
    const initialDistance = this.currentScale === 'realistic' ? 1000 : 500;
    this.camera.position.set(-initialDistance, initialDistance * 0.5, initialDistance * 0.8);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: this.currentScale === 'realistic' // Better depth precision for realistic scales
    });
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Enhanced rendering for space
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    this.container.appendChild(this.renderer.domElement);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    
    // Adapt controls to scale
    this.controls.minDistance = this.scaleFactors.cameraLimits.minDistance;
    this.controls.maxDistance = this.scaleFactors.cameraLimits.maxDistance;
    this.controls.maxPolarAngle = Math.PI;
    
    // Faster movement for realistic scales
    this.controls.rotateSpeed = this.currentScale === 'realistic' ? 0.3 : 1.0;
    this.controls.zoomSpeed = this.currentScale === 'realistic' ? 2.0 : 1.2;
    this.controls.panSpeed = this.currentScale === 'realistic' ? 3.0 : 0.8;
  }

  setupPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    
    // Render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Outline pass pour la sélection
    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
      this.scene,
      this.camera
    );
    this.outlinePass.edgeStrength = 3;
    this.outlinePass.edgeGlow = 1;
    this.outlinePass.visibleEdgeColor.set(0x00ffff);
    this.outlinePass.hiddenEdgeColor.set(0x190a05);
    this.composer.addPass(this.outlinePass);
    
    // Bloom pass pour le soleil et les effets lumineux
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    this.composer.addPass(bloomPass);
  }

  setupLighting() {
    // Lumière ambiante d'origine pour le système réaliste
    const ambientLight = new THREE.AmbientLight(0x111122, 0.05);
    this.scene.add(ambientLight);
    
    // La lumière principale viendra de la PointLight du soleil avec ombres
    console.log('💡 Éclairage réaliste d\'origine restauré');
  }

  async setupBackground() {
    // Créer un fond étoilé procédural pour de meilleures performances
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      // Position aléatoire sur une sphère
      const radius = 8000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Couleur d'étoile réaliste
      const temp = Math.random();
      if (temp < 0.3) {
        // Étoiles bleues
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1.0;
      } else if (temp < 0.7) {
        // Étoiles blanches/jaunes
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
      } else {
        // Étoiles rouges
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.3 + Math.random() * 0.4;
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.3;
      }
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starsMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });
    
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    this.scene.add(stars);
  }

  async createRealisticSolarSystem() {
    // Créer le soleil
    this.emit('loading:progress', { progress: 10, text: 'CRÉATION DU SOLEIL...' });
    this.sun = new Sun(REALISTIC_SOLAR_SYSTEM_DATA.sun, this.scaleFactors);
    await this.sun.init();
    this.scene.add(this.sun.group);
    
    // Créer les planètes avec échelles réalistes
    const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    
    for (let i = 0; i < planetNames.length; i++) {
      const planetName = planetNames[i];
      const progress = 20 + (i / planetNames.length) * 60;
      
      this.emit('loading:progress', { 
        progress, 
        text: `CRÉATION DE ${REALISTIC_SOLAR_SYSTEM_DATA[planetName].name.toUpperCase()}...` 
      });
      
      const planet = new Planet(REALISTIC_SOLAR_SYSTEM_DATA[planetName], this.scaleFactors);
      await planet.init();
      
      // Configurer la visibilité des orbites
      planet.setOrbitVisibility(this.showOrbits);
      
      this.planets.set(planetName, planet);
      this.scene.add(planet.group);
    }
    
    // Créer les ceintures d'astéroïdes
    this.emit('loading:progress', { progress: 85, text: 'CRÉATION DES CEINTURES D\'ASTÉROÏDES...' });
    
    const mainBelt = new AsteroidBelt('main', this.scaleFactors);
    await mainBelt.init();
    this.asteroidBelts.set('main', mainBelt);
    this.scene.add(mainBelt.group);
    
    const kuiperBelt = new AsteroidBelt('kuiper', this.scaleFactors);
    await kuiperBelt.init();
    this.asteroidBelts.set('kuiper', kuiperBelt);
    this.scene.add(kuiperBelt.group);
    
    this.emit('loading:progress', { progress: 100, text: 'FINALISATION...' });
  }

  // Scale Management
  setScale(scaleType) {
    if (this.currentScale === scaleType) return;
    
    this.currentScale = scaleType;
    this.scaleFactors = calculateOptimalScale(scaleType);
    
    this.emit('scale:changing', scaleType);
    
    // Update camera limits
    this.controls.minDistance = this.scaleFactors.cameraLimits.minDistance;
    this.controls.maxDistance = this.scaleFactors.cameraLimits.maxDistance;
    this.camera.far = this.scaleFactors.cameraLimits.far;
    this.camera.updateProjectionMatrix();
    
    // Update fog
    const fogDistance = scaleType === 'realistic' ? 50000 : 10000;
    this.scene.fog.near = fogDistance * 0.1;
    this.scene.fog.far = fogDistance;
    
    // Recreate solar system with new scale
    this.recreateSolarSystem();
    
    this.emit('scale:changed', scaleType);
  }

  async recreateSolarSystem() {
    // Clear existing objects
    this.clearSolarSystem();
    
    // Recreate with new scale
    await this.createRealisticSolarSystem();
    
    // Reset camera position
    this.resetView();
  }

  clearSolarSystem() {
    // Remove sun
    if (this.sun) {
      this.scene.remove(this.sun.group);
      this.sun.dispose();
      this.sun = null;
    }
    
    // Remove planets
    this.planets.forEach(planet => {
      this.scene.remove(planet.group);
      planet.dispose();
    });
    this.planets.clear();
    
    // Remove asteroid belts
    this.asteroidBelts.forEach(belt => {
      this.scene.remove(belt.group);
      belt.dispose();
    });
    this.asteroidBelts.clear();
  }

  // Animation and Updates
  animate() {
    if (!this.isRunning) return;
    
    const deltaTime = 0.016; // Assume 60fps
    
    // Update sun
    if (this.sun) {
      this.sun.update(deltaTime, this.animationSpeed);
    }
    
    // Update planets
    this.planets.forEach(planet => {
      planet.update(deltaTime, this.animationSpeed);
    });
    
    // Update asteroid belts
    this.asteroidBelts.forEach(belt => {
      belt.update(deltaTime, this.animationSpeed);
    });
  }

  render() {
    this.controls.update();
    this.composer.render();
  }

  start() {
    this.isRunning = true;
    this.renderLoop();
  }

  stop() {
    this.isRunning = false;
  }

  renderLoop() {
    if (this.isRunning) {
      this.animate();
      this.render();
      requestAnimationFrame(() => this.renderLoop());
    }
  }

  // Control Methods
  toggleAnimation() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.renderLoop();
    }
    this.emit('animation:toggled', this.isRunning);
  }

  setAnimationSpeed(type, speed) {
    this.animationSpeed[type] = speed;
    this.emit('speed:changed', { type, speed });
  }

  resetView() {
    const distance = this.currentScale === 'realistic' ? 1000 : 500;
    this.camera.position.set(-distance, distance * 0.5, distance * 0.8);
    this.controls.target.set(0, 0, 0);
    this.deselectObject();
  }

  // Visibility Controls
  setOrbitVisibility(visible) {
    this.showOrbits = visible;
    this.planets.forEach(planet => {
      planet.setOrbitVisibility(visible);
    });
    this.emit('orbits:visibility-changed', visible);
  }

  setLabelsVisibility(visible) {
    this.showLabels = visible;
    this.emit('labels:visibility-changed', visible);
  }

  // Selection Methods
  selectObject(objectData) {
    this.selectedObject = objectData;
    this.emit('object:selected', objectData);
  }

  deselectObject() {
    this.selectedObject = null;
    this.outlinePass.selectedObjects = [];
    this.emit('object:deselected');
  }

  // Search Methods
  searchObjects(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    // Search sun
    if (this.sun && this.sun.data.name.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'sun',
        name: 'sun',
        displayName: this.sun.data.name,
        data: this.sun.data
      });
    }
    
    // Search planets
    this.planets.forEach((planet, name) => {
      if (planet.data.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'planet',
          name: name,
          displayName: planet.data.name,
          data: planet.data
        });
      }
      
      // Search moons
      if (planet.data.moons || planet.data.majorMoons) {
        const moons = planet.data.moons || planet.data.majorMoons;
        moons.forEach(moon => {
          if (moon.name.toLowerCase().includes(lowerQuery)) {
            results.push({
              type: 'moon',
              name: moon.name,
              displayName: moon.name,
              data: moon,
              parent: planet.data.name
            });
          }
        });
      }
    });
    
    return results;
  }

  // Event Handlers
  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  // Cleanup
  dispose() {
    this.stop();
    this.clearSolarSystem();
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.composer) {
      this.composer.dispose();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.onWindowResize);
  }

  // Getters for external access
  getPlanetData(planetName) {
    const planet = this.planets.get(planetName);
    return planet ? planet.data : null;
  }

  getAllPlanets() {
    return Array.from(this.planets.keys());
  }

  getCurrentScale() {
    return this.currentScale;
  }

  getScaleInfo() {
    return {
      current: this.currentScale,
      factors: this.scaleFactors,
      available: Object.keys(REALISTIC_SCALE_FACTORS)
    };
  }
}
