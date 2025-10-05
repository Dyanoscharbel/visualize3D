/**
 * 🔄 ExoplanetManagerIntegration
 * 
 * Fichier d'intégration pour remplacer facilement l'ancien ExoplanetSceneManager
 * par la version avancée avec toutes les fonctionnalités du système solaire.
 * 
 * INSTRUCTIONS D'UTILISATION :
 * 1. Remplacer l'import dans script.js
 * 2. Mettre à jour l'initialisation
 * 3. Configurer les ombres dans le renderer
 */

import * as THREE from 'three';
import { ExoplanetSceneManagerAdvanced } from '../generators/ExoplanetSceneManagerAdvanced.js';

/**
 * Configuration requise pour les fonctionnalités avancées
 */
export function configureAdvancedRendering(renderer, scene) {
    console.log('🔧 Configuration du rendu avancé...');
    
    // Activer les ombres
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ombres douces
    
    // Améliorer la qualité du rendu
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    
    console.log('✅ Rendu avancé configuré');
}

/**
 * Initialise le manager avancé avec la configuration optimale
 */
export function initializeAdvancedExoplanetManager(scene, camera, renderer) {
    console.log('🚀 Initialisation du ExoplanetSceneManagerAdvanced...');
    
    // Configurer le rendu avancé
    configureAdvancedRendering(renderer, scene);
    
    // Créer le manager avancé
    const advancedManager = new ExoplanetSceneManagerAdvanced(scene, camera, renderer);
    
    // Configuration des facteurs d'échelle (identiques au système solaire)
    advancedManager.setScaleFactors({
        distance: 7504,  // 1 UA = 7504 unités
        radius: 10       // Multiplicateur pour les rayons
    });
    
    console.log('✅ ExoplanetSceneManagerAdvanced prêt avec fonctionnalités avancées');
    return advancedManager;
}

/**
 * Fonction de migration pour remplacer l'ancien manager
 */
export function migrateToAdvancedManager(oldManager, scene, camera, renderer) {
    console.log('🔄 Migration vers ExoplanetSceneManagerAdvanced...');
    
    // Sauvegarder les données actuelles si elles existent
    let currentExoplanets = null;
    if (oldManager && oldManager.exoplanets && oldManager.exoplanets.length > 0) {
        console.log(`📦 Sauvegarde de ${oldManager.exoplanets.length} exoplanètes existantes`);
        currentExoplanets = window.currentExoplanets;
    }
    
    // Nettoyer l'ancien manager
    if (oldManager && typeof oldManager.clearExoplanets === 'function') {
        oldManager.clearExoplanets();
    }
    
    // Initialiser le nouveau manager
    const newManager = initializeAdvancedExoplanetManager(scene, camera, renderer);
    
    // Recréer les exoplanètes avec les fonctionnalités avancées
    if (currentExoplanets && currentExoplanets.length > 0) {
        console.log('🔄 Recréation des exoplanètes avec fonctionnalités avancées...');
        
        // Récupérer le rayon actuel du soleil
        const currentSunRadius = window.sun ? window.sun.geometry.parameters.radius : 698.88;
        
        // Recréer avec le manager avancé
        newManager.createExoplanets(currentExoplanets, currentSunRadius);
        
        console.log('✅ Migration terminée avec succès');
    }
    
    return newManager;
}

/**
 * Instructions pour l'intégration dans script.js
 */
export const INTEGRATION_INSTRUCTIONS = `
🔧 INSTRUCTIONS D'INTÉGRATION :

1. REMPLACER L'IMPORT :
   // Ancien
   import { ExoplanetSceneManager } from './js/generators/ExoplanetSceneManager.js';
   
   // Nouveau
   import { initializeAdvancedExoplanetManager } from './js/integration/ExoplanetManagerIntegration.js';

2. REMPLACER L'INITIALISATION :
   // Ancien
   exoplanetSceneManager = new ExoplanetSceneManager(scene, camera);
   
   // Nouveau
   exoplanetSceneManager = initializeAdvancedExoplanetManager(scene, camera, renderer);

3. VÉRIFIER QUE LE RENDERER EST DISPONIBLE :
   Assurez-vous que la variable 'renderer' est accessible lors de l'initialisation.

4. FONCTIONNALITÉS AJOUTÉES :
   ✅ Matériaux avec bump mapping
   ✅ Atmosphères conditionnelles
   ✅ Anneaux pour géantes gazeuses  
   ✅ Lunes procédurales
   ✅ Éclairage et ombres réalistes
   ✅ Effets émissifs pour planètes chaudes
   ✅ Sélection avancée avec lunes
   ✅ Marqueurs/cercles pour exoplanètes (intégration PlanetMarkerSystem)
   ✅ Couleurs des marqueurs selon type d'exoplanète
   ✅ Noms des exoplanètes depuis le backend
   ✅ Nettoyage automatique des marqueurs

5. COMPATIBILITÉ :
   Le nouveau manager est 100% compatible avec l'ancien.
   Toutes les méthodes existantes fonctionnent identiquement.
   
6. SYSTÈME DE MARQUEURS :
   Les exoplanètes sont automatiquement intégrées au PlanetMarkerSystem existant.
   Elles apparaissent avec des cercles colorés selon leur type et restent visibles au zoom.
   Les marqueurs sont automatiquement nettoyés lors du retour au système solaire.
`;

console.log(INTEGRATION_INSTRUCTIONS);

export default {
    ExoplanetSceneManagerAdvanced,
    initializeAdvancedExoplanetManager,
    migrateToAdvancedManager,
    configureAdvancedRendering,
    INTEGRATION_INSTRUCTIONS
};
