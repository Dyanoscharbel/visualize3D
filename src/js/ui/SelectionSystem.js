import * as THREE from 'three';
import { EventEmitter } from '../utils/EventEmitter.js';

export class SelectionSystem extends EventEmitter {
  constructor(engine, uiManager) {
    super();
    
    this.engine = engine;
    this.ui = uiManager;
    
    // Selection state
    this.selectedObject = null;
    this.hoveredObject = null;
    this.selectionMode = 'normal'; // normal, focus, detailed
    
    // Visual effects
    this.selectionRing = null;
    this.focusCamera = null;
    this.labelSystem = null;
    
    // Animation state
    this.isAnimatingToTarget = false;
    this.animationStartTime = 0;
    this.animationDuration = 2000; // 2 seconds
    
    this.init();
  }

  init() {
    this.createSelectionEffects();
    this.createLabelSystem();
    this.setupEventListeners();
  }

  createSelectionEffects() {
    // Selection ring geometry
    const ringGeometry = new THREE.RingGeometry(1, 1.2, 64);
    const ringMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffff) },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          float dist = distance(vUv, vec2(0.5));
          float ring = smoothstep(0.3, 0.35, dist) * smoothstep(0.5, 0.45, dist);
          
          // Pulsing effect
          float pulse = sin(time * 3.0) * 0.3 + 0.7;
          
          // Scanning effect
          float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
          float scan = sin(angle * 8.0 + time * 2.0) * 0.2 + 0.8;
          
          float alpha = ring * pulse * scan * opacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    this.selectionRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.selectionRing.visible = false;
    this.engine.scene.add(this.selectionRing);
  }

  createLabelSystem() {
    this.labelSystem = {
      container: document.getElementById('planet-labels'),
      labels: new Map(),
      updateLabels: this.updateLabels.bind(this)
    };
  }

  setupEventListeners() {
    // Mouse events
    this.engine.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.engine.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
    this.engine.renderer.domElement.addEventListener('dblclick', this.onMouseDoubleClick.bind(this));
    
    // Keyboard events
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  onMouseMove(event) {
    const rect = this.engine.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    this.updateHover(mouse);
  }

  onMouseClick(event) {
    if (this.hoveredObject) {
      this.selectObject(this.hoveredObject);
    } else {
      this.deselectObject();
    }
  }

  onMouseDoubleClick(event) {
    if (this.selectedObject) {
      this.focusOnObject(this.selectedObject, 'detailed');
    }
  }

  onKeyDown(event) {
    switch (event.code) {
      case 'Escape':
        this.deselectObject();
        this.resetCamera();
        break;
      case 'KeyF':
        if (this.selectedObject) {
          this.focusOnObject(this.selectedObject, 'focus');
        }
        break;
      case 'KeyD':
        if (this.selectedObject) {
          this.focusOnObject(this.selectedObject, 'detailed');
        }
        break;
    }
  }

  updateHover(mouse) {
    this.engine.raycaster.setFromCamera(mouse, this.engine.camera);
    
    // Get all selectable objects
    const selectableObjects = this.getSelectableObjects();
    const intersects = this.engine.raycaster.intersectObjects(selectableObjects);
    
    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const objectData = this.getObjectData(intersectedObject);
      
      if (objectData && objectData !== this.hoveredObject) {
        this.setHoveredObject(objectData);
      }
    } else if (this.hoveredObject) {
      this.clearHover();
    }
  }

  getSelectableObjects() {
    const objects = [];
    
    // Add sun
    if (this.engine.sun && this.engine.sun.mesh) {
      objects.push(this.engine.sun.mesh);
    }
    
    // Add planets and their moons
    this.engine.planets.forEach(planet => {
      if (planet.mesh) {
        objects.push(planet.mesh);
      }
      
      // Add moons
      planet.moons.forEach(moon => {
        if (moon.mesh) {
          objects.push(moon.mesh);
        }
      });
    });
    
    return objects;
  }

  getObjectData(mesh) {
    // Check if it's the sun
    if (this.engine.sun && this.engine.sun.mesh === mesh) {
      return {
        type: 'sun',
        object: this.engine.sun,
        mesh: mesh,
        data: this.engine.sun.data,
        name: this.engine.sun.data.name
      };
    }
    
    // Check planets
    for (const [planetName, planet] of this.engine.planets) {
      if (planet.mesh === mesh) {
        return {
          type: 'planet',
          object: planet,
          mesh: mesh,
          data: planet.data,
          name: planet.data.name,
          planetName: planetName
        };
      }
      
      // Check moons
      for (const moon of planet.moons) {
        if (moon.mesh === mesh) {
          return {
            type: 'moon',
            object: moon,
            mesh: mesh,
            data: moon.data,
            name: moon.data.name,
            parent: planet,
            parentName: planet.data.name
          };
        }
      }
    }
    
    return null;
  }

  setHoveredObject(objectData) {
    this.hoveredObject = objectData;
    this.engine.renderer.domElement.style.cursor = 'pointer';
    
    // Update outline effect
    if (this.engine.outlinePass) {
      this.engine.outlinePass.selectedObjects = [objectData.mesh];
    }
    
    // Show tooltip
    this.showTooltip(objectData);
    
    this.emit('object:hovered', objectData);
  }

  clearHover() {
    this.hoveredObject = null;
    this.engine.renderer.domElement.style.cursor = 'default';
    
    // Clear outline effect (but keep selection outline)
    if (this.engine.outlinePass && !this.selectedObject) {
      this.engine.outlinePass.selectedObjects = [];
    }
    
    this.hideTooltip();
    this.emit('object:hover-cleared');
  }

  selectObject(objectData) {
    // Deselect previous object
    if (this.selectedObject) {
      this.deselectObject(false);
    }
    
    this.selectedObject = objectData;
    this.selectionMode = 'normal';
    
    // Visual effects
    this.showSelectionRing(objectData);
    this.updateOutlineEffect();
    
    // Update UI
    this.ui.showObjectInfo(objectData);
    this.ui.openRightPanel();
    
    // Update labels
    this.updateLabels();
    
    this.emit('object:selected', objectData);
  }

  deselectObject(resetCamera = true) {
    if (!this.selectedObject) return;
    
    const previousSelection = this.selectedObject;
    this.selectedObject = null;
    this.selectionMode = 'normal';
    
    // Hide visual effects
    this.hideSelectionRing();
    this.updateOutlineEffect();
    
    // Update UI
    this.ui.hideObjectInfo();
    this.ui.closeRightPanel();
    
    if (resetCamera) {
      this.resetCamera();
    }
    
    this.emit('object:deselected', previousSelection);
  }

  focusOnObject(objectData, mode = 'focus') {
    this.selectionMode = mode;
    
    const targetPosition = new THREE.Vector3();
    objectData.mesh.getWorldPosition(targetPosition);
    
    // Calculate optimal camera position based on object size and mode
    const objectSize = this.getObjectSize(objectData);
    let distance;
    
    switch (mode) {
      case 'focus':
        distance = objectSize * 5;
        break;
      case 'detailed':
        distance = objectSize * 2;
        break;
      default:
        distance = objectSize * 10;
    }
    
    // Ensure minimum distance
    distance = Math.max(distance, 1);
    
    const cameraOffset = new THREE.Vector3(distance, distance * 0.3, distance * 0.5);
    const newCameraPosition = targetPosition.clone().add(cameraOffset);
    
    this.animateCamera(newCameraPosition, targetPosition, mode);
    
    // Update selection ring size
    if (this.selectionRing.visible) {
      this.updateSelectionRingSize(objectData, mode);
    }
    
    this.emit('camera:focus', { target: objectData, mode: mode });
  }

  animateCamera(targetPosition, lookAtPosition, mode) {
    this.isAnimatingToTarget = true;
    this.animationStartTime = Date.now();
    
    const startPosition = this.engine.camera.position.clone();
    const startTarget = this.engine.controls.target.clone();
    
    const animate = () => {
      if (!this.isAnimatingToTarget) return;
      
      const elapsed = Date.now() - this.animationStartTime;
      const progress = Math.min(elapsed / this.animationDuration, 1);
      
      // Smooth easing function
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Interpolate camera position
      this.engine.camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
      
      // Interpolate look-at target
      this.engine.controls.target.lerpVectors(startTarget, lookAtPosition, easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimatingToTarget = false;
        this.emit('camera:animation-complete', { mode: mode });
      }
    };
    
    animate();
  }

  resetCamera() {
    const defaultPosition = new THREE.Vector3(-300, 200, 300);
    const defaultTarget = new THREE.Vector3(0, 0, 0);
    
    this.animateCamera(defaultPosition, defaultTarget, 'overview');
    this.selectionMode = 'normal';
  }

  showSelectionRing(objectData) {
    if (!this.selectionRing) return;
    
    const position = new THREE.Vector3();
    objectData.mesh.getWorldPosition(position);
    
    this.selectionRing.position.copy(position);
    this.updateSelectionRingSize(objectData);
    this.selectionRing.visible = true;
  }

  hideSelectionRing() {
    if (this.selectionRing) {
      this.selectionRing.visible = false;
    }
  }

  updateSelectionRingSize(objectData, mode = 'normal') {
    if (!this.selectionRing) return;
    
    const objectSize = this.getObjectSize(objectData);
    let ringSize;
    
    switch (mode) {
      case 'detailed':
        ringSize = objectSize * 1.5;
        break;
      case 'focus':
        ringSize = objectSize * 2;
        break;
      default:
        ringSize = objectSize * 3;
    }
    
    this.selectionRing.scale.setScalar(ringSize);
  }

  getObjectSize(objectData) {
    if (!objectData.mesh.geometry.boundingSphere) {
      objectData.mesh.geometry.computeBoundingSphere();
    }
    return objectData.mesh.geometry.boundingSphere.radius;
  }

  updateOutlineEffect() {
    if (!this.engine.outlinePass) return;
    
    if (this.selectedObject) {
      this.engine.outlinePass.selectedObjects = [this.selectedObject.mesh];
      this.engine.outlinePass.visibleEdgeColor.setHex(0x00ffff);
    } else if (this.hoveredObject) {
      this.engine.outlinePass.selectedObjects = [this.hoveredObject.mesh];
      this.engine.outlinePass.visibleEdgeColor.setHex(0xffffff);
    } else {
      this.engine.outlinePass.selectedObjects = [];
    }
  }

  showTooltip(objectData) {
    // Create or update tooltip
    let tooltip = document.getElementById('object-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'object-tooltip';
      tooltip.className = 'object-tooltip';
      document.body.appendChild(tooltip);
    }
    
    tooltip.innerHTML = `
      <div class="tooltip-content">
        <div class="tooltip-name">${objectData.name}</div>
        <div class="tooltip-type">${this.getObjectTypeLabel(objectData)}</div>
        ${objectData.type === 'moon' ? `<div class="tooltip-parent">Satellite de ${objectData.parentName}</div>` : ''}
      </div>
    `;
    
    tooltip.style.display = 'block';
    
    // Position tooltip near cursor
    document.addEventListener('mousemove', this.updateTooltipPosition);
  }

  hideTooltip() {
    const tooltip = document.getElementById('object-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
    document.removeEventListener('mousemove', this.updateTooltipPosition);
  }

  updateTooltipPosition(event) {
    const tooltip = document.getElementById('object-tooltip');
    if (tooltip) {
      tooltip.style.left = (event.clientX + 10) + 'px';
      tooltip.style.top = (event.clientY - 10) + 'px';
    }
  }

  getObjectTypeLabel(objectData) {
    switch (objectData.type) {
      case 'sun': return 'Étoile';
      case 'planet': 
        switch (objectData.data.type) {
          case 'terrestrial': return 'Planète Tellurique';
          case 'gas_giant': return 'Géante Gazeuse';
          case 'ice_giant': return 'Géante de Glace';
          default: return 'Planète';
        }
      case 'moon': return 'Satellite Naturel';
      default: return 'Objet Céleste';
    }
  }

  updateLabels() {
    if (!this.labelSystem.container) return;
    
    // Clear existing labels
    this.labelSystem.container.innerHTML = '';
    this.labelSystem.labels.clear();
    
    // Add labels for visible objects
    const objects = this.getSelectableObjects();
    
    objects.forEach(mesh => {
      const objectData = this.getObjectData(mesh);
      if (!objectData) return;
      
      // Skip if object is too far or too small
      const distance = this.engine.camera.position.distanceTo(mesh.position);
      const objectSize = this.getObjectSize(objectData);
      
      if (distance / objectSize > 1000 && objectData.type !== 'sun') return;
      
      this.createLabel(objectData);
    });
  }

  createLabel(objectData) {
    const label = document.createElement('div');
    label.className = 'planet-label';
    label.textContent = objectData.name;
    
    if (this.selectedObject && this.selectedObject.mesh === objectData.mesh) {
      label.classList.add('selected');
    }
    
    // Position label
    this.updateLabelPosition(label, objectData);
    
    // Add click handler
    label.addEventListener('click', () => {
      this.selectObject(objectData);
    });
    
    this.labelSystem.container.appendChild(label);
    this.labelSystem.labels.set(objectData.mesh, label);
  }

  updateLabelPosition(label, objectData) {
    const position = new THREE.Vector3();
    objectData.mesh.getWorldPosition(position);
    
    // Project 3D position to screen coordinates
    const screenPosition = position.clone().project(this.engine.camera);
    
    const x = (screenPosition.x * 0.5 + 0.5) * this.engine.renderer.domElement.clientWidth;
    const y = (screenPosition.y * -0.5 + 0.5) * this.engine.renderer.domElement.clientHeight;
    
    label.style.left = x + 'px';
    label.style.top = y + 'px';
    
    // Hide label if behind camera
    label.style.display = screenPosition.z > 1 ? 'none' : 'block';
  }

  update(deltaTime) {
    // Update selection ring animation
    if (this.selectionRing && this.selectionRing.visible) {
      this.selectionRing.material.uniforms.time.value += deltaTime;
      
      // Keep ring positioned on selected object
      if (this.selectedObject) {
        const position = new THREE.Vector3();
        this.selectedObject.mesh.getWorldPosition(position);
        this.selectionRing.position.copy(position);
      }
    }
    
    // Update labels positions
    this.labelSystem.labels.forEach((label, mesh) => {
      const objectData = this.getObjectData(mesh);
      if (objectData) {
        this.updateLabelPosition(label, objectData);
      }
    });
  }

  dispose() {
    // Remove event listeners
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('mousemove', this.updateTooltipPosition);
    
    // Clean up 3D objects
    if (this.selectionRing) {
      this.engine.scene.remove(this.selectionRing);
      this.selectionRing.geometry.dispose();
      this.selectionRing.material.dispose();
    }
    
    // Clean up labels
    if (this.labelSystem.container) {
      this.labelSystem.container.innerHTML = '';
    }
    
    this.labelSystem.labels.clear();
  }
}
