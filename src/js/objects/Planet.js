import * as THREE from 'three';
import { ASTRONOMICAL_UNIT } from '../data/solarSystemData.js';

export class Planet {
  constructor(data, scaleFactors) {
    this.data = data;
    this.scaleFactors = scaleFactors;
    
    // 3D Objects
    this.group = new THREE.Group();
    this.mesh = null;
    this.atmosphere = null;
    this.rings = null;
    this.moons = [];
    this.orbitLine = null;
    
    // Animation properties
    this.orbitAngle = Math.random() * Math.PI * 2; // Random starting position
    this.rotationAngle = 0;
    
    // Calculated properties
    this.scaledDistance = this.data.distanceFromSun * this.scaleFactors.distance;
    this.scaledSize = (this.data.diameter / 2) * this.scaleFactors.size / 1000; // Convert to reasonable units
    
    // Orbit properties
    this.orbitSpeed = this.calculateOrbitSpeed();
    this.rotationSpeed = this.calculateRotationSpeed();
  }

  calculateOrbitSpeed() {
    // Kepler's third law approximation for visual appeal
    const baseSpeed = 0.001;
    const distanceFactor = Math.sqrt(this.data.distanceFromSun / ASTRONOMICAL_UNIT);
    return baseSpeed / distanceFactor;
  }

  calculateRotationSpeed() {
    // Based on rotation period
    const earthDay = 0.99726968; // Earth day in Earth days
    const rotationPeriod = Math.abs(this.data.rotationPeriod);
    return (earthDay / rotationPeriod) * 0.01; // Scale for visual appeal
  }

  async init() {
    try {
      await this.createPlanet();
      this.createOrbitLine();
      
      if (this.data.atmosphere) {
        await this.createAtmosphere();
      }
      
      if (this.data.rings) {
        await this.createRings();
      }
      
      if (this.data.moons || this.data.majorMoons) {
        await this.createMoons();
      }
      
      // Position planet at initial orbit position
      this.updateOrbitPosition();
      
    } catch (error) {
      console.error(`Failed to initialize planet ${this.data.name}:`, error);
    }
  }

  async createPlanet() {
    const geometry = new THREE.SphereGeometry(this.scaledSize, 64, 32);
    
    let material;
    
    // Special case for Earth with day/night cycle
    if (this.data.name === 'Terre' && this.data.nightTexture) {
      material = await this.createEarthMaterial();
    } else {
      material = await this.createStandardMaterial();
    }
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.userData = { type: 'planet', data: this.data };
    
    // Set axial tilt
    this.mesh.rotation.z = (this.data.axialTilt || 0) * Math.PI / 180;
    
    // Enable shadows
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    
    this.group.add(this.mesh);
  }

  async createStandardMaterial() {
    const loader = new THREE.TextureLoader();
    
    const materialProps = {
      map: await loader.loadAsync(this.data.texture),
      // Propriétés optimisées pour un éclairage réaliste avec ombres
      shininess: 5, // Très faible brillance
      specular: 0x050505, // Réflexion spéculaire minimale
      flatShading: false, // Éclairage lisse pour meilleur rendu
      // Pas d'émission pour permettre aux côtés sombres d'être vraiment sombres
      emissive: 0x000000,
      emissiveIntensity: 0
    };
    
    // Add bump map if available
    if (this.data.bumpMap) {
      materialProps.bumpMap = await loader.loadAsync(this.data.bumpMap);
      materialProps.bumpScale = 0.3; // Augmenter l'effet du bump mapping
    }
    
    // Add normal map if available
    if (this.data.normalMap) {
      materialProps.normalMap = await loader.loadAsync(this.data.normalMap);
      materialProps.normalScale = new THREE.Vector2(1, 1);
    }
    
    return new THREE.MeshPhongMaterial(materialProps);
  }

  async createEarthMaterial() {
    const loader = new THREE.TextureLoader();
    
    // Load Earth textures
    const dayTexture = await loader.loadAsync(this.data.texture);
    const nightTexture = await loader.loadAsync(this.data.nightTexture);
    
    // Create custom shader material for Earth
    const material = new THREE.ShaderMaterial({
      uniforms: {
        dayTexture: { value: dayTexture },
        nightTexture: { value: nightTexture },
        sunDirection: { value: new THREE.Vector3(1, 0, 0) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D dayTexture;
        uniform sampler2D nightTexture;
        uniform vec3 sunDirection;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vec3 dayColor = texture2D(dayTexture, vUv).rgb;
          vec3 nightColor = texture2D(nightTexture, vUv).rgb * 0.3; // Réduire l'intensité des lumières nocturnes
          
          // Calculer l'intensité de l'éclairage solaire
          float intensity = dot(vNormal, normalize(sunDirection));
          
          // Transition plus douce entre jour et nuit
          intensity = smoothstep(-0.2, 0.2, intensity);
          
          // Mélanger les textures jour/nuit selon l'éclairage
          vec3 color = mix(nightColor, dayColor, intensity);
          
          // Ajouter un léger éclairage ambiant pour éviter les zones complètement noires
          color += dayColor * 0.05;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    
    return material;
  }

  async createAtmosphere() {
    if (!this.data.atmosphereTexture) return;
    
    const loader = new THREE.TextureLoader();
    const atmosphereTexture = await loader.loadAsync(this.data.atmosphereTexture);
    
    const atmosphereGeometry = new THREE.SphereGeometry(this.scaledSize * 1.02, 32, 16);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      map: atmosphereTexture,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
      // Propriétés pour interaction réaliste avec la lumière
      shininess: 0,
      specular: 0x000000
    });
    
    this.atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    // Les atmosphères ne projettent pas d'ombres mais peuvent en recevoir
    this.atmosphere.castShadow = false;
    this.atmosphere.receiveShadow = true;
    this.group.add(this.atmosphere);
  }

  async createRings() {
    if (!this.data.rings) return;
    
    const loader = new THREE.TextureLoader();
    const ringTexture = await loader.loadAsync(this.data.rings.texture);
    
    const innerRadius = this.data.rings.innerRadius * this.scaleFactors.size / 1000;
    const outerRadius = this.data.rings.outerRadius * this.scaleFactors.size / 1000;
    
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    // Utiliser MeshPhongMaterial au lieu de MeshBasicMaterial pour réagir à la lumière
    const ringMaterial = new THREE.MeshPhongMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      shininess: 0,
      specular: 0x000000,
      emissive: 0x000000 // Pas d'émission, les anneaux doivent être éclairés
    });
    
    this.rings = new THREE.Mesh(ringGeometry, ringMaterial);
    this.rings.rotation.x = Math.PI / 2; // Horizontal rings
    
    // Les anneaux projettent et reçoivent des ombres
    this.rings.castShadow = true;
    this.rings.receiveShadow = true;
    
    this.group.add(this.rings);
  }

  async createMoons() {
    // Gérer le cas où moons est un nombre (Jupiter: 95 moons) ou un tableau
    let moonsData = this.data.majorMoons || this.data.moons;
    
    // Si c'est un nombre ou undefined, ne rien faire
    if (!moonsData || typeof moonsData === 'number') {
      console.log(`   ℹ️ ${this.data.name}: ${moonsData || 0} lunes (non modélisées individuellement)`);
      return;
    }
    
    // Si c'est un tableau, créer les lunes
    if (Array.isArray(moonsData)) {
      for (const moonData of moonsData) {
        const moon = await this.createMoon(moonData);
        this.moons.push(moon);
        this.group.add(moon.group);
      }
      console.log(`   ✅ ${this.data.name}: ${moonsData.length} lunes créées`);
    }
  }

  async createMoon(moonData) {
    const moonSize = (moonData.diameter / 2) * this.scaleFactors.size / 1000;
    const moonDistance = moonData.distanceFromPlanet * this.scaleFactors.distance / 10000; // Scale down moon orbits
    
    const moonGroup = new THREE.Group();
    
    // Create moon mesh
    const moonGeometry = new THREE.SphereGeometry(moonSize, 32, 16);
    let moonMaterial;
    
    if (moonData.texture) {
      const loader = new THREE.TextureLoader();
      const texture = await loader.loadAsync(moonData.texture);
      moonMaterial = new THREE.MeshPhongMaterial({ 
        map: texture,
        shininess: 5, // Très faible brillance
        specular: 0x050505, // Réflexion spéculaire minimale
        emissive: 0x000000 // Pas d'émission
      });
      
      if (moonData.bumpMap) {
        const bumpTexture = await loader.loadAsync(moonData.bumpMap);
        moonMaterial.bumpMap = bumpTexture;
        moonMaterial.bumpScale = 0.3; // Augmenter l'effet du bump mapping
      }
    } else {
      moonMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x888888,
        shininess: 5,
        specular: 0x050505,
        emissive: 0x000000
      });
    }
    
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.x = moonDistance;
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    
    moonGroup.add(moonMesh);
    
    // Create moon orbit line
    const orbitGeometry = new THREE.RingGeometry(moonDistance * 0.99, moonDistance * 1.01, 64);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLine.rotation.x = Math.PI / 2;
    moonGroup.add(orbitLine);
    
    return {
      group: moonGroup,
      mesh: moonMesh,
      data: moonData,
      distance: moonDistance,
      angle: Math.random() * Math.PI * 2,
      speed: 0.01 / (moonData.orbitalPeriod || 1)
    };
  }

  createOrbitLine() {
    const points = [];
    const segments = 128;
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * this.scaledDistance;
      const z = Math.sin(angle) * this.scaledDistance;
      points.push(new THREE.Vector3(x, 0, z));
    }
    
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    // Couleurs spécifiques par planète
    const planetColors = {
      'Mercury': 0x8C7853,    // Brun-gris
      'Venus': 0xFFC649,      // Jaune-orange
      'Terre': 0x6B93D6,      // Bleu
      'Earth': 0x6B93D6,      // Bleu (alias)
      'Mars': 0xCD5C5C,       // Rouge
      'Jupiter': 0xD8CA9D,    // Beige-doré
      'Saturn': 0xFAD5A5,     // Jaune pâle
      'Uranus': 0x4FD0E7,     // Cyan
      'Neptune': 0x4B70DD,    // Bleu foncé
      'Pluto': 0x8B7355       // Brun
    };
    
    const orbitColor = planetColors[this.data.name] || 0xffffff;
    
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: orbitColor,
      transparent: true,
      opacity: 0.6
    });
    
    this.orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    this.group.add(this.orbitLine);
  }

  updateOrbitPosition() {
    const x = Math.cos(this.orbitAngle) * this.scaledDistance;
    const z = Math.sin(this.orbitAngle) * this.scaledDistance;
    
    if (this.mesh) {
      this.mesh.position.set(x, 0, z);
    }
    
    if (this.atmosphere) {
      this.atmosphere.position.set(x, 0, z);
    }
    
    if (this.rings) {
      this.rings.position.set(x, 0, z);
    }
    
    // Update moons relative to planet position
    this.moons.forEach(moon => {
      moon.group.position.set(x, 0, z);
    });
  }

  update(deltaTime, animationSpeed) {
    // Update orbital position
    this.orbitAngle += this.orbitSpeed * animationSpeed.orbit * deltaTime * 60;
    this.updateOrbitPosition();
    
    // Update rotation
    this.rotationAngle += this.rotationSpeed * animationSpeed.rotation * deltaTime * 60;
    
    if (this.mesh) {
      this.mesh.rotation.y = this.rotationAngle;
      
      // Update Earth shader uniforms if it's Earth
      if (this.data.name === 'Terre' && this.mesh.material.uniforms) {
        // Update sun direction based on planet position
        // Le soleil est à l'origine (0,0,0), donc la direction du soleil depuis la planète
        // est le vecteur qui va de la planète vers le soleil
        const sunDirection = new THREE.Vector3(0, 0, 0).sub(this.mesh.position).normalize();
        this.mesh.material.uniforms.sunDirection.value = sunDirection;
      }
    }
    
    if (this.atmosphere) {
      this.atmosphere.rotation.y = this.rotationAngle * 0.95; // Slightly slower
    }
    
    // Update moons
    this.moons.forEach(moon => {
      moon.angle += moon.speed * animationSpeed.orbit * deltaTime * 60;
      const moonX = Math.cos(moon.angle) * moon.distance;
      const moonZ = Math.sin(moon.angle) * moon.distance;
      moon.mesh.position.set(moonX, 0, moonZ);
      moon.mesh.rotation.y += 0.01 * animationSpeed.rotation * deltaTime * 60;
    });
  }

  setOrbitVisibility(visible) {
    if (this.orbitLine) {
      this.orbitLine.visible = visible;
    }
    
    this.moons.forEach(moon => {
      if (moon.group.children[1]) { // Orbit line is second child
        moon.group.children[1].visible = visible;
      }
    });
  }

  dispose() {
    // Dispose geometries and materials
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    
    if (this.atmosphere) {
      this.atmosphere.geometry.dispose();
      this.atmosphere.material.dispose();
    }
    
    if (this.rings) {
      this.rings.geometry.dispose();
      this.rings.material.dispose();
    }
    
    if (this.orbitLine) {
      this.orbitLine.geometry.dispose();
      this.orbitLine.material.dispose();
    }
    
    this.moons.forEach(moon => {
      moon.mesh.geometry.dispose();
      moon.mesh.material.dispose();
    });
    
    // Clear arrays
    this.moons = [];
  }
}
