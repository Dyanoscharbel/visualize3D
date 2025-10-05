import { RealisticSolarSystemEngine } from './core/RealisticSolarSystemEngine.js';
import { HUDManager } from './ui/HUDManager.js';
import { SelectionSystem } from './ui/SelectionSystem.js';

class FuturisticSolarSystemApp {
  constructor() {
    this.engine = null;
    this.hudManager = null;
    this.selectionSystem = null;
    this.isInitialized = false;
    
    // Performance monitoring
    this.stats = {
      fps: 0,
      frameCount: 0,
      lastTime: performance.now()
    };
  }

  async init() {
    try {
      console.log('🚀 Initializing Futuristic Solar System Explorer...');
      
      // Get canvas container
      const container = document.getElementById('canvas-container');
      if (!container) {
        throw new Error('Canvas container not found');
      }

      // Show loading screen
      this.showLoadingScreen();

      // Initialize 3D engine with realistic scales
      console.log('🌌 Starting Realistic 3D Engine...');
      this.engine = new RealisticSolarSystemEngine(container);
      
      // Initialize HUD Manager
      console.log('🎮 Setting up HUD Interface...');
      this.hudManager = new HUDManager(this.engine);
      
      // Initialize Selection System
      console.log('🎯 Setting up Selection System...');
      this.selectionSystem = new SelectionSystem(this.engine, this.hudManager);
      
      // Bind events between systems
      this.bindSystemEvents();
      
      // Wait for engine initialization
      await this.waitForEngineReady();
      
      // Setup additional features
      this.setupAdvancedFeatures();
      
      console.log('✅ Futuristic Solar System Explorer ready!');
      this.isInitialized = true;
      
      // Hide loading screen
      this.hideLoadingScreen();
      
      // Start performance monitoring
      this.startPerformanceMonitoring();
      
      // Show welcome message
      this.showWelcomeMessage();
      
    } catch (error) {
      console.error('❌ Failed to initialize Solar System Explorer:', error);
      this.showErrorMessage(error);
    }
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('hud-loading');
    if (loadingScreen) {
      loadingScreen.classList.remove('hidden');
    }
  }

  hideLoadingScreen() {
    setTimeout(() => {
      const loadingScreen = document.getElementById('hud-loading');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
    }, 1000);
  }

  waitForEngineReady() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Engine initialization timeout'));
      }, 30000); // 30 second timeout

      this.engine.once('loading:complete', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.engine.once('loading:error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      // Update loading progress
      this.engine.on('loading:progress', (data) => {
        this.hudManager.updateLoadingProgress(data.progress, data.text);
      });
    });
  }

  bindSystemEvents() {
    // Engine to HUD events
    this.engine.on('loading:start', () => {
      this.hudManager.showLoading();
    });

    this.engine.on('loading:complete', () => {
      this.hudManager.hideLoading();
    });

    this.engine.on('animation:toggled', (isRunning) => {
      console.log(`Animation ${isRunning ? 'started' : 'paused'}`);
    });

    this.engine.on('scale:changed', (scale) => {
      console.log(`Scale changed to: ${scale}`);
      this.showNotification(`Échelle changée: ${this.getScaleLabel(scale)}`, 'info');
    });

    // Selection System to HUD events
    this.selectionSystem.on('object:selected', (objectData) => {
      this.hudManager.showObjectInfo(objectData);
      this.showNotification(`${objectData.name} sélectionné`, 'success');
    });

    this.selectionSystem.on('object:deselected', () => {
      this.hudManager.hideObjectInfo();
    });

    this.selectionSystem.on('camera:focus', (data) => {
      const modeLabel = this.getFocusModeLabel(data.mode);
      this.showNotification(`Mode caméra: ${modeLabel}`, 'info');
    });

    // HUD to Engine events
    this.hudManager.on('nav:mode-changed', (mode) => {
      this.handleNavigationModeChange(mode);
    });

    this.hudManager.on('view:mode-changed', (view) => {
      this.handleViewModeChange(view);
    });

    this.hudManager.on('orbits:toggled', () => {
      this.engine.setOrbitVisibility(!this.engine.showOrbits);
    });

    this.hudManager.on('labels:toggled', () => {
      this.engine.setLabelsVisibility(!this.engine.showLabels);
    });

    this.hudManager.on('search:select', (data) => {
      this.handleSearchSelection(data);
    });

    this.hudManager.on('object:deselected', () => {
      this.selectionSystem.deselectObject();
    });
  }

  setupAdvancedFeatures() {
    // Setup window resize handler
    window.addEventListener('resize', () => {
      this.engine.onWindowResize();
    });

    // Setup performance monitoring
    this.setupPerformanceMonitoring();

    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Setup mouse wheel zoom limits based on scale
    this.setupZoomLimits();
  }

  setupPerformanceMonitoring() {
    // Monitor FPS and performance
    setInterval(() => {
      const now = performance.now();
      const deltaTime = now - this.stats.lastTime;
      
      if (deltaTime >= 1000) { // Update every second
        this.stats.fps = Math.round((this.stats.frameCount * 1000) / deltaTime);
        this.stats.frameCount = 0;
        this.stats.lastTime = now;
        
        // Update HUD with performance info if in debug mode
        if (this.isDebugMode()) {
          this.updatePerformanceDisplay();
        }
      }
      
      this.stats.frameCount++;
    }, 16); // ~60fps
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Don't interfere if user is typing
      if (event.target.tagName === 'INPUT') return;

      switch (event.code) {
        case 'Digit1':
          this.selectPlanet('mercury');
          break;
        case 'Digit2':
          this.selectPlanet('venus');
          break;
        case 'Digit3':
          this.selectPlanet('earth');
          break;
        case 'Digit4':
          this.selectPlanet('mars');
          break;
        case 'Digit5':
          this.selectPlanet('jupiter');
          break;
        case 'Digit6':
          this.selectPlanet('saturn');
          break;
        case 'Digit7':
          this.selectPlanet('uranus');
          break;
        case 'Digit8':
          this.selectPlanet('neptune');
          break;
        case 'Digit0':
          this.selectSun();
          break;
        case 'KeyO':
          this.engine.setOrbitVisibility(!this.engine.showOrbits);
          break;
        case 'KeyL':
          this.engine.setLabelsVisibility(!this.engine.showLabels);
          break;
        case 'KeyS':
          this.cycleScale();
          break;
        case 'KeyH':
          this.showHelpDialog();
          break;
      }
    });
  }

  setupZoomLimits() {
    // Adjust zoom limits based on current scale
    const updateZoomLimits = () => {
      const scaleInfo = this.engine.getScaleInfo();
      const limits = scaleInfo.factors.cameraLimits;
      
      this.engine.controls.minDistance = limits.minDistance;
      this.engine.controls.maxDistance = limits.maxDistance;
    };

    this.engine.on('scale:changed', updateZoomLimits);
    updateZoomLimits(); // Initial setup
  }

  startPerformanceMonitoring() {
    // Start the main update loop
    const update = () => {
      if (this.isInitialized) {
        // Update HUD coordinates
        this.hudManager.update();
        
        // Update selection system
        this.selectionSystem.update(0.016);
        
        // Update performance stats
        this.stats.frameCount++;
      }
      
      requestAnimationFrame(update);
    };
    
    update();
  }

  // Event Handlers
  handleNavigationModeChange(mode) {
    console.log(`Navigation mode changed to: ${mode}`);
    
    switch (mode) {
      case 'exploration':
        this.showNotification('Mode Exploration activé', 'info');
        break;
      case 'analysis':
        this.showNotification('Mode Analyse IA activé', 'info');
        // TODO: Initialize AI analysis mode
        break;
      case 'data':
        this.showNotification('Mode Données NASA activé', 'info');
        // TODO: Initialize NASA data mode
        break;
    }
  }

  handleViewModeChange(view) {
    console.log(`View mode changed to: ${view}`);
    
    switch (view) {
      case 'overview':
        this.engine.resetView();
        this.showNotification('Vue d\'ensemble', 'info');
        break;
      case 'inner':
        this.focusOnInnerSystem();
        this.showNotification('Système solaire interne', 'info');
        break;
      case 'outer':
        this.focusOnOuterSystem();
        this.showNotification('Système solaire externe', 'info');
        break;
    }
  }

  handleSearchSelection(data) {
    const { type, name } = data;
    
    if (type === 'planet') {
      this.selectPlanet(name);
    } else if (type === 'sun') {
      this.selectSun();
    } else if (type === 'moon') {
      // TODO: Implement moon selection
      this.showNotification(`Sélection de ${name} (lune)`, 'info');
    }
  }

  // Selection Methods
  selectPlanet(planetName) {
    const planet = this.engine.planets.get(planetName);
    if (planet) {
      const objectData = {
        type: 'planet',
        object: planet,
        mesh: planet.mesh,
        data: planet.data,
        name: planet.data.name,
        planetName: planetName
      };
      
      this.selectionSystem.selectObject(objectData);
    }
  }

  selectSun() {
    if (this.engine.sun) {
      const objectData = {
        type: 'sun',
        object: this.engine.sun,
        mesh: this.engine.sun.mesh,
        data: this.engine.sun.data,
        name: this.engine.sun.data.name
      };
      
      this.selectionSystem.selectObject(objectData);
    }
  }

  // View Control Methods
  focusOnInnerSystem() {
    // Focus on the inner solar system (Mercury to Mars)
    const distance = this.engine.currentScale === 'realistic' ? 500 : 300;
    this.engine.camera.position.set(-distance, distance * 0.3, distance * 0.5);
    this.engine.controls.target.set(0, 0, 0);
  }

  focusOnOuterSystem() {
    // Focus on the outer solar system (Jupiter to Neptune)
    const distance = this.engine.currentScale === 'realistic' ? 2000 : 800;
    this.engine.camera.position.set(-distance, distance * 0.2, distance * 0.4);
    this.engine.controls.target.set(0, 0, 0);
  }

  cycleScale() {
    const scales = ['educational', 'semiRealistic', 'realistic'];
    const currentIndex = scales.indexOf(this.engine.currentScale);
    const nextIndex = (currentIndex + 1) % scales.length;
    const nextScale = scales[nextIndex];
    
    this.engine.setScale(nextScale);
  }

  // Utility Methods
  getScaleLabel(scale) {
    const labels = {
      realistic: 'Réaliste (100%)',
      semiRealistic: 'Semi-réaliste',
      educational: 'Éducative (optimisée)'
    };
    return labels[scale] || scale;
  }

  getFocusModeLabel(mode) {
    const labels = {
      normal: 'Normal',
      focus: 'Focus',
      detailed: 'Détaillé'
    };
    return labels[mode] || mode;
  }

  isDebugMode() {
    return new URLSearchParams(window.location.search).has('debug');
  }

  updatePerformanceDisplay() {
    // Update performance display in HUD if debug mode is on
    const perfElement = document.getElementById('performance-display');
    if (perfElement) {
      perfElement.textContent = `FPS: ${this.stats.fps}`;
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `hud-notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">${this.getNotificationIcon(type)}</span>
        <span class="notification-text">${message}</span>
      </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  getNotificationIcon(type) {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || 'ℹ️';
  }

  showWelcomeMessage() {
    setTimeout(() => {
      this.showNotification('Bienvenue dans l\'Explorateur Futuriste du Système Solaire !', 'success');
      
      setTimeout(() => {
        this.showNotification('Utilisez les touches 1-8 pour sélectionner les planètes', 'info');
      }, 2000);
      
      setTimeout(() => {
        this.showNotification('Appuyez sur H pour l\'aide complète', 'info');
      }, 4000);
    }, 1500);
  }

  showHelpDialog() {
    // TODO: Implement help dialog
    this.showNotification('Aide: Touches 1-8 (planètes), 0 (soleil), O (orbites), L (labels), S (échelle)', 'info');
  }

  showErrorMessage(error) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'hud-error-screen';
    errorContainer.innerHTML = `
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <h2>ERREUR SYSTÈME</h2>
        <p>Une erreur critique s'est produite lors de l'initialisation :</p>
        <code>${error.message}</code>
        <button onclick="location.reload()" class="error-retry-btn">
          REDÉMARRER SYSTÈME
        </button>
      </div>
    `;
    
    document.body.appendChild(errorContainer);
  }

  // Public API
  getEngine() {
    return this.engine;
  }

  getHUDManager() {
    return this.hudManager;
  }

  getSelectionSystem() {
    return this.selectionSystem;
  }

  isReady() {
    return this.isInitialized;
  }

  // Cleanup
  destroy() {
    if (this.engine) {
      this.engine.dispose();
    }
    
    if (this.selectionSystem) {
      this.selectionSystem.dispose();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.engine?.onWindowResize);
    
    this.isInitialized = false;
  }
}

// Global app instance
let futuristicApp = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

async function initializeApp() {
  try {
    futuristicApp = new FuturisticSolarSystemApp();
    await futuristicApp.init();
    
    // Make app globally accessible for debugging
    window.futuristicSolarSystemApp = futuristicApp;
    
  } catch (error) {
    console.error('Failed to start Futuristic Solar System App:', error);
  }
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (futuristicApp) {
    futuristicApp.destroy();
  }
});

// Export for module usage
export { FuturisticSolarSystemApp };
