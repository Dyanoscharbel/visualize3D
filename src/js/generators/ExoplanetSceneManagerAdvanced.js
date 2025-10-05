/**
 * 🪐 ExoplanetSceneManagerAdvanced
 * 
 * Version avancée avec toutes les fonctionnalités du système solaire :
 * - Matériaux avec bump mapping et normal mapping
 * - Atmosphères conditionnelles selon classification
 * - Anneaux pour géantes gazeuses
 * - Lunes procédurales
 * - Éclairage et ombres réalistes
 * - Effets de sélection avancés
 * - Shaders personnalisés pour planètes chaudes
 */

import * as THREE from 'three';

export class ExoplanetSceneManagerAdvanced {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.exoplanets = [];
        this.orbits = [];
        this.atmospheres = [];
        this.rings = [];
        this.moons = [];
        this.textureLoader = new THREE.TextureLoader();
        
        // Facteurs d'échelle identiques au système solaire
        this.scaleFactors = {
            distance: 7504,  // 1 UA = 7504 unités
            radius: 10,      // Multiplicateur pour les rayons
        };
        
        // Couleurs des orbites selon le type
        this.orbitColors = {
            grassland: 0x7CFC00,   // Vert prairie
            jungle: 0x228B22,      // Vert forêt
            snowy: 0xE0FFFF,       // Cyan clair
            tundra: 0x87CEEB,      // Bleu ciel
            arid: 0xD2691E,        // Marron orangé
            sandy: 0xF4A460,       // Sable
            dusty: 0xC0C0C0,       // Gris
            martian: 0xFF4500,     // Rouge orangé
            barren: 0x696969,      // Gris foncé
            marshy: 0x556B2F,      // Vert olive
            gaseous: 0xFFA500,     // Orange
            methane: 0x4169E1,     // Bleu royal
            default: 0xFFFFFF      // Blanc
        };
        
        // Couleurs des marqueurs selon le type d'exoplanète (même que orbites)
        this.markerColors = {
            grassland: 0x7CFC00,   // Vert prairie
            jungle: 0x228B22,      // Vert forêt
            snowy: 0xE0FFFF,       // Cyan clair
            tundra: 0x87CEEB,      // Bleu ciel
            arid: 0xD2691E,        // Marron orangé
            sandy: 0xF4A460,       // Sable
            dusty: 0xC0C0C0,       // Gris
            martian: 0xFF4500,     // Rouge orangé
            barren: 0x696969,      // Gris foncé
            marshy: 0x556B2F,      // Vert olive
            gaseous: 0xFFA500,     // Orange
            methane: 0x4169E1,     // Bleu royal
            default: 0xFFFFFF      // Blanc
        };
        
        // Stockage des marqueurs créés pour nettoyage
        this.createdMarkers = [];
        
        // Configuration des atmosphères
        this.atmosphereConfig = {
            grassland: { color: 0x87CEEB, opacity: 0.3 },
            jungle: { color: 0x32CD32, opacity: 0.4 },
            snowy: { color: 0xE0FFFF, opacity: 0.2 },
            tundra: { color: 0x87CEEB, opacity: 0.25 },
            arid: { color: 0xDEB887, opacity: 0.15 },
            gaseous: { color: 0xFFA500, opacity: 0.6 },
            methane: { color: 0x4169E1, opacity: 0.5 }
        };
        
        console.log('🎨 ExoplanetSceneManagerAdvanced initialisé avec fonctionnalités avancées');
    }
    
    /**
     * Crée toutes les exoplanètes avec fonctionnalités avancées
     */
    createExoplanets(processedPlanets, sunRadius = 698.88) {
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('🪐 CRÉATION AVANCÉE DES EXOPLANÈTES');
        console.log('════════════════════════════════════════════════════════════');
        console.log(`📊 Planètes à créer: ${processedPlanets.length}`);
        console.log(`☀️ Rayon du Soleil: ${sunRadius.toFixed(2)} unités`);
        
        this.currentSunRadius = sunRadius;
        this.totalPlanets = processedPlanets.length;
        
        // Nettoyer les anciennes exoplanètes
        this.clearExoplanets();
        
        processedPlanets.forEach((planet, index) => {
            this.createAdvancedExoplanet(planet, index);
        });
        
        console.log(`✅ ${this.exoplanets.length} exoplanètes avancées créées!`);
        console.log('════════════════════════════════════════════════════════════\n');
    }
    
    /**
     * Crée une exoplanète avec toutes les fonctionnalités avancées
     */
    async createAdvancedExoplanet(planet, index) {
        const {
            name, radius, distance, temperature, classification,
            type, texturePath, confidence
        } = planet;
        
        console.log(`\n🌍 Création avancée: ${name}`);
        console.log(`   Type: ${classification} (${type})`);
        console.log(`   Rayon: ${radius} R⊕, Distance: ${distance} UA`);
        
        // Calculer les dimensions
        const visualRadius = this.calculateVisualRadius(radius);
        const visualDistance = this.calculateVisualDistance(distance);
        
        // Créer un groupe pour la planète (comme le système solaire)
        const planetSystem = new THREE.Group();
        
        // Créer l'orbite colorée et l'ajouter DIRECTEMENT à la scène
        const orbitColor = this.orbitColors[type] || this.orbitColors.default;
        const orbit = this.createOrbit(visualDistance, orbitColor);
        this.scene.add(orbit);  // Ajouter directement à la scène
        this.orbits.push(orbit);
        
        // Créer la géométrie haute qualité
        const geometry = new THREE.SphereGeometry(visualRadius, 64, 64);
        
        try {
            // Charger les textures
            const texture = await this.textureLoader.loadAsync(texturePath);
            
            // Créer le matériau avancé
            const material = await this.createAdvancedMaterial(texture, planet);
            
            // Créer le mesh principal
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position initiale
            const angle = (index / this.totalPlanets) * Math.PI * 2;
            mesh.position.x = visualDistance * Math.cos(angle);
            mesh.position.y = 0;
            
            // Configuration des ombres
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.renderOrder = 1; // ✅ Rendre les planètes APRÈS les orbites
            
            // Données utilisateur
            mesh.userData = {
                name, classification, type, distance: visualDistance,
                radius: visualRadius, orbitSpeed: this.calculateOrbitSpeed(distance),
                currentAngle: angle, temperature, confidence
            };
            
            // Ajouter la planète au groupe
            planetSystem.add(mesh);
            
            // Ajouter le groupe complet à la scène
            this.scene.add(planetSystem);
            this.exoplanets.push(mesh);
            
            // Créer l'atmosphère si applicable
            await this.createAtmosphere(mesh, planet);
            
            // Créer les anneaux si géante gazeuse
            if (type === 'gas_giant' && radius > 3) {
                await this.createRings(mesh, planet);
            }
            
            // Créer les lunes selon la taille
            if (radius > 1.5) {
                await this.createMoons(mesh, planet);
            }
            
            // Créer le marqueur pour l'exoplanète (intégration au PlanetMarkerSystem)
            this.createExoplanetMarker(mesh, planet);
            
            console.log(`   ✅ Exoplanète avancée créée avec succès`);
            
        } catch (error) {
            console.warn(`   ⚠️ Erreur texture, utilisation couleur par défaut`);
            await this.createFallbackExoplanet(geometry, planet, visualDistance, angle, index);
        }
    }
    
    /**
     * Crée un matériau avancé avec bump mapping et effets
     */
    async createAdvancedMaterial(texture, planet) {
        const { type, temperature, classification } = planet;
        
        // Matériau de base avec texture
        const materialConfig = {
            map: texture,
            roughness: 0.7,
            metalness: 0.1
        };
        
        // Ajouter bump mapping si disponible
        try {
            const bumpPath = this.getBumpMapPath(classification);
            if (bumpPath) {
                const bumpTexture = await this.textureLoader.loadAsync(bumpPath);
                materialConfig.bumpMap = bumpTexture;
                materialConfig.bumpScale = 0.5;
            }
        } catch (e) {
            console.log(`   📝 Pas de bump map pour ${classification}`);
        }
        
        // Ajouter normal mapping si disponible
        try {
            const normalPath = this.getNormalMapPath(classification);
            if (normalPath) {
                const normalTexture = await this.textureLoader.loadAsync(normalPath);
                materialConfig.normalMap = normalTexture;
                materialConfig.normalScale = new THREE.Vector2(0.5, 0.5);
            }
        } catch (e) {
            console.log(`   📝 Pas de normal map pour ${classification}`);
        }
        
        // Effets émissifs pour planètes chaudes
        if (temperature > 800) {
            materialConfig.emissive = new THREE.Color(0xff4400);
            materialConfig.emissiveIntensity = Math.min((temperature - 800) / 1000, 0.3);
            console.log(`   🔥 Planète chaude: émission ${materialConfig.emissiveIntensity.toFixed(2)}`);
        }
        
        // Matériau spéculaire pour planètes océaniques
        if (type === 'grassland' || type === 'jungle') {
            materialConfig.roughness = 0.3;
            materialConfig.metalness = 0.2;
        }
        
        return new THREE.MeshStandardMaterial(materialConfig);
    }
    
    /**
     * Crée une atmosphère conditionnelle selon la classification
     */
    async createAtmosphere(planetMesh, planet) {
        const { type, radius } = planet;
        const atmosphereConfig = this.atmosphereConfig[type];
        
        if (!atmosphereConfig) return;
        
        const atmosphereRadius = planetMesh.userData.radius + (planetMesh.userData.radius * 0.1);
        const atmosphereGeometry = new THREE.SphereGeometry(atmosphereRadius, 32, 32);
        
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: atmosphereConfig.color,
            transparent: true,
            opacity: atmosphereConfig.opacity,
            depthTest: true,
            depthWrite: false,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.userData = { type: 'atmosphere', parent: planetMesh.userData.name };
        atmosphere.renderOrder = 2; // ✅ Rendre l'atmosphère APRÈS la planète
        
        planetMesh.add(atmosphere);
        this.atmospheres.push(atmosphere);
        
        console.log(`   🌫️ Atmosphère ${type} créée (opacité: ${atmosphereConfig.opacity})`);
    }
    
    /**
     * Crée des anneaux pour les géantes gazeuses
     */
    async createRings(planetMesh, planet) {
        const { radius, type } = planet;
        
        if (type !== 'gas_giant') return;
        
        const innerRadius = planetMesh.userData.radius * 1.2;
        const outerRadius = planetMesh.userData.radius * 2.0;
        
        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        
        // Texture d'anneau selon le type
        let ringTexture;
        try {
            const ringPath = type === 'methane' ? 
                '/images/uranus_ring.png' : '/images/saturn_ring.png';
            ringTexture = await this.textureLoader.loadAsync(ringPath);
        } catch (e) {
            console.log(`   📝 Texture d'anneau par défaut`);
        }
        
        const ringMaterial = new THREE.MeshStandardMaterial({
            map: ringTexture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = -Math.PI / 2;
        rings.userData = { type: 'rings', parent: planetMesh.userData.name };
        
        planetMesh.add(rings);
        this.rings.push(rings);
        
        console.log(`   💍 Anneaux créés (${innerRadius.toFixed(1)} - ${outerRadius.toFixed(1)})`);
    }
    
    /**
     * Crée des lunes procédurales selon la taille de la planète
     */
    async createMoons(planetMesh, planet) {
        const { radius, type } = planet;
        
        // Nombre de lunes basé sur la taille
        const moonCount = Math.min(Math.floor(radius / 2), 4);
        if (moonCount === 0) return;
        
        for (let i = 0; i < moonCount; i++) {
            const moonRadius = planetMesh.userData.radius * (0.1 + Math.random() * 0.15);
            const orbitDistance = planetMesh.userData.radius * (2 + i * 0.5);
            
            const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
            
            // Matériau de lune
            const moonMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                roughness: 0.9,
                metalness: 0.1
            });
            
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.position.set(orbitDistance, 0, 0);
            moon.castShadow = true;
            moon.receiveShadow = true;
            
            moon.userData = {
                type: 'moon',
                parent: planetMesh.userData.name,
                orbitDistance: orbitDistance,
                orbitSpeed: 0.01 + Math.random() * 0.02,
                currentAngle: Math.random() * Math.PI * 2
            };
            
            planetMesh.add(moon);
            this.moons.push(moon);
        }
        
        console.log(`   🌙 ${moonCount} lunes créées`);
    }
    
    /**
     * Met à jour les animations avec lunes
     */
    update(deltaTime = 0.016) {
        // Animation des exoplanètes
        this.exoplanets.forEach(planet => {
            const { distance, orbitSpeed, currentAngle } = planet.userData;
            
            // Orbite
            const newAngle = currentAngle + orbitSpeed;
            planet.userData.currentAngle = newAngle;
            planet.position.x = distance * Math.cos(newAngle);
            planet.position.z = distance * Math.sin(newAngle);
            
            // Rotation
            planet.rotation.y += 0.001;
        });
        
        // Animation des lunes
        this.moons.forEach(moon => {
            const { orbitDistance, orbitSpeed, currentAngle } = moon.userData;
            
            const newAngle = currentAngle + orbitSpeed;
            moon.userData.currentAngle = newAngle;
            moon.position.x = orbitDistance * Math.cos(newAngle);
            moon.position.z = orbitDistance * Math.sin(newAngle);
            moon.rotation.y += 0.005;
        });
    }
    
    /**
     * Obtient le chemin de la bump map selon la classification
     */
    getBumpMapPath(classification) {
        const bumpMaps = {
            martian: '/images/marsbump.jpg',
            barren: '/images/moonbump.jpg',
            arid: '/images/mercurybump.jpg'
        };
        return bumpMaps[classification];
    }
    
    /**
     * Obtient le chemin de la normal map selon la classification
     */
    getNormalMapPath(classification) {
        // Chemins vers les normal maps si disponibles
        return null; // À implémenter si normal maps disponibles
    }
    
    /**
     * Crée une exoplanète de secours avec couleur
     */
    async createFallbackExoplanet(geometry, planet, visualDistance, angle, index) {
        const fallbackColor = this.getFallbackColor(planet.type);
        const material = new THREE.MeshStandardMaterial({
            color: fallbackColor,
            roughness: 0.7,
            metalness: 0.1
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = visualDistance * Math.cos(angle);
        mesh.position.z = visualDistance * Math.sin(angle);
        mesh.position.y = 0;
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        
        mesh.userData = {
            name: planet.name,
            classification: planet.classification,
            type: planet.type,
            distance: visualDistance,
            radius: this.calculateVisualRadius(planet.radius),
            orbitSpeed: this.calculateOrbitSpeed(planet.distance),
            currentAngle: angle,
            temperature: planet.temperature,
            confidence: planet.confidence
        };
        
        // Ajouter la planète au groupe
        planetSystem.add(mesh);
        
        // Ajouter le groupe complet à la scène
        this.scene.add(planetSystem);
        this.exoplanets.push(mesh);
        
        // Créer le marqueur pour l'exoplanète de secours
        this.createExoplanetMarker(mesh, planet);
    }
    
    /**
     * Crée un marqueur pour l'exoplanète en utilisant le PlanetMarkerSystem existant
     */
    createExoplanetMarker(exoplanetMesh, planetData) {
        // Vérifier que le PlanetMarkerSystem est disponible
        if (!window.planetMarkerSystem) {
            console.warn(`   ⚠️ PlanetMarkerSystem non disponible pour ${planetData.name}`);
            return;
        }
        
        const { name, type, classification } = planetData;
        
        // Obtenir la couleur selon le type d'exoplanète
        const markerColor = this.markerColors[type] || this.markerColors.default;
        
        // Créer un identifiant unique pour l'exoplanète (en minuscules pour cohérence)
        const exoplanetId = name.toLowerCase().replace(/\s+/g, '_');
        
        // Temporairement ajouter la couleur personnalisée au système de marqueurs
        const originalColors = window.planetMarkerSystem.config.planetColors;
        window.planetMarkerSystem.config.planetColors[exoplanetId] = markerColor;
        
        try {
            // Créer le marqueur avec le nom complet de l'exoplanète
            const markerGroup = window.planetMarkerSystem.createPlanetMarker(
                exoplanetId,           // ID unique
                exoplanetMesh,         // Mesh de l'exoplanète
                name                   // Nom d'affichage (ex: "Kepler-442 b")
            );
            
            // Ajouter le marqueur aux raycastTargets pour le rendre cliquable
            this.addMarkerToRaycastTargets(exoplanetId);
            
            // Stocker l'ID pour le nettoyage ultérieur
            this.createdMarkers.push(exoplanetId);
            
            console.log(`   🏷️ Marqueur créé pour ${name} (couleur: #${markerColor.toString(16).padStart(6, '0')})`);
            
        } catch (error) {
            console.error(`   ❌ Erreur création marqueur pour ${name}:`, error);
        }
        
        // Restaurer les couleurs originales
        window.planetMarkerSystem.config.planetColors = originalColors;
    }
    
    /**
     * Ajoute les marqueurs d'exoplanète aux raycastTargets (même logique que le système solaire)
     */
    addMarkerToRaycastTargets(exoplanetId) {
        if (!window.planetMarkerSystem || !window.raycastTargets) {
            return;
        }
        
        const markerData = window.planetMarkerSystem.markers.get(exoplanetId);
        if (markerData) {
            // Ajouter les éléments cliquables du marqueur (même logique que script.js)
            window.raycastTargets.push(markerData.ring);
            window.raycastTargets.push(markerData.clickArea);
            console.log(`   🎯 Marqueur ${exoplanetId} ajouté aux raycastTargets`);
        }
    }
    
    /**
     * Méthodes utilitaires (identiques à l'original)
     */
    calculateVisualRadius(radius) {
        const baseRadius = radius * this.scaleFactors.radius;
        return Math.max(baseRadius, 0.5);
    }
    
    calculateVisualDistance(distance) {
        const distanceFromCenter = distance * this.scaleFactors.distance;
        const sunRadius = this.currentSunRadius || 698.88;
        return distanceFromCenter + sunRadius;
    }
    
    calculateOrbitSpeed(distance) {
        return 0.001 / Math.sqrt(distance);
    }
    
    createOrbit(radius, color) {
        const orbitPath = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
        const pathPoints = orbitPath.getPoints(128);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
        
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.4,
            depthWrite: true,   // ✅ Activer l'écriture dans le z-buffer pour occlusion correcte
            depthTest: true     // ✅ Tester la profondeur pour occlusion
        });
        
        const orbit = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        orbit.renderOrder = -1; // ✅ Rendre les orbites AVANT les planètes
        
        return orbit;
    }
    
    getFallbackColor(type) {
        const colors = {
            grassland: 0x7CFC00, jungle: 0x228B22, snowy: 0xFFFFFF,
            tundra: 0x87CEEB, arid: 0xD2691E, sandy: 0xF4A460,
            dusty: 0xC0C0C0, martian: 0xFF4500, barren: 0x696969,
            marshy: 0x556B2F, gaseous: 0xFFA500, methane: 0x4169E1
        };
        return colors[type] || 0x808080;
    }
    
    /**
     * Nettoie toutes les exoplanètes et leurs composants
     */
    clearExoplanets() {
        console.log('🧹 Nettoyage avancé des exoplanètes...');
        
        // Nettoyer les marqueurs d'exoplanètes du PlanetMarkerSystem
        this.clearExoplanetMarkers();
        
        // Nettoyer tous les composants
        [...this.exoplanets, ...this.orbits, ...this.atmospheres, 
         ...this.rings, ...this.moons].forEach(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (obj.material.map) obj.material.map.dispose();
                if (obj.material.bumpMap) obj.material.bumpMap.dispose();
                if (obj.material.normalMap) obj.material.normalMap.dispose();
                obj.material.dispose();
            }
            this.scene.remove(obj);
        });
        
        this.exoplanets = [];
        this.orbits = [];
        this.atmospheres = [];
        this.rings = [];
        this.moons = [];
        
        console.log('✅ Nettoyage avancé terminé');
    }
    
    /**
     * Nettoie les marqueurs d'exoplanètes du PlanetMarkerSystem
     */
    clearExoplanetMarkers() {
        if (!window.planetMarkerSystem || !window.raycastTargets) {
            return;
        }
        
        console.log(`🏷️ Nettoyage de ${this.createdMarkers.length} marqueurs d'exoplanètes...`);
        
        this.createdMarkers.forEach(exoplanetId => {
            // Retirer les marqueurs des raycastTargets
            const markerData = window.planetMarkerSystem.markers.get(exoplanetId);
            if (markerData) {
                // Retirer ring et clickArea des raycastTargets
                const ringIndex = window.raycastTargets.indexOf(markerData.ring);
                if (ringIndex > -1) {
                    window.raycastTargets.splice(ringIndex, 1);
                }
                
                const clickIndex = window.raycastTargets.indexOf(markerData.clickArea);
                if (clickIndex > -1) {
                    window.raycastTargets.splice(clickIndex, 1);
                }
                
                console.log(`   🗑️ Marqueur ${exoplanetId} retiré des raycastTargets`);
            }
            
            // Supprimer le marqueur du PlanetMarkerSystem
            window.planetMarkerSystem.removeMarker(exoplanetId);
            console.log(`   🗑️ Marqueur ${exoplanetId} supprimé du PlanetMarkerSystem`);
        });
        
        // Vider la liste des marqueurs créés
        this.createdMarkers = [];
        console.log('✅ Marqueurs d\'exoplanètes nettoyés');
    }
    
    /**
     * Obtient tous les objets cliquables (exoplanètes + lunes + étoile)
     */
    getClickableObjects() {
        const clickableObjects = [];
        
        // Exoplanètes
        this.exoplanets.forEach(planet => {
            clickableObjects.push({
                mesh: planet,
                userData: planet.userData,
                type: 'exoplanet'
            });
        });
        
        // Lunes
        this.moons.forEach(moon => {
            clickableObjects.push({
                mesh: moon,
                userData: moon.userData,
                type: 'moon'
            });
        });
        
        // Étoile centrale
        if (window.sun && window.currentExoplanets) {
            clickableObjects.push({
                mesh: window.sun,
                userData: {
                    name: this.getKeplerStarName(),
                    type: 'kepler_star',
                    temperature: '5778 K (température solaire)',
                    classification: 'Étoile de type G',
                    system: this.getCurrentSystemName()
                },
                type: 'kepler_star'
            });
        }
        
        return clickableObjects;
    }
    
    /**
     * Trouve un objet par son mesh
     */
    findExoplanetByMesh(mesh) {
        // Chercher dans les exoplanètes
        const planet = this.exoplanets.find(p => p === mesh);
        if (planet) {
            return { mesh: planet, userData: planet.userData, type: 'exoplanet' };
        }
        
        // Chercher dans les lunes
        const moon = this.moons.find(m => m === mesh);
        if (moon) {
            return { mesh: moon, userData: moon.userData, type: 'moon' };
        }
        
        // Étoile centrale
        if (mesh === window.sun && window.currentExoplanets) {
            return {
                mesh: mesh,
                userData: {
                    name: this.getKeplerStarName(),
                    type: 'kepler_star',
                    temperature: '5778 K',
                    classification: 'Étoile de type G',
                    system: this.getCurrentSystemName()
                },
                type: 'kepler_star'
            };
        }
        
        return null;
    }
    
    getKeplerStarName() {
        if (window.currentExoplanets && window.currentExoplanets.length > 0) {
            const firstPlanet = window.currentExoplanets[0];
            if (firstPlanet.name) {
                return firstPlanet.name.split(' ')[0];
            }
        }
        return 'Étoile Kepler';
    }
    
    getCurrentSystemName() {
        return this.getKeplerStarName();
    }
    
    /**
     * Affiche les informations détaillées
     */
    displayInfo() {
        console.log('\n════════════════════════════════════════════════════════════');
        console.log('📊 EXOPLANÈTES AVANCÉES DANS LA SCÈNE');
        console.log('════════════════════════════════════════════════════════════');
        
        if (this.exoplanets.length === 0) {
            console.log('❌ Aucune exoplanète dans la scène');
            return;
        }
        
        this.exoplanets.forEach((planet, index) => {
            const { name, classification, type, distance, radius, temperature, confidence } = planet.userData;
            console.log(`\n🌍 ${index + 1}. ${name}`);
            console.log(`   Type: ${classification} (${type})`);
            console.log(`   Rayon: ${radius.toFixed(2)} unités`);
            console.log(`   Distance: ${distance.toFixed(2)} unités`);
            console.log(`   Température: ${temperature}K`);
            console.log(`   Confiance: ${confidence}%`);
            
            // Compter les composants
            const moonCount = this.moons.filter(m => m.userData.parent === name).length;
            const hasAtmosphere = this.atmospheres.some(a => a.userData.parent === name);
            const hasRings = this.rings.some(r => r.userData.parent === name);
            
            console.log(`   🌙 Lunes: ${moonCount}`);
            console.log(`   🌫️ Atmosphère: ${hasAtmosphere ? 'Oui' : 'Non'}`);
            console.log(`   💍 Anneaux: ${hasRings ? 'Oui' : 'Non'}`);
        });
        
        console.log(`\n📈 STATISTIQUES:`);
        console.log(`   Exoplanètes: ${this.exoplanets.length}`);
        console.log(`   Lunes: ${this.moons.length}`);
        console.log(`   Atmosphères: ${this.atmospheres.length}`);
        console.log(`   Anneaux: ${this.rings.length}`);
        console.log('════════════════════════════════════════════════════════════\n');
    }
}

export default ExoplanetSceneManagerAdvanced;
