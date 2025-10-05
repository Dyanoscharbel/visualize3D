/**
 * 🌟 Loading Screen Manager
 * Gère l'affichage de l'écran de chargement avec animation d'étoiles
 */

export class LoadingScreenManager {
    constructor() {
        this.loadingScreen = null;
        this.isVisible = false;
        this.loadingMessages = [
            "🌌 Initialisation du système solaire...",
            "🪐 Chargement des planètes...",
            "⭐ Génération des orbites...",
            "🌟 Configuration de l'éclairage...",
            "🚀 Préparation de l'exploration...",
            "🌍 Création des exoplanètes...",
            "🔭 Ajustement des télescopes...",
            "✨ Finalisation de l'univers..."
        ];
        this.currentMessageIndex = 0;
        this.messageInterval = null;
        
        this.createLoadingScreen();
    }

    /**
     * Crée l'écran de chargement
     */
    createLoadingScreen() {
        // Créer le conteneur principal
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.id = 'loading-screen';
        this.loadingScreen.className = 'loading-screen';
        
        // HTML de l'écran de chargement
        this.loadingScreen.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-content">
                    <!-- Animation du soleil et des étoiles -->
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

                    <!-- Texte de chargement -->
                    <div class="loading-text">
                        <h1 class="loading-title">NASA Space Explorer</h1>
                        <p class="loading-message" id="loading-message">${this.loadingMessages[0]}</p>
                        <div class="loading-progress">
                            <div class="loading-bar">
                                <div class="loading-bar-fill" id="loading-bar-fill"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter à la page
        document.body.appendChild(this.loadingScreen);
        
        // Masquer par défaut
        this.loadingScreen.style.display = 'none';
    }

    /**
     * Affiche l'écran de chargement
     * @param {number} duration - Durée minimale d'affichage en ms (optionnel)
     */
    show(duration = null) {
        if (this.isVisible) return;
        
        console.log('🌟 Affichage de l\'écran de chargement');
        this.isVisible = true;
        this.loadingScreen.style.display = 'flex';
        
        // Forcer le reflow pour que l'animation CSS fonctionne
        this.loadingScreen.offsetHeight;
        
        // Démarrer l'animation des messages
        this.startMessageAnimation();
        
        // Si une durée est spécifiée, masquer automatiquement après
        if (duration) {
            setTimeout(() => {
                this.hide();
            }, duration);
        }
    }

    /**
     * Masque l'écran de chargement
     */
    hide() {
        if (!this.isVisible) return;
        
        console.log('🌟 Masquage de l\'écran de chargement');
        this.isVisible = false;
        
        // Arrêter l'animation des messages
        this.stopMessageAnimation();
        
        // Animation de disparition
        this.loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.loadingScreen.style.opacity = '1';
        }, 500);
    }

    /**
     * Démarre l'animation des messages de chargement
     */
    startMessageAnimation() {
        this.currentMessageIndex = 0;
        const messageElement = document.getElementById('loading-message');
        const progressBar = document.getElementById('loading-bar-fill');
        
        this.messageInterval = setInterval(() => {
            this.currentMessageIndex = (this.currentMessageIndex + 1) % this.loadingMessages.length;
            
            if (messageElement) {
                messageElement.textContent = this.loadingMessages[this.currentMessageIndex];
            }
            
            // Mettre à jour la barre de progression
            if (progressBar) {
                const progress = ((this.currentMessageIndex + 1) / this.loadingMessages.length) * 100;
                progressBar.style.width = `${progress}%`;
            }
        }, 1000);
    }

    /**
     * Arrête l'animation des messages
     */
    stopMessageAnimation() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
            this.messageInterval = null;
        }
    }

    /**
     * Met à jour le message de chargement
     * @param {string} message - Nouveau message
     */
    updateMessage(message) {
        const messageElement = document.getElementById('loading-message');
        if (messageElement) {
            messageElement.textContent = message;
        }
    }

    /**
     * Met à jour la progression
     * @param {number} progress - Progression en pourcentage (0-100)
     */
    updateProgress(progress) {
        const progressBar = document.getElementById('loading-bar-fill');
        if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
    }

    /**
     * Vérifie si l'écran de chargement est visible
     */
    isShowing() {
        return this.isVisible;
    }
}

// Créer une instance globale
window.loadingScreen = new LoadingScreenManager();
