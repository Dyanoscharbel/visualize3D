import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';

import { SOLAR_SYSTEM_DATA, SCALE_FACTORS } from '../data/solarSystemData.js';
import { Planet } from '../objects/Planet.js';
import { Sun } from '../objects/Sun.js';
import { AsteroidBelt } from '../objects/AsteroidBelt.js';
import { LoadingManager } from '../utils/LoadingManager.js';
import { EventEmitter } from '../utils/EventEmitter.js';

export class SolarSystemEngine extends EventEmitter {
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
    this.currentScale = 'visual';
    this.selectedObject = null;
    this.animationSpeed = {
      orbit: 1,
      rotation: 1
    };
    
    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Loading
    this.loadingManager = new LoadingManager();
    
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
      this.setupBackground();
      
      // Create solar system objects
      await this.createSolarSystem();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Start animation loop
      this.start();
      
      this.emit('loading:complete');
      
    } catch (error) {
      this.emit('loading:error', error);
      console.error('Failed to initialize Solar System Engine:', error);
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 1000, 10000);
  }

  setupCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 50000);
    
    // Position initiale pour vue d'ensemble
    this.camera.position.set(-300, 200, 300);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.container.appendChild(this.renderer.domElement);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 10000;
    this.controls.maxPolarAngle = Math.PI;
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
    this.outlinePass.visibleEdgeColor.set(0x6366f1);
    this.outlinePass.hiddenEdgeColor.set(0x190a05);
    this.composer.addPass(this.outlinePass);
    
    // Bloom pass pour le soleil
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
      1.5, // strength
      0.4, // radius
      0.85 // threshold
    );
    this.composer.addPass(bloomPass);
  }

  setupLighting() {
    // Lumière ambiante d'origine pour visibilité optimale
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    this.scene.add(ambientLight);
    
    // La lumière principale viendra de la PointLight du soleil avec ombres
    console.log('💡 Lumière ambiante d\'origine restaurée');
  }

  async setupBackground() {
    const loader = new THREE.CubeTextureLoader();
    
    // Chargement du skybox étoilé
    const urls = [
      '/images/1.jpg', // positive x
      '/images/2.jpg', // negative x
      '/images/3.jpg', // positive y
      '/images/4.jpg', // negative y
      '/images/1.jpg', // positive z
      '/images/2.jpg'  // negative z
    ];
    
    try {
      const texture = await loader.loadAsync(urls);
      this.scene.background = texture;
    } catch (error) {
      console.warn('Failed to load background texture:', error);
      // Fallback: gradient background
      this.scene.background = new THREE.Color(0x000011);
    }
  }

  async createSolarSystem() {
    const scaleFactors = SCALE_FACTORS[this.currentScale];
    
    // Créer le soleil
    this.emit('loading:progress', { progress: 10, text: 'Création du Soleil...' });
    this.sun = new Sun(SOLAR_SYSTEM_DATA.sun, scaleFactors);
    await this.sun.init();
    this.scene.add(this.sun.group);
    
    // Créer les planètes
    const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
    
    for (let i = 0; i < planetNames.length; i++) {
      const planetName = planetNames[i];
      const progress = 20 + (i / planetNames.length) * 60;
      
      this.emit('loading:progress', { 
        progress, 
        text: `Création de ${SOLAR_SYSTEM_DATA[planetName].name}...` 
      });
      
      const planet = new Planet(SOLAR_SYSTEM_DATA[planetName], scaleFactors);
      await planet.init();
      
      this.planets.set(planetName, planet);
      this.scene.add(planet.group);
    }
    
    // Créer les ceintures d'astéroïdes
    this.emit('loading:progress', { progress: 85, text: 'Création des astéroïdes...' });
    
    const mainBelt = new AsteroidBelt('main', scaleFactors);
    await mainBelt.init();
    this.asteroidBelts.set('main', mainBelt);
    this.scene.add(mainBelt.group);
    
    const kuiperBelt = new AsteroidBelt('kuiper', scaleFactors);
    await kuiperBelt.init();
    this.asteroidBelts.set('kuiper', kuiperBelt);
    this.scene.add(kuiperBelt.group);
    
    this.emit('loading:progress', { progress: 100, text: 'Finalisation...' });
  }

  setupEventListeners() {
    // Mouse events
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
    
    // Window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    // Keyboard shortcuts
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.updateHover();
  }

  onMouseClick(event) {
    this.updateSelection();
  }

  updateHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Collect all selectable objects
    const selectableObjects = [];
    
    // Add sun
    if (this.sun && this.sun.mesh) {
      selectableObjects.push(this.sun.mesh);
    }
    
    // Add planets
    this.planets.forEach(planet => {
      if (planet.mesh) {
        selectableObjects.push(planet.mesh);
      }
    });
    
    const intersects = this.raycaster.intersectObjects(selectableObjects);
    
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      this.outlinePass.selectedObjects = [intersectedObject];
      this.container.style.cursor = 'pointer';
    } else {
      this.outlinePass.selectedObjects = [];
      this.container.style.cursor = 'default';
    }
  }

  updateSelection() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Collect all selectable objects with their data
    const selectableObjects = [];
    
    // Add sun
    if (this.sun && this.sun.mesh) {
      selectableObjects.push({ object: this.sun.mesh, data: this.sun.data, type: 'sun' });
    }
    
    // Add planets
    this.planets.forEach((planet, name) => {
      if (planet.mesh) {
        selectableObjects.push({ object: planet.mesh, data: planet.data, type: 'planet', name });
      }
    });
    
    const intersects = this.raycaster.intersectObjects(selectableObjects.map(item => item.object));
    
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const objectData = selectableObjects.find(item => item.object === intersectedObject);
      
      if (objectData) {
        this.selectObject(objectData);
      }
    }
  }

  selectObject(objectData) {
    this.selectedObject = objectData;
    this.emit('object:selected', objectData);
    
    // Smooth camera movement to object
    this.focusOnObject(objectData.object);
  }

  focusOnObject(object) {
    const objectPosition = new THREE.Vector3();
    object.getWorldPosition(objectPosition);
    
    // Calculate optimal camera position
    const distance = object.geometry.boundingSphere.radius * 3;
    const targetPosition = objectPosition.clone().add(new THREE.Vector3(distance, distance * 0.5, distance));
    
    // Animate camera
    this.animateCamera(targetPosition, objectPosition);
  }

  animateCamera(targetPosition, lookAtPosition) {
    const startPosition = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    
    let progress = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate camera position
      this.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
      
      // Interpolate look-at target
      this.controls.target.lerpVectors(startTarget, lookAtPosition, easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }

  onKeyDown(event) {
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.toggleAnimation();
        break;
      case 'KeyR':
        this.resetView();
        break;
      case 'Escape':
        this.deselectObject();
        break;
    }
  }

  toggleAnimation() {
    this.isRunning = !this.isRunning;
    this.emit('animation:toggled', this.isRunning);
  }

  resetView() {
    this.camera.position.set(-300, 200, 300);
    this.controls.target.set(0, 0, 0);
    this.deselectObject();
  }

  deselectObject() {
    this.selectedObject = null;
    this.outlinePass.selectedObjects = [];
    this.emit('object:deselected');
  }

  setAnimationSpeed(type, speed) {
    this.animationSpeed[type] = speed;
    this.emit('speed:changed', { type, speed });
  }

  setScale(scaleType) {
    if (this.currentScale === scaleType) return;
    
    this.currentScale = scaleType;
    this.emit('scale:changed', scaleType);
    
    // Recreate solar system with new scale
    this.recreateSolarSystem();
  }

  async recreateSolarSystem() {
    // Clear existing objects
    this.clearSolarSystem();
    
    // Recreate with new scale
    await this.createSolarSystem();
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
    window.removeEventListener('keydown', this.onKeyDown);
  }

  // Public API methods
  getPlanetData(planetName) {
    const planet = this.planets.get(planetName);
    return planet ? planet.data : null;
  }

  getAllPlanets() {
    return Array.from(this.planets.keys());
  }

  searchObjects(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
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
    });
    
    return results;
  }

  /**
   * Modifier le rayon du Soleil en fonction des données d'une étoile
   * @param {Object} starData - Données de l'étoile (avec radius en R☉)
   */
  updateSunRadius(starData) {
    if (!this.sun || !starData || !starData.radius) {
      console.warn('⚠️ Impossible de modifier le rayon du Soleil:', { 
        hasSun: !!this.sun, 
        hasStarData: !!starData,
        hasRadius: !!(starData && starData.radius)
      });
      return;
    }

    const scaleFactors = SCALE_FACTORS[this.currentScale];
    
    // Rayon du Soleil par défaut (en km)
    const defaultSunRadius = SOLAR_SYSTEM_DATA.sun.diameter / 2; // 696,350 km
    
    // Nouveau rayon basé sur l'étoile (en R☉ = rayons solaires)
    const newRadiusInKm = defaultSunRadius * starData.radius;
    
    // Appliquer les facteurs d'échelle
    const newScaledRadius = (newRadiusInKm / 1000) * scaleFactors.size;
    
    console.log('\n🌟 MODIFICATION DU RAYON DU SOLEIL:');
    console.log(`   Étoile: ${starData.name}`);
    console.log(`   Rayon original: ${defaultSunRadius.toFixed(0)} km (1.0 R☉)`);
    console.log(`   Rayon de l'étoile: ${starData.radius.toFixed(2)} R☉`);
    console.log(`   Nouveau rayon: ${newRadiusInKm.toFixed(0)} km`);
    console.log(`   Rayon 3D avant: ${this.sun.scaledSize.toFixed(2)}`);
    console.log(`   Rayon 3D après: ${newScaledRadius.toFixed(2)}`);
    
    // Modifier le rayon du Soleil
    this.sun.setRadius(newScaledRadius);
    
    console.log('✅ Rayon du Soleil mis à jour!\n');
    
    // Émettre un événement
    this.emit('sun:radius-changed', {
      starData,
      oldRadius: this.sun.scaledSize,
      newRadius: newScaledRadius
    });
  }

  /**
   * Réinitialiser le rayon du Soleil à sa valeur par défaut
   */
  resetSunRadius() {
    if (!this.sun) return;
    
    const scaleFactors = SCALE_FACTORS[this.currentScale];
    const defaultRadius = (SOLAR_SYSTEM_DATA.sun.diameter / 2 / 1000) * scaleFactors.size;
    
    console.log('🔄 Réinitialisation du rayon du Soleil à la valeur par défaut');
    this.sun.setRadius(defaultRadius);
    
    this.emit('sun:radius-reset');
  }
}
