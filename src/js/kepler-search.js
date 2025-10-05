// ===== SYSTÈME DE RECHERCHE RAPIDE CTRL+K =====

class KeplerSearchSystem {
    constructor() {
        this.isVisible = false;
        this.selectedIndex = -1;
        this.suggestions = [];
        
        // Available systems (Solar System + Kepler)
        this.keplerSystems = [
            'Solar System', // ⭐ Solar System first
            'Kepler-11', 'Kepler-90', 'Kepler-186', 'Kepler-442', 'Kepler-452',
            'Kepler-20', 'Kepler-62', 'Kepler-444', 'Kepler-296', 'Kepler-438',
            'Kepler-283', 'Kepler-1649', 'Kepler-1411', 'Kepler-257', 'Kepler-1638',
            'Kepler-1544', 'Kepler-1552', 'Kepler-395', 'Kepler-28'
        ];
        
        this.init();
    }
    
    init() {
        this.createHTML();
        this.bindEvents();
        this.showHelpPopup();
    }
    
    createHTML() {
        // Popup d'aide
        const helpPopup = document.createElement('div');
        helpPopup.className = 'help-popup';
        helpPopup.id = 'help-popup';
        helpPopup.innerHTML = `
            <button class="close-btn" onclick="this.parentElement.remove()">×</button>
            <div class="help-title">
                Quick Navigation
            </div>
            <div class="help-text">
                Quickly search for a Kepler system
            </div>
            <div class="help-text">
                Press <span class="help-shortcut">Ctrl + K</span>
            </div>
        `;
        
        // Overlay de recherche
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.id = 'search-overlay';
        searchOverlay.innerHTML = `
            <div class="search-container" style="
                width: 480px;
                max-width: 85vw;
                margin: 20px auto 0;
                background: linear-gradient(145deg, rgba(5, 15, 35, 0.98) 0%, rgba(10, 25, 50, 0.95) 50%, rgba(0, 20, 40, 0.92) 100%);
                border: 2px solid #215887;
                border-radius: 16px;
                
                overflow: hidden;
                font-family: 'Rajdhani', sans-serif;
            ">
                <!-- Header moderne avec gradient -->
                <div class="search-header" style="
                    background: #215887;
                    padding: 20px 24px;
                    color: white;
                    font-weight: 700;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                ">
                   
                    <span>Kepler System Search</span>
                </div>
                
                <div class="search-body" style="padding: 24px;">
                    <!-- Input de recherche moderne -->
                    <div class="search-input-group" style="
                        position: relative;
                        margin-bottom: 20px;
                    ">
                        <input 
                            type="text" 
                            class="search-input" 
                            id="search-input"
                            placeholder="Type system name (ex: Kepler-11, Kepler-442...)"
                            autocomplete="off"
                            style="
                                width: 100%;
                                padding: 16px 20px 16px 50px;
                                background: rgba(0, 20, 40, 0.6);
                                border: 2px solid #215887;
                                border-radius: 12px;
                                color: #FFFFFF;
                                font-family: 'Rajdhani', sans-serif;
                                font-size: 16px;
                                font-weight: 500;
                                outline: none;
                                box-shadow: none;
                                transition: all 0.3s ease;
                            "
                        >
                        
                    </div>
                    
                    <!-- Suggestions avec style moderne -->
                    <div class="search-suggestions" id="search-suggestions" style="
                        max-height: 300px;
                        overflow-y: auto;
                        margin-bottom: 20px;
                        border-radius: 12px;
                        background: rgba(0, 20, 40, 0.3);
                        border: 1px solid rgba(0, 255, 255, 0.1);
                    "></div>
                </div>
            </div>
        `;
        
        // Ajouter les éléments au DOM
        document.body.appendChild(helpPopup);
        document.body.appendChild(searchOverlay);
        
        // Références
        this.helpPopup = helpPopup;
        this.searchOverlay = searchOverlay;
        this.searchInput = document.getElementById('search-input');
        this.searchSuggestions = document.getElementById('search-suggestions');
    }
    
    bindEvents() {
        // Ctrl+K pour ouvrir la recherche
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.showSearch();
            }
            
            if (this.isVisible) {
                if (e.key === 'Escape') {
                    this.hideSearch();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.selectNext();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.selectPrevious();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selectCurrent();
                }
            }
        });
        
        // Clic sur l'overlay pour fermer
        this.searchOverlay.addEventListener('click', (e) => {
            if (e.target === this.searchOverlay) {
                this.hideSearch();
            }
        });
        
        // Input de recherche
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Focus sur clic dans l'input
        this.searchInput.addEventListener('click', () => {
            this.searchInput.focus();
        });
        
        // Clic sur le popup d'aide pour l'ouvrir
        this.helpPopup.addEventListener('click', (e) => {
            if (!e.target.classList.contains('close-btn')) {
                this.showSearch();
            }
        });
    }
    
    showHelpPopup() {
        // Afficher le popup d'aide au chargement
        setTimeout(() => {
            if (this.helpPopup && this.helpPopup.parentElement) {
                this.helpPopup.style.display = 'block';
                
                // Auto-masquer après 10 secondes
                setTimeout(() => {
                    if (this.helpPopup && this.helpPopup.parentElement) {
                        this.helpPopup.classList.add('fade-out');
                        setTimeout(() => {
                            if (this.helpPopup && this.helpPopup.parentElement) {
                                this.helpPopup.remove();
                            }
                        }, 300);
                    }
                }, 10000);
            }
        }, 2000); // Attendre 2 secondes après le chargement
    }
    
    showSearch() {
        this.isVisible = true;
        this.searchOverlay.classList.add('active');
        
        // Focus avec délai pour s'assurer que l'overlay est affiché
        setTimeout(() => {
            this.searchInput.focus();
            this.searchInput.select(); // Sélectionner tout le texte s'il y en a
        }, 100);
        
        this.searchInput.value = '';
        this.selectedIndex = -1;
        this.showSuggestions(this.keplerSystems.slice(0, 8)); // Afficher les premiers systèmes
        
        // Masquer le popup d'aide si visible
        if (this.helpPopup && this.helpPopup.parentElement) {
            this.helpPopup.style.display = 'none';
        }
    }
    
    hideSearch() {
        this.isVisible = false;
        this.searchOverlay.classList.remove('active');
        this.selectedIndex = -1;
    }
    
    handleSearch(query) {
        if (!query.trim()) {
            this.showSuggestions(this.keplerSystems.slice(0, 8));
            return;
        }
        
        // Filtrer les suggestions (avec alias pour le système solaire)
        const queryLower = query.toLowerCase();
        const filtered = this.keplerSystems.filter(system => {
            const systemLower = system.toLowerCase();
            
            // Correspondance directe
            if (systemLower.includes(queryLower)) {
                return true;
            }
            
            // Alias for solar system
            if (system === 'Solar System') {
                return ['solaire', 'terre', 'earth', 'home', 'maison'].some(alias => 
                    alias.includes(queryLower) || queryLower.includes(alias)
                );
            }
            
            return false;
        });
        
        // Ajouter la requête exacte si elle n'existe pas déjà
        if (!filtered.some(s => s.toLowerCase() === query.toLowerCase()) && 
            query.toLowerCase().startsWith('kepler-')) {
            filtered.unshift(query);
        }
        
        this.showSuggestions(filtered.slice(0, 10));
        this.selectedIndex = -1;
    }
    
    showSuggestions(suggestions) {
        this.suggestions = suggestions;
        
        if (suggestions.length === 0) {
            this.searchSuggestions.innerHTML = `
                <div class="search-suggestion">
                    <span>❌ No system found</span>
                </div>
            `;
            return;
        }
        
        const html = suggestions.map((system, index) => {
            const icon = system === 'Solar System' ? '🌍' : '🌌';
            return `
                <div class="search-suggestion" data-index="${index}" onclick="keplerSearch.loadSystem('${system}')" style="
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 20px;
                    margin: 8px 12px;
                    background: linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(0, 128, 255, 0.03) 100%);
                    border: 1px solid rgba(0, 255, 255, 0.15);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Rajdhani', sans-serif;
                ">
                    <div style="
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #00D4FF 0%, #0080FF 100%);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        
                    ">${icon}</div>
                    <div style="
                        color: #FFFFFF;
                        font-weight: 600;
                        font-size: 16px;
                        
                    ">${system}</div>
                </div>
            `;
        }).join('');
        
        this.searchSuggestions.innerHTML = html;
    }
    
    selectNext() {
        if (this.suggestions.length === 0) return;
        
        this.selectedIndex = (this.selectedIndex + 1) % this.suggestions.length;
        this.updateSelection();
    }
    
    selectPrevious() {
        if (this.suggestions.length === 0) return;
        
        this.selectedIndex = this.selectedIndex <= 0 ? 
            this.suggestions.length - 1 : 
            this.selectedIndex - 1;
        this.updateSelection();
    }
    
    updateSelection() {
        const items = this.searchSuggestions.querySelectorAll('.search-suggestion');
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
        
        // Scroll vers l'élément sélectionné
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    selectCurrent() {
        if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
            this.loadSystem(this.suggestions[this.selectedIndex]);
        } else if (this.searchInput.value.trim()) {
            // Utiliser la valeur tapée directement
            this.loadSystem(this.searchInput.value.trim());
        }
    }
    
    loadSystem(systemName) {
        console.log(`🔍 Chargement du système: ${systemName}`);
        
        // Fermer la recherche
        this.hideSearch();
        
        // Charger le système via le routeHandler
        if (window.solarSystemScript && window.solarSystemScript.routeHandler) {
            try {
                // Handle solar system specially
                if (systemName === 'Solar System') {
                    window.solarSystemScript.routeHandler.navigateToSolarSystem();
                    this.showNotification(`🌍 Return to the Solar System - Update...`, 'success');
                    
                    // Actualiser la page après un court délai
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                    
                } else {
                    window.solarSystemScript.routeHandler.navigateToKeplerSystem(systemName);
                    this.showNotification(`Loading ${systemName} - Updating...`, 'success');
                    
                    // Actualiser la page après un court délai
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
                
            } catch (error) {
                console.error('❌ Erreur lors du chargement:', error);
                this.showNotification(`❌ Error: ${systemName} not found`, 'error');
            }
        } else {
        }
    }
    
    showNotification(message, type = 'info') {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#007785' : 
                        type === 'error' ? '#FF6B35' : 
                        '#007785'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            z-index: 250000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
            cursor: pointer;
        `;
        notification.textContent = message;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Supprimer après 3 secondes ou au clic
        const remove = () => {
            notification.style.animation = 'fadeOut 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        };
        
        notification.addEventListener('click', remove);
        setTimeout(remove, 3000);
    }
}

// Initialiser le système au chargement
let keplerSearch = null;

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        keplerSearch = new KeplerSearchSystem();
    });
} else {
    keplerSearch = new KeplerSearchSystem();
}

// Exporter pour utilisation globale
window.keplerSearch = keplerSearch;