/**
 * Gestionnaire de routes pour le frontend
 * Détecte les routes de type /kepler-XXX et charge les données correspondantes
 */

import { ExoplanetAPIService } from '../services/ExoplanetAPIService.js';

export class RouteHandler {
    constructor() {
        this.apiService = new ExoplanetAPIService();
        this.currentRoute = null;
        this.currentSystem = null;
    }

    /**
     * Initialiser le gestionnaire de routes
     */
    init() {
        console.log('🛣️ Initialisation du gestionnaire de routes...');
        
        // Détecter la route au chargement
        this.detectRoute();
        
        // Écouter les changements d'URL (navigation)
        window.addEventListener('popstate', () => {
            console.log('🔄 Changement de route détecté');
            this.detectRoute();
        });
        
        console.log('✅ Gestionnaire de routes initialisé');
    }

    /**
     * Détecter et analyser la route actuelle
     */
    detectRoute() {
        const path = window.location.pathname;
        console.log('🔍 Analyse de la route:', path);
        
        // Pattern pour détecter Kepler-XXX
        const keplerPattern = /\/kepler-(\d+)/i;
        const match = path.match(keplerPattern);
        
        if (match) {
            const keplerNumber = match[1];
            const keplerName = `Kepler-${keplerNumber}`;
            
            console.log('🎯 Route Kepler détectée:', keplerName);
            
            this.currentRoute = {
                type: 'kepler-system',
                keplerName: keplerName,
                keplerNumber: keplerNumber
            };
            
            // Charger les données du système
            this.loadKeplerSystem(keplerName);
            
        } else {
            console.log('🏠 Route standard (système solaire)');
            this.currentRoute = {
                type: 'solar-system'
            };
        }
        
        return this.currentRoute;
    }

    /**
     * Charger un système Kepler depuis l'API
     * @param {string} keplerName - Nom du système (ex: "Kepler-12")
     */
    async loadKeplerSystem(keplerName) {
        try {
            console.log(`\n${'='.repeat(60)}`);
            console.log(`🌌 CHARGEMENT DU SYSTÈME ${keplerName}`);
            console.log(`${'='.repeat(60)}\n`);
            
            // Appeler l'API backend
            const systemData = await this.apiService.getKeplerSystem(keplerName);
            
            // Stocker les données
            this.currentSystem = systemData;
            
            // Afficher les données dans la console
            this.displaySystemInConsole(systemData);
            
            // Modifier le rayon du Soleil si on a un moteur 3D actif
            this.updateSolarSystemStar(systemData);
            
            // Émettre un événement personnalisé pour d'autres composants
            window.dispatchEvent(new CustomEvent('kepler-system-loaded', {
                detail: systemData
            }));
            
            console.log(`\n${'='.repeat(60)}`);
            console.log(`✅ Système ${keplerName} chargé avec succès !`);
            console.log(`${'='.repeat(60)}\n`);
            
            return systemData;
            
        } catch (error) {
            console.error(`\n❌ ERREUR lors du chargement de ${keplerName}:`, error);
            console.error('Détails:', error.message);
            return null;
        }
    }

    /**
     * Mettre à jour le Soleil du système solaire avec les données de l'étoile Kepler
     * @param {Object} systemData - Données du système
     */
    updateSolarSystemStar(systemData) {
        try {
            // Récupérer les données de l'étoile
            const star = systemData.data?.star || systemData.star;
            
            if (!star) {
                console.warn('⚠️ Pas de données d\'étoile disponibles');
                return;
            }

            // Vérifier si l'application a un moteur 3D
            if (window.solarSystemApp && window.solarSystemApp.getEngine()) {
                const engine = window.solarSystemApp.getEngine();
                
                console.log('\n🌟 Mise à jour du Soleil avec les données de l\'étoile Kepler...');
                
                // Mettre à jour le rayon du Soleil
                engine.updateSunRadius(star);
                
            } else {
                console.log('ℹ️ Moteur 3D non disponible - Soleil non modifié');
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de la mise à jour du Soleil:', error);
        }
    }

    /**
     * Afficher les données du système dans la console de manière lisible
     * @param {Object} systemData - Données du système
     */
    displaySystemInConsole(systemData) {
        console.log('\n📊 INFORMATIONS DU SYSTÈME:\n');
        
        // Informations générales
        console.log(`%c🌟 Nom du système: ${systemData.systemName || systemData.data?.systemName}`, 
            'color: #4CAF50; font-weight: bold; font-size: 14px');
        
        const exoplanets = systemData.data?.exoplanets || systemData.exoplanets || [];
        const star = systemData.data?.star || systemData.star;
        
        console.log(`%c⭐ Nombre de planètes: ${exoplanets.length}`, 
            'color: #2196F3; font-weight: bold');
        
        // Informations sur l'étoile
        if (star) {
            console.log('\n%c🌟 ÉTOILE CENTRALE:', 'color: #FFC107; font-weight: bold; font-size: 13px');
            console.table({
                'Nom': star.name,
                'Masse (M☉)': star.mass?.toFixed(2),
                'Rayon (R☉)': star.radius?.toFixed(2),
                'Température (K)': star.temperature?.toFixed(0),
                'Type': star.type
            });
        }
        
        // Informations sur les exoplanètes
        if (exoplanets.length > 0) {
            console.log('\n%c🪐 EXOPLANÈTES:', 'color: #9C27B0; font-weight: bold; font-size: 13px');
            
            exoplanets.forEach((planet, index) => {
                console.log(`\n%c──── Planète ${index + 1}: ${planet.name} ────`, 
                    'color: #00BCD4; font-weight: bold');
                
                console.table({
                    'Nom': planet.name,
                    'KOI Name': planet.kepoi_name,
                    'Rayon (R⊕)': planet.radius?.toFixed(2),
                    'Température (K)': planet.temperature?.toFixed(0),
                    'Distance (UA)': planet.distance?.toFixed(3),
                    'Classification': planet.classification,
                    'Type': planet.planetType,
                    'Texture': planet.texture,
                    'Confiance': (planet.confidence * 100)?.toFixed(0) + '%'
                });
                
                console.log(`%c📝 ${planet.description}`, 'color: #607D8B; font-style: italic');
            });
            
            // Résumé visuel
            console.log('\n%c📈 RÉSUMÉ DES PLANÈTES:', 'color: #FF5722; font-weight: bold');
            
            const summary = exoplanets.map(p => ({
                'Nom': p.name,
                'Rayon (R⊕)': p.radius?.toFixed(1),
                'Temp (K)': p.temperature?.toFixed(0),
                'Type': p.planetType
            }));
            
            console.table(summary);
            
        } else {
            console.warn('⚠️ Aucune exoplanète trouvée pour ce système');
        }
        
        // Données brutes (optionnel, en mode collapsed)
        console.groupCollapsed('📦 Données brutes complètes');
        console.log(systemData);
        console.groupEnd();
    }

    /**
     * Obtenir la route actuelle
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Obtenir le système actuel chargé
     */
    getCurrentSystem() {
        return this.currentSystem;
    }

    /**
     * Naviguer vers un système Kepler
     * @param {string} keplerName - Nom du système (ex: "Kepler-12")
     */
    navigateToKeplerSystem(keplerName) {
        const url = `/${keplerName.toLowerCase()}`;
        window.history.pushState({}, '', url);
        this.detectRoute();
    }

    /**
     * Retour au système solaire
     */
    navigateToSolarSystem() {
        // Réinitialiser le rayon du Soleil
        if (window.solarSystemApp && window.solarSystemApp.getEngine()) {
            const engine = window.solarSystemApp.getEngine();
            console.log('🔄 Retour au système solaire - Réinitialisation du Soleil...');
            engine.resetSunRadius();
        }
        
        window.history.pushState({}, '', '/');
        this.detectRoute();
    }
}
