import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ASTEROID_BELTS } from '../data/solarSystemData.js';

export class AsteroidBelt {
  constructor(beltType, scaleFactors) {
    this.beltType = beltType;
    this.beltData = ASTEROID_BELTS[beltType];
    this.scaleFactors = scaleFactors;
    
    // 3D Objects
    this.group = new THREE.Group();
    this.asteroids = [];
    this.instancedMesh = null;
    
    // Belt properties
    this.innerRadius = this.beltData.innerRadius * this.scaleFactors.distance;
    this.outerRadius = this.beltData.outerRadius * this.scaleFactors.distance;
    this.particleCount = this.beltData.particleCount;
    
    // Animation
    this.rotationSpeed = 0.0001; // Very slow rotation
  }

  async init() {
    try {
      await this.createAsteroidBelt();
    } catch (error) {
      console.error(`Failed to initialize ${this.beltType} asteroid belt:`, error);
      // Fallback to simple spheres if GLTF loading fails
      this.createSimpleAsteroidBelt();
    }
  }

  async createAsteroidBelt() {
    try {
      // Try to load the asteroid GLTF model
      const loader = new GLTFLoader();
      const gltf = await loader.loadAsync('/asteroids/asteroidPack.glb');
      
      // Get the first mesh from the GLTF
      let asteroidGeometry = null;
      gltf.scene.traverse((child) => {
        if (child.isMesh && !asteroidGeometry) {
          asteroidGeometry = child.geometry;
        }
      });
      
      if (asteroidGeometry) {
        this.createInstancedAsteroids(asteroidGeometry);
      } else {
        throw new Error('No geometry found in GLTF');
      }
      
    } catch (error) {
      console.warn('Failed to load GLTF asteroid model, using fallback:', error);
      this.createSimpleAsteroidBelt();
    }
  }

  createInstancedAsteroids(geometry) {
    // Create material for asteroids (MeshStandardMaterial supporte roughness/metalness)
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.9,
      metalness: 0.1
    });
    
    // Create instanced mesh for performance
    this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.particleCount);
    this.instancedMesh.castShadow = true;
    this.instancedMesh.receiveShadow = true;
    
    // Position asteroids in belt
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();
    
    for (let i = 0; i < this.particleCount; i++) {
      // Random position in belt
      const angle = Math.random() * Math.PI * 2;
      const distance = this.innerRadius + Math.random() * (this.outerRadius - this.innerRadius);
      const height = (Math.random() - 0.5) * 10; // Small vertical spread
      
      position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );
      
      // Random rotation
      rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      // Random scale (small asteroids)
      const asteroidScale = 0.1 + Math.random() * 0.3;
      scale.set(asteroidScale, asteroidScale, asteroidScale);
      
      // Apply transformation
      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      this.instancedMesh.setMatrixAt(i, matrix);
      
      // Store asteroid data for animation
      this.asteroids.push({
        angle: angle,
        distance: distance,
        height: height,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        orbitSpeed: this.calculateOrbitSpeed(distance)
      });
    }
    
    this.instancedMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.instancedMesh);
  }

  createSimpleAsteroidBelt() {
    // Fallback: create simple sphere asteroids
    const geometry = new THREE.SphereGeometry(1, 8, 6);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.9,
      metalness: 0.1
    });
    
    this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.particleCount);
    this.instancedMesh.castShadow = true;
    this.instancedMesh.receiveShadow = true;
    
    // Position asteroids
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();
    
    for (let i = 0; i < this.particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = this.innerRadius + Math.random() * (this.outerRadius - this.innerRadius);
      const height = (Math.random() - 0.5) * 10;
      
      position.set(
        Math.cos(angle) * distance,
        height,
        Math.sin(angle) * distance
      );
      
      rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      
      const asteroidScale = 0.5 + Math.random() * 1.5;
      scale.set(asteroidScale, asteroidScale, asteroidScale);
      
      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      this.instancedMesh.setMatrixAt(i, matrix);
      
      this.asteroids.push({
        angle: angle,
        distance: distance,
        height: height,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        orbitSpeed: this.calculateOrbitSpeed(distance)
      });
    }
    
    this.instancedMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.instancedMesh);
  }

  calculateOrbitSpeed(distance) {
    // Kepler's third law approximation
    const baseSpeed = 0.0001;
    return baseSpeed / Math.sqrt(distance / this.innerRadius);
  }

  update(deltaTime, animationSpeed) {
    if (!this.instancedMesh) return;
    
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();
    
    for (let i = 0; i < this.asteroids.length; i++) {
      const asteroid = this.asteroids[i];
      
      // Update orbital position
      asteroid.angle += asteroid.orbitSpeed * animationSpeed.orbit * deltaTime * 60;
      
      // Calculate new position
      position.set(
        Math.cos(asteroid.angle) * asteroid.distance,
        asteroid.height,
        Math.sin(asteroid.angle) * asteroid.distance
      );
      
      // Update rotation
      rotation.set(
        rotation.x + asteroid.rotationSpeed * animationSpeed.rotation * deltaTime * 60,
        rotation.y + asteroid.rotationSpeed * animationSpeed.rotation * deltaTime * 60,
        rotation.z + asteroid.rotationSpeed * animationSpeed.rotation * deltaTime * 60
      );
      
      // Keep original scale
      this.instancedMesh.getMatrixAt(i, matrix);
      matrix.decompose(position, new THREE.Quaternion(), scale);
      
      // Apply new transformation
      matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
      this.instancedMesh.setMatrixAt(i, matrix);
    }
    
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  setVisibility(visible) {
    this.group.visible = visible;
  }

  setOpacity(opacity) {
    if (this.instancedMesh && this.instancedMesh.material) {
      this.instancedMesh.material.transparent = opacity < 1;
      this.instancedMesh.material.opacity = opacity;
    }
  }

  dispose() {
    if (this.instancedMesh) {
      this.instancedMesh.geometry.dispose();
      this.instancedMesh.material.dispose();
    }
    
    this.asteroids = [];
  }
}
