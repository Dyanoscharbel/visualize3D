/**
 * 🌟 LoadingSystem - Système de chargement pour NASA Space App
 */

export class LoadingSystem {
    constructor() {
        this.loadingOverlay = null;
        this.isVisible = false;
        this.currentMessage = '';
        this.fadeTransition = 500;
        console.log('🌟 LoadingSystem initialisé');
    }
    
    init() {
        this.createLoadingOverlay();
        this.setupEventListeners();
        console.log('✅ LoadingSystem prêt');
    }
    
    createLoadingOverlay() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.id = 'loading-overlay';
        
        this.loadingOverlay.innerHTML = `
            <div class="loading-container">
                <div class="section-banner-sun">
                    <div id="star-1">
                        <div class="curved-corner-star">
                            <div id="curved-corner-bottomright"></div>
                            <div id="curved-corner-bottomleft"></div>
                        </div>
                        <div class="curved-corner-star">
                            <div id="curved-corner-topright"></div>
                            <div id="curved-corner-topleft"></div>
                        </div>
                    </div>
                    <div id="star-2">
                        <div class="curved-corner-star">
                            <div id="curved-corner-bottomright"></div>
                            <div id="curved-corner-bottomleft"></div>
                        </div>
                        <div class="curved-corner-star">
                            <div id="curved-corner-topright"></div>
                            <div id="curved-corner-topleft"></div>
                        </div>
                    </div>
                    <div id="star-3">
                        <div class="curved-corner-star">
                            <div id="curved-corner-bottomright"></div>
                            <div id="curved-corner-bottomleft"></div>
                        </div>
                        <div class="curved-corner-star">
                            <div id="curved-corner-topright"></div>
                            <div id="curved-corner-topleft"></div>
                        </div>
                    </div>
                    <div id="star-4">
                        <div class="curved-corner-star">
                            <div id="curved-corner-bottomright"></div>
                            <div id="curved-corner-bottomleft"></div>
                        </div>
                        <div class="curved-corner-star">
                            <div id="curved-corner-topright"></div>
                            <div id="curved-corner-topleft"></div>
                        </div>
                    </div>
                    <div id="star-5">
                        <div class="curved-corner-star">
                            <div id="curved-corner-bottomright"></div>
                            <div id="curved-corner-bottomleft"></div>
                        </div>
                        <div class="curved-corner-star">
                            <div id="curved-corner-topright"></div>
                            <div id="curved-corner-topleft"></div>
                        </div>
                    </div>
                    <div id="star-6">
                        <div class="curved-corner-star">
                            <div id="curved-corner-bottomright"></div>
                            <div id="curved-corner-bottomleft"></div>
                        </div>
                        <div class="curved-corner-star">
                            <div id="curved-corner-topright"></div>
                            <div id="curved-corner-topleft"></div>
                        </div>
                    </div>
                    <div id="star-7">
                        <div class="curved-corner-star">
                            <div id="curved-corner-bottomright"></div>
                            <div id="curved-corner-bottomleft"></div>
                        </div>
                        <div class="curved-corner-star">
                            <div id="curved-corner-topright"></div>
                            <div id="curved-corner-topleft"></div>
                        </div>
                    </div>
                </div>
                <div class="loading-text">
                    <h2 id="loading-title">NASA Space Explorer</h2>
                    <p id="loading-message">Initialisation...</p>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        this.loadingOverlay.style.display = 'none';
        document.body.appendChild(this.loadingOverlay);
        this.loadExistingCSS();
    }
    
    /**
     * Charge le CSS existant depuis loarding.css
     */
    loadExistingCSS() {
        if (document.getElementById('loading-css')) return;
        const link = document.createElement('link');
        link.id = 'loading-css';
        link.rel = 'stylesheet';
        link.href = './js/ui/loarding.css';
        document.head.appendChild(link);
        console.log('🎨 CSS de chargement chargé');
    }
    
    setupEventListeners() {
        window.addEventListener('loading:show', (e) => {
            this.show(e.detail?.message);
        });
        window.addEventListener('loading:hide', () => {
            this.hide();
        });
        window.addEventListener('loading:update', (e) => {
            this.updateMessage(e.detail?.message);
        });
    }
    
    show(message = 'Chargement en cours...') {
        if (this.isVisible) return;
        this.currentMessage = message;
        this.updateMessage(message);
        this.loadingOverlay.style.display = 'flex';
        this.loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            this.loadingOverlay.style.opacity = '1';
            this.isVisible = true;
            console.log(`🌟 Loading affiché: ${message}`);
        }, 10);
    }
    
    hide() {
        if (!this.isVisible) return;
        this.loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            this.loadingOverlay.style.display = 'none';
            this.isVisible = false;
            console.log('🌟 Loading masqué');
        }, this.fadeTransition);
    }
    
    updateMessage(message) {
        const messageElement = document.getElementById('loading-message');
        if (messageElement && message) {
            messageElement.textContent = message;
            this.currentMessage = message;
        }
    }
    
    showSystemLoading(systemType) {
        const messages = {
            solar: 'Loading Solar System...',
            kepler: 'Loading Kepler Exoplanets...',
            transition: 'Transitioning between systems...'
        };
        this.show(messages[systemType] || messages.transition);
    }
    
    get visible() {
        return this.isVisible;
    }
}

export const loadingSystem = new LoadingSystem();

window.showLoading = (message) => loadingSystem.show(message);
window.hideLoading = () => loadingSystem.hide();
window.updateLoadingMessage = (message) => loadingSystem.updateMessage(message);

console.log('📦 LoadingSystem module chargé');
