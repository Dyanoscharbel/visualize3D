import { EventEmitter } from '../utils/EventEmitter.js';

export class HUDManager extends EventEmitter {
  constructor(engine) {
    super();
    
    this.engine = engine;
    this.elements = {};
    this.isRightPanelOpen = false;
    this.currentObject = null;
    
    this.initializeElements();
    this.setupEventListeners();
  }

  initializeElements() {
    // HUD Elements
    this.elements.loadingScreen = document.getElementById('hud-loading');
    this.elements.loadingFill = document.getElementById('loading-fill');
    this.elements.loadingPercentage = document.getElementById('loading-percentage');
    this.elements.loadingStatus = document.getElementById('loading-status');
    
    // Panels
    this.elements.rightPanel = document.getElementById('hud-right-panel');
    this.elements.objectInfoContent = document.getElementById('object-info-content');
    this.elements.dataGraphs = document.getElementById('data-graphs');
    
    // Controls
    this.elements.orbitSpeed = document.getElementById('orbit-speed');
    this.elements.rotationSpeed = document.getElementById('rotation-speed');
    this.elements.scaleToggle = document.getElementById('scale-toggle');
    
    // Navigation
    this.elements.navModes = document.querySelectorAll('.nav-mode');
    this.elements.viewModes = document.querySelectorAll('.view-mode-btn');
    
    // Actions
    this.elements.pauseBtn = document.getElementById('pause-btn');
    this.elements.resetBtn = document.getElementById('reset-btn');
    this.elements.fullscreenBtn = document.getElementById('fullscreen-btn');
    this.elements.closeInfo = document.getElementById('close-info');
    
    // Toggles
    this.elements.orbitToggle = document.getElementById('orbit-toggle');
    this.elements.labelsToggle = document.getElementById('labels-toggle');
    
    // Search
    this.elements.commandInput = document.getElementById('command-input');
    this.elements.searchResults = document.getElementById('search-results');
    
    // Coordinates
    this.elements.camX = document.getElementById('cam-x');
    this.elements.camY = document.getElementById('cam-y');
    this.elements.camZ = document.getElementById('cam-z');
    this.elements.camZoom = document.getElementById('cam-zoom');
  }

  setupEventListeners() {
    // Controls
    this.elements.orbitSpeed?.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.engine.setAnimationSpeed('orbit', value);
      this.updateSliderValue(e.target, value.toFixed(1) + 'x');
    });

    this.elements.rotationSpeed?.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.engine.setAnimationSpeed('rotation', value);
      this.updateSliderValue(e.target, value.toFixed(1) + 'x');
    });

    this.elements.scaleToggle?.addEventListener('change', (e) => {
      const scale = e.target.checked ? 'educational' : 'realistic';
      this.engine.setScale(scale);
      this.updateScaleToggle(e.target, scale);
    });

    // Navigation modes
    this.elements.navModes.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setActiveNavMode(btn.dataset.mode);
      });
    });

    // View modes
    this.elements.viewModes.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setActiveViewMode(btn.dataset.view);
      });
    });

    // Action buttons
    this.elements.pauseBtn?.addEventListener('click', () => {
      this.toggleAnimation();
    });

    this.elements.resetBtn?.addEventListener('click', () => {
      this.resetView();
    });

    this.elements.fullscreenBtn?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    this.elements.closeInfo?.addEventListener('click', () => {
      this.closeRightPanel();
    });

    // Toggles
    this.elements.orbitToggle?.addEventListener('click', () => {
      this.toggleOrbits();
    });

    this.elements.labelsToggle?.addEventListener('click', () => {
      this.toggleLabels();
    });

    // Search
    this.elements.commandInput?.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    this.elements.commandInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.executeCommand(e.target.value);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  // Loading Management
  showLoading() {
    this.elements.loadingScreen?.classList.remove('hidden');
  }

  updateLoadingProgress(progress, status) {
    if (this.elements.loadingFill) {
      this.elements.loadingFill.style.width = progress + '%';
    }
    if (this.elements.loadingPercentage) {
      this.elements.loadingPercentage.textContent = Math.round(progress) + '%';
    }
    if (this.elements.loadingStatus) {
      this.elements.loadingStatus.textContent = status;
    }
  }

  hideLoading() {
    setTimeout(() => {
      this.elements.loadingScreen?.classList.add('hidden');
    }, 500);
  }

  // Object Information Display
  showObjectInfo(objectData) {
    this.currentObject = objectData;
    
    const content = this.generateDetailedObjectInfo(objectData);
    if (this.elements.objectInfoContent) {
      this.elements.objectInfoContent.innerHTML = content;
    }
    
    this.openRightPanel();
    this.generateDataGraphs(objectData);
  }

  generateDetailedObjectInfo(objectData) {
    const { data, type, name, parentName } = objectData;
    
    return `
      <div class="detailed-object-info">
        ${this.generateInfoHeader(data, type, parentName)}
        ${this.generatePhysicalData(data, type)}
        ${this.generateOrbitalData(data, type)}
        ${data.atmosphere ? this.generateAtmosphereData(data.atmosphere) : ''}
        ${data.composition ? this.generateCompositionData(data.composition) : ''}
        ${data.facts ? this.generateFactsList(data.facts) : ''}
        ${this.generateMoonsData(data, type)}
      </div>
    `;
  }

  generateInfoHeader(data, type, parentName) {
    const icons = {
      sun: '☀️',
      planet: '🪐',
      moon: '🌙'
    };

    return `
      <div class="info-header">
        <div class="info-icon">${icons[type] || '◉'}</div>
        <div class="info-title">
          <div class="info-name">${data.name}</div>
          <div class="info-type">${this.getObjectTypeLabel(type, data.type)}</div>
          ${parentName ? `<div class="info-parent">Satellite de ${parentName}</div>` : ''}
        </div>
      </div>
    `;
  }

  generatePhysicalData(data, type) {
    const earthDiameter = 12756; // km
    const earthMass = 5.9724e24; // kg
    
    return `
      <div class="data-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">📏</span>
            CARACTÉRISTIQUES PHYSIQUES
          </div>
        </div>
        <div class="section-content">
          <div class="physical-data">
            <div class="data-item">
              <div class="data-label">Diamètre</div>
              <div class="data-value">
                ${data.diameter?.toLocaleString() || 'N/A'}
                <span class="data-unit">km</span>
              </div>
              ${data.diameter ? `<div class="data-comparison">${(data.diameter / earthDiameter * 100).toFixed(1)}% de la Terre</div>` : ''}
            </div>
            
            ${data.mass ? `
              <div class="data-item">
                <div class="data-label">Masse</div>
                <div class="data-value">
                  ${data.mass.toExponential(2)}
                  <span class="data-unit">kg</span>
                </div>
                <div class="data-comparison">${(data.mass / earthMass).toFixed(2)}x la Terre</div>
              </div>
            ` : ''}
            
            ${data.surfaceGravity ? `
              <div class="data-item">
                <div class="data-label">Gravité</div>
                <div class="data-value">
                  ${data.surfaceGravity.toFixed(2)}
                  <span class="data-unit">m/s²</span>
                </div>
                <div class="data-comparison">${(data.surfaceGravity / 9.807 * 100).toFixed(0)}% de la Terre</div>
              </div>
            ` : ''}
            
            ${data.escapeVelocity ? `
              <div class="data-item">
                <div class="data-label">Vitesse d'évasion</div>
                <div class="data-value">
                  ${data.escapeVelocity.toFixed(2)}
                  <span class="data-unit">km/s</span>
                </div>
                <div class="data-comparison">${(data.escapeVelocity / 11.19 * 100).toFixed(0)}% de la Terre</div>
              </div>
            ` : ''}
            
            ${data.temperature ? `
              <div class="data-item">
                <div class="data-label">Température</div>
                <div class="data-value">
                  ${typeof data.temperature === 'object' ? 
                    (data.temperature.average || data.temperature.surface || data.temperature.cloudTop) : 
                    data.temperature}
                  <span class="data-unit">°C</span>
                </div>
                ${data.temperature.min && data.temperature.max ? 
                  `<div class="data-comparison">${data.temperature.min}°C à ${data.temperature.max}°C</div>` : ''}
              </div>
            ` : ''}
            
            ${data.density ? `
              <div class="data-item">
                <div class="data-label">Densité</div>
                <div class="data-value">
                  ${data.density.toFixed(2)}
                  <span class="data-unit">g/cm³</span>
                </div>
                <div class="data-comparison">${data.density < 1 ? 'Moins dense que l\'eau' : 'Plus dense que l\'eau'}</div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  generateOrbitalData(data, type) {
    if (type === 'sun') return '';
    
    return `
      <div class="data-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">🔄</span>
            DONNÉES ORBITALES
          </div>
        </div>
        <div class="section-content">
          <div class="orbital-data">
            ${data.distanceFromSun ? `
              <div class="orbital-item">
                <div class="data-label">Distance du Soleil</div>
                <div class="data-value">${data.distanceFromSun.toFixed(2)} <span class="data-unit">millions km</span></div>
              </div>
            ` : ''}
            
            ${data.distanceFromPlanet ? `
              <div class="orbital-item">
                <div class="data-label">Distance de la planète</div>
                <div class="data-value">${data.distanceFromPlanet.toLocaleString()} <span class="data-unit">km</span></div>
              </div>
            ` : ''}
            
            ${data.orbitalPeriod ? `
              <div class="orbital-item">
                <div class="data-label">Période orbitale</div>
                <div class="data-value">${data.orbitalPeriod.toFixed(1)} <span class="data-unit">jours terrestres</span></div>
              </div>
            ` : ''}
            
            ${data.rotationPeriod ? `
              <div class="orbital-item">
                <div class="data-label">Période de rotation</div>
                <div class="data-value">${Math.abs(data.rotationPeriod).toFixed(1)} <span class="data-unit">jours terrestres</span></div>
              </div>
            ` : ''}
            
            ${data.axialTilt ? `
              <div class="orbital-item">
                <div class="data-label">Inclinaison axiale</div>
                <div class="data-value">${data.axialTilt.toFixed(1)} <span class="data-unit">degrés</span></div>
              </div>
            ` : ''}
            
            ${data.eccentricity ? `
              <div class="orbital-item">
                <div class="data-label">Excentricité</div>
                <div class="data-value">${data.eccentricity.toFixed(4)}</div>
              </div>
            ` : ''}
            
            ${data.orbitalVelocity ? `
              <div class="orbital-item">
                <div class="data-label">Vitesse orbitale</div>
                <div class="data-value">${data.orbitalVelocity.toFixed(2)} <span class="data-unit">km/s</span></div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  generateAtmosphereData(atmosphere) {
    return `
      <div class="data-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">🌬️</span>
            ATMOSPHÈRE
          </div>
        </div>
        <div class="section-content">
          ${typeof atmosphere.composition === 'object' ? `
            <div class="composition-chart">
              ${Object.entries(atmosphere.composition).map(([gas, percentage]) => `
                <div class="composition-item">
                  <div class="composition-color" style="background: ${this.getGasColor(gas)}"></div>
                  <div class="composition-name">${this.getGasName(gas)}</div>
                  <div class="composition-percentage">${percentage}%</div>
                </div>
                <div class="composition-bar">
                  <div class="composition-fill" style="width: ${percentage}%; background: ${this.getGasColor(gas)}"></div>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="color: var(--hud-secondary); font-family: var(--font-data);">${atmosphere.composition}</p>
          `}
          
          ${atmosphere.pressure ? `
            <div style="margin-top: 15px; padding: 10px; background: var(--hud-bg-tertiary); border-radius: 6px;">
              <div class="data-label">PRESSION ATMOSPHÉRIQUE</div>
              <div class="data-value" style="margin-top: 5px;">${atmosphere.pressure}</div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateCompositionData(composition) {
    return `
      <div class="data-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">⚛️</span>
            COMPOSITION
          </div>
        </div>
        <div class="section-content">
          <div class="composition-chart">
            ${Object.entries(composition).map(([element, percentage]) => `
              <div class="composition-item">
                <div class="composition-color" style="background: ${this.getElementColor(element)}"></div>
                <div class="composition-name">${element}</div>
                <div class="composition-percentage">${percentage}%</div>
              </div>
              <div class="composition-bar">
                <div class="composition-fill" style="width: ${percentage}%; background: ${this.getElementColor(element)}"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  generateFactsList(facts) {
    return `
      <div class="data-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">💡</span>
            FAITS INTÉRESSANTS
          </div>
        </div>
        <div class="section-content">
          <div class="facts-list">
            ${facts.map(fact => `
              <div class="fact-item">
                <div class="fact-icon">→</div>
                <div class="fact-text">${fact}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  generateMoonsData(data, type) {
    const moons = data.moons || data.majorMoons;
    if (!moons || moons.length === 0) return '';
    
    return `
      <div class="data-section">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">🌙</span>
            SATELLITES (${moons.length})
          </div>
        </div>
        <div class="section-content">
          <div class="moons-grid">
            ${moons.slice(0, 8).map(moon => `
              <div class="moon-card" data-moon="${moon.name}">
                <div class="moon-name">${moon.name}</div>
                <div class="moon-size">${moon.diameter} km</div>
              </div>
            `).join('')}
          </div>
          ${moons.length > 8 ? `
            <div style="text-align: center; margin-top: 10px; color: var(--hud-secondary); font-size: 0.8rem;">
              ... et ${moons.length - 8} autres satellites
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  generateDataGraphs(objectData) {
    if (!this.elements.dataGraphs) return;
    
    // Placeholder pour les graphiques de données
    this.elements.dataGraphs.innerHTML = `
      <div class="data-graph">
        <div class="graph-grid"></div>
        <div class="graph-line" style="height: ${Math.random() * 80 + 20}px;"></div>
      </div>
      <div style="text-align: center; margin-top: 10px; color: var(--hud-secondary); font-size: 0.8rem;">
        Graphiques de données pour ${objectData.name}
      </div>
    `;
  }

  // Helper functions
  getObjectTypeLabel(type, subType) {
    switch (type) {
      case 'sun': return 'ÉTOILE';
      case 'planet':
        switch (subType) {
          case 'terrestrial': return 'PLANÈTE TELLURIQUE';
          case 'gas_giant': return 'GÉANTE GAZEUSE';
          case 'ice_giant': return 'GÉANTE DE GLACE';
          default: return 'PLANÈTE';
        }
      case 'moon': return 'SATELLITE NATUREL';
      default: return 'OBJET CÉLESTE';
    }
  }

  getGasColor(gas) {
    const colors = {
      hydrogen: '#ff6b6b',
      helium: '#4ecdc4',
      nitrogen: '#45b7d1',
      oxygen: '#96ceb4',
      co2: '#ffeaa7',
      methane: '#dda0dd',
      ammonia: '#98d8c8'
    };
    return colors[gas.toLowerCase()] || '#00ffff';
  }

  getGasName(gas) {
    const names = {
      hydrogen: 'Hydrogène',
      helium: 'Hélium',
      nitrogen: 'Azote',
      oxygen: 'Oxygène',
      co2: 'Dioxyde de carbone',
      methane: 'Méthane',
      ammonia: 'Ammoniac',
      argon: 'Argon',
      so2: 'Dioxyde de soufre',
      h2o: 'Vapeur d\'eau'
    };
    return names[gas.toLowerCase()] || gas;
  }

  getElementColor(element) {
    const colors = {
      hydrogen: '#ff6b6b',
      helium: '#4ecdc4',
      oxygen: '#96ceb4',
      carbon: '#74b9ff',
      iron: '#fd79a8',
      other: '#fdcb6e'
    };
    return colors[element.toLowerCase()] || '#00ffff';
  }

  updateSliderValue(slider, value) {
    const valueDisplay = slider.parentElement.querySelector('.slider-value');
    if (valueDisplay) {
      valueDisplay.textContent = value;
    }
  }

  updateScaleToggle(toggle, scale) {
    const text = toggle.parentElement.querySelector('.switch-text');
    if (text) {
      text.textContent = scale === 'educational' ? 'OPTIMISÉE' : 'RÉALISTE';
    }
  }

  // Panel Management
  openRightPanel() {
    this.elements.rightPanel?.classList.add('open');
    this.isRightPanelOpen = true;
  }

  closeRightPanel() {
    this.elements.rightPanel?.classList.remove('open');
    this.isRightPanelOpen = false;
    this.currentObject = null;
    this.emit('object:deselected');
  }

  hideObjectInfo() {
    this.closeRightPanel();
  }

  // Navigation and Controls
  setActiveNavMode(mode) {
    this.elements.navModes.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    this.emit('nav:mode-changed', mode);
  }

  setActiveViewMode(view) {
    this.elements.viewModes.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    this.emit('view:mode-changed', view);
  }

  toggleAnimation() {
    this.engine.toggleAnimation();
    const icon = this.elements.pauseBtn?.querySelector('.btn-icon');
    if (icon) {
      icon.textContent = this.engine.isRunning ? '⏸' : '▶';
    }
  }

  resetView() {
    this.engine.resetView();
    this.closeRightPanel();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  toggleOrbits() {
    this.elements.orbitToggle?.classList.toggle('active');
    // Implement orbit visibility toggle
    this.emit('orbits:toggled');
  }

  toggleLabels() {
    this.elements.labelsToggle?.classList.toggle('active');
    // Implement labels visibility toggle
    this.emit('labels:toggled');
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.elements.searchResults.innerHTML = '';
      return;
    }

    const results = this.engine.searchObjects(query);
    this.displaySearchResults(results);
  }

  displaySearchResults(results) {
    if (!this.elements.searchResults) return;
    
    const html = results.slice(0, 5).map(result => `
      <div class="search-result" data-type="${result.type}" data-name="${result.name}">
        <span class="result-name">${result.displayName}</span>
        <span class="result-type">${result.type}</span>
      </div>
    `).join('');
    
    this.elements.searchResults.innerHTML = html;
    
    // Add click handlers
    this.elements.searchResults.querySelectorAll('.search-result').forEach(item => {
      item.addEventListener('click', () => {
        this.selectSearchResult(item.dataset.type, item.dataset.name);
      });
    });
  }

  selectSearchResult(type, name) {
    this.emit('search:select', { type, name });
    this.elements.commandInput.value = '';
    this.elements.searchResults.innerHTML = '';
  }

  executeCommand(command) {
    // Implement command execution
    console.log('Executing command:', command);
  }

  handleKeyboard(event) {
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.toggleAnimation();
        break;
      case 'KeyR':
        this.resetView();
        break;
      case 'Escape':
        this.closeRightPanel();
        break;
      case 'KeyF':
        if (event.ctrlKey) {
          event.preventDefault();
          this.elements.commandInput?.focus();
        }
        break;
    }
  }

  // Update coordinates display
  updateCoordinates(camera) {
    if (this.elements.camX) this.elements.camX.textContent = camera.position.x.toFixed(2);
    if (this.elements.camY) this.elements.camY.textContent = camera.position.y.toFixed(2);
    if (this.elements.camZ) this.elements.camZ.textContent = camera.position.z.toFixed(2);
    
    const distance = camera.position.length();
    if (this.elements.camZoom) this.elements.camZoom.textContent = (distance / 100).toFixed(1) + 'x';
  }

  // Update method called from main loop
  update() {
    if (this.engine.camera) {
      this.updateCoordinates(this.engine.camera);
    }
  }
}
