import * as THREE from 'three';

export class Sun {
  constructor(data, scaleFactors) {
    this.data = data;
    this.scaleFactors = scaleFactors;
    
    // 3D Objects
    this.group = new THREE.Group();
    this.mesh = null;
    this.pointLight = null;
    this.corona = null;
    
    // Animation properties
    this.rotationAngle = 0;
    this.rotationSpeed = 0.005; // Slow rotation
    
    // Calculated properties
    this.scaledSize = (this.data.diameter / 2) * this.scaleFactors.size / 1000;
  }

  async init() {
    try {
      await this.createSun();
      this.createLight();
      await this.createCorona();
      
    } catch (error) {
      console.error('Failed to initialize Sun:', error);
    }
  }

  async createSun() {
    const geometry = new THREE.SphereGeometry(this.scaledSize, 64, 32);
    
    // Load sun texture
    const loader = new THREE.TextureLoader();
    const sunTexture = await loader.loadAsync(this.data.texture);
    
    // Create emissive material for the sun (MeshStandardMaterial supports emissive)
    const material = new THREE.MeshStandardMaterial({
      map: sunTexture,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      emissiveMap: sunTexture,
      toneMapped: false // Permet au Soleil de briller plus fort
    });
    
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.userData = { type: 'sun', data: this.data };
    
    // Sun doesn't cast shadows but can receive them from other objects
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    
    this.group.add(this.mesh);
  }

  createLight() {
    // Create point light at sun's center - Intensité d'origine restaurée
    this.pointLight = new THREE.PointLight(0xffffff, 25, 0, 2); 
    this.pointLight.position.set(0, 0, 0);
    this.pointLight.castShadow = true;
    
    // Configure shadow properties for realistic shadows
    this.pointLight.shadow.mapSize.width = 4096; // Haute résolution
    this.pointLight.shadow.mapSize.height = 4096;
    this.pointLight.shadow.camera.near = 0.5;
    this.pointLight.shadow.camera.far = 5000; // Portée adaptée
    this.pointLight.shadow.bias = -0.0001;
    this.pointLight.shadow.radius = 2; // Ombres douces
    
    this.group.add(this.pointLight);
    
    console.log('☀️ Lumière solaire créée (intensité restaurée):', {
      intensity: this.pointLight.intensity,
      decay: this.pointLight.decay,
      castShadow: this.pointLight.castShadow,
      shadowMapSize: `${this.pointLight.shadow.mapSize.width}x${this.pointLight.shadow.mapSize.height}`
    });
  }

  async createCorona() {
    // Create a larger, semi-transparent sphere for the corona effect
    const coronaGeometry = new THREE.SphereGeometry(this.scaledSize * 1.2, 32, 16);
    
    // Create corona shader material
    const coronaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 0.5 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          float fresnel = dot(vNormal, vec3(0.0, 0.0, 1.0));
          fresnel = pow(1.0 - fresnel, 2.0);
          
          // Add some animation
          float noise = sin(vPosition.x * 0.1 + time) * sin(vPosition.y * 0.1 + time * 1.3) * sin(vPosition.z * 0.1 + time * 0.7);
          fresnel += noise * 0.1;
          
          vec3 color = mix(vec3(1.0, 0.4, 0.0), vec3(1.0, 0.8, 0.0), fresnel);
          float alpha = fresnel * intensity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    
    this.corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    this.group.add(this.corona);
  }

  update(deltaTime, animationSpeed) {
    // Rotate the sun
    this.rotationAngle += this.rotationSpeed * animationSpeed.rotation * deltaTime * 60;
    
    if (this.mesh) {
      this.mesh.rotation.y = this.rotationAngle;
    }
    
    // Update corona animation
    if (this.corona && this.corona.material.uniforms) {
      this.corona.material.uniforms.time.value += deltaTime;
    }
    
    // Subtle pulsing of the sun's emissive intensity
    if (this.mesh && this.mesh.material) {
      const pulse = Math.sin(Date.now() * 0.001) * 0.1 + 0.9;
      this.mesh.material.emissiveIntensity = pulse;
    }
  }

  setIntensity(intensity) {
    if (this.pointLight) {
      this.pointLight.intensity = intensity * 2;
    }
    
    if (this.mesh && this.mesh.material) {
      this.mesh.material.emissiveIntensity = intensity;
    }
    
    if (this.corona && this.corona.material.uniforms) {
      this.corona.material.uniforms.intensity.value = intensity * 0.5;
    }
  }

  /**
   * Modifier le rayon du Soleil dynamiquement
   * @param {number} newRadius - Nouveau rayon (échelle 3D)
   */
  setRadius(newRadius) {
    if (!this.mesh || !this.corona) {
      console.warn('⚠️ Impossible de modifier le rayon: objets non initialisés');
      return;
    }

    // Sauvegarder l'ancien rayon
    const oldRadius = this.scaledSize;
    
    // Mettre à jour le rayon
    this.scaledSize = newRadius;
    
    // Recréer la géométrie du mesh principal
    const oldGeometry = this.mesh.geometry;
    this.mesh.geometry = new THREE.SphereGeometry(newRadius, 64, 32);
    oldGeometry.dispose();
    
    // Recréer la géométrie de la corona (1.2x le rayon)
    const oldCoronaGeometry = this.corona.geometry;
    this.corona.geometry = new THREE.SphereGeometry(newRadius * 1.2, 32, 16);
    oldCoronaGeometry.dispose();
    
    console.log(`   ☀️ Soleil redimensionné: ${oldRadius.toFixed(2)} → ${newRadius.toFixed(2)}`);
  }

  dispose() {
    // Dispose geometries and materials
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    
    if (this.corona) {
      this.corona.geometry.dispose();
      this.corona.material.dispose();
    }
    
    // Point light doesn't need disposal
  }
}
