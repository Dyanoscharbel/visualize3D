export class UIManager {
  constructor(solarSystemEngine) {
    this.engine = solarSystemEngine;
    this.elements = {};
    this.isLoading = true;
    
    this.initializeElements();
    this.setupEventListeners();
    this.bindEngineEvents();
  }

  initializeElements() {
    // Loading screen
    this.elements.loadingScreen = document.getElementById('loading-screen');
    this.elements.loadingProgress = document.getElementById('loading-progress');
    this.elements.loadingText = document.getElementById('loading-text');
    
    // Main UI
    this.elements.sidePanel = document.getElementById('side-panel');
    this.elements.panelContent = document.getElementById('panel-content');
    this.elements.panelClose = document.getElementById('panel-close');
    
    // Controls
    this.elements.orbitSpeed = document.getElementById('orbit-speed');
    this.elements.rotationSpeed = document.getElementById('rotation-speed');
    this.elements.scaleToggles = document.querySelectorAll('[data-scale]');
    this.elements.viewButtons = document.querySelectorAll('[data-view]');
    this.elements.navButtons = document.querySelectorAll('[data-mode]');
    
    // Search
    this.elements.planetSearch = document.getElementById('planet-search');
    this.elements.searchResults = document.getElementById('search-results');
    
    // Header actions
    this.elements.settingsBtn = document.getElementById('settings-btn');
    this.elements.fullscreenBtn = document.getElementById('fullscreen-btn');
  }

  setupEventListeners() {
    // Panel controls
    this.elements.panelClose?.addEventListener('click', () => {
      this.closeSidePanel();
    });

    // Speed controls
    this.elements.orbitSpeed?.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.engine.setAnimationSpeed('orbit', value);
      this.updateSliderValue(e.target, value + 'x');
    });

    this.elements.rotationSpeed?.addEventListener('input', (e) => {
      const value = parseFloat(e.target.value);
      this.engine.setAnimationSpeed('rotation', value);
      this.updateSliderValue(e.target, value + 'x');
    });

    // Scale toggles
    this.elements.scaleToggles.forEach(btn => {
      btn.addEventListener('click', () => {
        const scale = btn.dataset.scale;
        this.setActiveScale(scale);
        this.engine.setScale(scale);
      });
    });

    // View controls
    this.elements.viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        this.setActiveView(view);
        this.handleViewChange(view);
      });
    });

    // Navigation
    this.elements.navButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.setActiveNav(mode);
        this.handleModeChange(mode);
      });
    });

    // Search
    this.elements.planetSearch?.addEventListener('input', (e) => {
      this.handleSearch(e.target.value);
    });

    this.elements.planetSearch?.addEventListener('focus', () => {
      this.elements.searchResults?.classList.add('show');
    });

    this.elements.planetSearch?.addEventListener('blur', () => {
      // Delay to allow click on results
      setTimeout(() => {
        this.elements.searchResults?.classList.remove('show');
      }, 200);
    });

    // Header actions
    this.elements.settingsBtn?.addEventListener('click', () => {
      this.toggleSettings();
    });

    this.elements.fullscreenBtn?.addEventListener('click', () => {
      this.toggleFullscreen();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboard(e);
    });
  }

  bindEngineEvents() {
    // Loading events
    this.engine.on('loading:start', () => {
      this.showLoading();
    });

    this.engine.on('loading:progress', (data) => {
      this.updateLoadingProgress(data.progress, data.text);
    });

    this.engine.on('loading:complete', () => {
      this.hideLoading();
    });

    this.engine.on('loading:error', (error) => {
      this.showError('Erreur de chargement', error.message);
    });

    // Object selection
    this.engine.on('object:selected', (objectData) => {
      this.showObjectInfo(objectData);
    });

    this.engine.on('object:deselected', () => {
      this.closeSidePanel();
    });

    // Animation events
    this.engine.on('animation:toggled', (isRunning) => {
      this.updateAnimationState(isRunning);
    });
  }

  showLoading() {
    this.isLoading = true;
    this.elements.loadingScreen?.classList.remove('hidden');
  }

  updateLoadingProgress(progress, text) {
    if (this.elements.loadingProgress) {
      this.elements.loadingProgress.style.width = progress + '%';
    }
    if (this.elements.loadingText) {
      this.elements.loadingText.textContent = text;
    }
  }

  hideLoading() {
    this.isLoading = false;
    setTimeout(() => {
      this.elements.loadingScreen?.classList.add('hidden');
    }, 500);
  }

  showObjectInfo(objectData) {
    if (!this.elements.panelContent) return;

    const { data, type, name } = objectData;
    
    let content = '';
    
    if (type === 'sun') {
      content = this.generateSunInfo(data);
    } else if (type === 'planet') {
      content = this.generatePlanetInfo(data);
    }
    
    this.elements.panelContent.innerHTML = content;
    this.openSidePanel();
  }

  generateSunInfo(data) {
    return `
      <div class="object-info">
        <div class="object-header">
          <h2>${data.name}</h2>
          <span class="object-type">Étoile</span>
        </div>
        
        <div class="object-stats">
          <div class="stat">
            <label>Diamètre</label>
            <value>${data.diameter.toLocaleString()} km</value>
          </div>
          <div class="stat">
            <label>Masse</label>
            <value>${data.mass.toExponential(2)} kg</value>
          </div>
          <div class="stat">
            <label>Température</label>
            <value>${data.temperature.toLocaleString()} K</value>
          </div>
          <div class="stat">
            <label>Période de rotation</label>
            <value>${data.rotationPeriod} jours</value>
          </div>
        </div>
        
        <div class="object-description">
          <p>${data.description}</p>
        </div>
        
        <div class="object-composition">
          <h3>Composition</h3>
          <div class="composition-chart">
            ${Object.entries(data.composition).map(([element, percentage]) => `
              <div class="composition-item">
                <span class="element">${element}</span>
                <span class="percentage">${percentage}%</span>
                <div class="bar">
                  <div class="fill" style="width: ${percentage}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  generatePlanetInfo(data) {
    const facts = data.facts || [];
    const moons = data.moons || data.majorMoons || [];
    
    return `
      <div class="object-info">
        <div class="object-header">
          <h2>${data.name}</h2>
          <span class="object-type">Planète ${data.type.replace('_', ' ')}</span>
        </div>
        
        <div class="object-stats">
          <div class="stat">
            <label>Diamètre</label>
            <value>${data.diameter.toLocaleString()} km</value>
          </div>
          <div class="stat">
            <label>Distance du Soleil</label>
            <value>${(data.distanceFromSun).toFixed(2)} millions km</value>
          </div>
          <div class="stat">
            <label>Période orbitale</label>
            <value>${data.orbitalPeriod.toFixed(1)} jours</value>
          </div>
          <div class="stat">
            <label>Période de rotation</label>
            <value>${Math.abs(data.rotationPeriod).toFixed(1)} jours</value>
          </div>
          <div class="stat">
            <label>Inclinaison axiale</label>
            <value>${data.axialTilt.toFixed(1)}°</value>
          </div>
          <div class="stat">
            <label>Satellites</label>
            <value>${data.moons || moons.length}</value>
          </div>
        </div>
        
        <div class="object-description">
          <p>${data.description}</p>
        </div>
        
        ${facts.length > 0 ? `
          <div class="object-facts">
            <h3>Faits intéressants</h3>
            <ul>
              ${facts.map(fact => `<li>${fact}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${moons.length > 0 ? `
          <div class="object-moons">
            <h3>Principales lunes</h3>
            <div class="moons-list">
              ${moons.slice(0, 4).map(moon => `
                <div class="moon-item">
                  <strong>${moon.name}</strong>
                  <span>${moon.diameter} km</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        ${data.atmosphere ? `
          <div class="object-atmosphere">
            <h3>Atmosphère</h3>
            ${typeof data.atmosphere.composition === 'object' ? `
              <div class="atmosphere-composition">
                ${Object.entries(data.atmosphere.composition).map(([gas, percentage]) => `
                  <div class="gas-item">
                    <span>${gas}</span>
                    <span>${percentage}%</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p>${data.atmosphere.composition}</p>
            `}
            ${data.atmosphere.pressure ? `
              <p><strong>Pression:</strong> ${data.atmosphere.pressure}</p>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  openSidePanel() {
    this.elements.sidePanel?.classList.add('open');
  }

  closeSidePanel() {
    this.elements.sidePanel?.classList.remove('open');
    this.engine.deselectObject();
  }

  updateSliderValue(slider, value) {
    const valueSpan = slider.parentElement.querySelector('.slider-value');
    if (valueSpan) {
      valueSpan.textContent = value;
    }
  }

  setActiveScale(scale) {
    this.elements.scaleToggles.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scale === scale);
    });
  }

  setActiveView(view) {
    this.elements.viewButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
  }

  setActiveNav(mode) {
    this.elements.navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  handleViewChange(view) {
    switch (view) {
      case 'overview':
        this.engine.resetView();
        break;
      case 'inner':
        // Focus on inner solar system
        this.focusOnRegion(0, 250);
        break;
      case 'outer':
        // Focus on outer solar system
        this.focusOnRegion(250, 1000);
        break;
    }
  }

  focusOnRegion(minDistance, maxDistance) {
    // This would need to be implemented in the engine
    // For now, just reset view
    this.engine.resetView();
  }

  handleModeChange(mode) {
    // Handle different application modes
    console.log('Mode changed to:', mode);
    // This will be expanded for AI analysis and NASA data modes
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.elements.searchResults.innerHTML = '';
      return;
    }

    const results = this.engine.searchObjects(query);
    
    const resultsHTML = results.map(result => `
      <div class="search-result" data-type="${result.type}" data-name="${result.name}">
        <span class="result-name">${result.displayName}</span>
        <span class="result-type">${result.type}</span>
      </div>
    `).join('');

    this.elements.searchResults.innerHTML = resultsHTML;

    // Add click handlers to results
    this.elements.searchResults.querySelectorAll('.search-result').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        const name = item.dataset.name;
        
        if (type === 'planet') {
          const planet = this.engine.planets.get(name);
          if (planet) {
            this.engine.selectObject({
              object: planet.mesh,
              data: planet.data,
              type: 'planet',
              name: name
            });
          }
        }
        
        this.elements.planetSearch.value = '';
        this.elements.searchResults.innerHTML = '';
      });
    });
  }

  handleKeyboard(e) {
    if (this.isLoading) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.engine.toggleAnimation();
        break;
      case 'KeyF':
        if (e.ctrlKey) {
          e.preventDefault();
          this.elements.planetSearch?.focus();
        }
        break;
      case 'Escape':
        this.closeSidePanel();
        break;
    }
  }

  toggleSettings() {
    // TODO: Implement settings panel
    console.log('Settings toggled');
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  updateAnimationState(isRunning) {
    // Update UI to reflect animation state
    // Could add play/pause button visual feedback
  }

  showError(title, message) {
    // TODO: Implement error modal
    console.error(title, message);
    alert(`${title}: ${message}`);
  }

  showNotification(message, type = 'info') {
    // TODO: Implement notification system
    console.log(`${type}: ${message}`);
  }
}
