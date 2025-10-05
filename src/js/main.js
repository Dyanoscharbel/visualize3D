import { SolarSystemEngine } from './core/SolarSystemEngine.js';
import { UIManager } from './ui/UIManager.js';
import { RouteHandler } from './utils/RouteHandler.js';

class SolarSystemApp {
  constructor() {
    this.engine = null;
    this.ui = null;
    this.routeHandler = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      console.log('🌌 Initializing Solar System Explorer...');
      
      // Get canvas container
      const container = document.getElementById('canvas-container');
      if (!container) {
        throw new Error('Canvas container not found');
      }

      // Initialize 3D engine FIRST
      console.log('🚀 Starting 3D engine...');
      this.engine = new SolarSystemEngine(container);
      
      // Initialize UI manager
      console.log('🎨 Setting up UI...');
      this.ui = new UIManager(this.engine);
      
      // Wait for engine initialization
      await this.waitForEngineReady();
      
      // NOW Initialize route handler to detect URL
      console.log('🛣️ Setting up route handler...');
      this.routeHandler = new RouteHandler();
      this.routeHandler.init();
      
      // Check if we're loading a Kepler system
      const currentRoute = this.routeHandler.getCurrentRoute();
      
      if (currentRoute.type === 'kepler-system') {
        console.log(`🪐 Mode Exoplanète: ${currentRoute.keplerName}`);
        console.log(`   Le Soleil sera automatiquement mis à jour avec les données de l'étoile`);
        // Le RouteHandler va appeler updateSolarSystemStar() automatiquement
      }
      
      console.log('✅ Solar System Explorer ready!');
      this.isInitialized = true;
      
      // Show welcome message
      this.showWelcomeMessage();
      
    } catch (error) {
      console.error('❌ Failed to initialize Solar System Explorer:', error);
      this.showErrorMessage(error);
    }
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
    });
  }

  showWelcomeMessage() {
    // Show a subtle welcome notification
    if (this.ui) {
      setTimeout(() => {
        this.ui.showNotification(
          'Bienvenue dans l\'explorateur du système solaire ! Cliquez sur une planète pour en savoir plus.',
          'success'
        );
      }, 1000);
    }
  }

  showErrorMessage(error) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-screen';
    errorContainer.innerHTML = `
      <div class="error-content">
        <h2>❌ Erreur d'initialisation</h2>
        <p>Une erreur s'est produite lors du chargement de l'application :</p>
        <code>${error.message}</code>
        <button onclick="location.reload()" class="retry-btn">
          Réessayer
        </button>
      </div>
    `;
    
    document.body.appendChild(errorContainer);
  }

  // Public API methods for external access
  getEngine() {
    return this.engine;
  }

  getUI() {
    return this.ui;
  }

  getRouteHandler() {
    return this.routeHandler;
  }

  isReady() {
    return this.isInitialized;
  }

  // Cleanup method
  destroy() {
    if (this.engine) {
      this.engine.dispose();
    }
    
    if (this.ui) {
      // UI cleanup would go here
    }
    
    this.isInitialized = false;
  }
}

// Global app instance
let app = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

async function initializeApp() {
  try {
    app = new SolarSystemApp();
    await app.init();
    
    // Make app globally accessible for debugging
    window.solarSystemApp = app;
    
  } catch (error) {
    console.error('Failed to start application:', error);
  }
}

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (app) {
    app.destroy();
  }
});

// Handle window resize
window.addEventListener('resize', () => {
  if (app && app.isReady()) {
    // Engine handles its own resize events
  }
});

// Export for module usage
export { SolarSystemApp };
