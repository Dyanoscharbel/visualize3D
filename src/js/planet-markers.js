import * as THREE from 'three';

// ===== SYSTÈME DE MARQUEURS ET ORBITES POUR LES PLANÈTES =====
export class PlanetMarkerSystem {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.markers = new Map();
        this.orbits = new Map();
        this.labels = new Map();
        this.enabled = true;
        
        // Configuration des marqueurs
        this.config = {
            // Marqueurs circulaires - TAILLE FIXE
            markerSize: 200,             // Taille FIXE des marqueurs (bien visible près du soleil)
            markerOpacity: 0.9,          // Opacité des marqueurs
            markerColor: 0xffcc00,       // Couleur dorée par défaut
            markerLineWidth: 3,          // Épaisseur de la ligne
            
            // Labels - TAILLE ÉQUILIBRÉE
            labelOffset: 180,            // Distance du label par rapport au marqueur
            labelSize: 1000,             // Taille équilibrée des sprites de texte (un peu plus)
            labelColor: '#ffffff',       // Couleur du texte
            labelFontSize: 84,           // Taille de police équilibrée (un peu plus)
            
            // Orbites
            orbitOpacity: 0.4,           // Opacité des orbites (plus visible) - NORMALE
            orbitSegments: 2048,         // Nombre de segments pour des cercles ultra-précis
            orbitLineWidth: 2,           // Épaisseur des lignes d'orbite (plus épais) - NORMALE
            
            // Logique de disparition basée sur la taille apparente de la planète
            planetVisibilityThreshold: 20,  // Seuil plus bas pour garder les marqueurs plus longtemps
            fixedSize: true,                 // Taille fixe, pas d'adaptation au zoom
            // Configuration spéciale pour les LUNES
            moonMarkerSize: 100,             // Plus gros pour faciliter la sélection (était 67)
            moonLabelSize: 1000,             // MÊME TAILLE que les planètes
            moonLabelFontSize: 84,           // MÊME TAILLE que les planètes
            moonVisibilityDistance: 5000,    // Distance max BEAUCOUP plus grande (était 500)
            moonProximityThreshold: 10,      // Distance min plus petite (était 50)
            
            // Couleurs personnalisées par planète
            planetColors: {
                mercury: 0x8C7853,
                venus: 0xFFC649,
                earth: 0x6B93D6,
                mars: 0xCD5C5C,
                jupiter: 0xD8CA9D,
                saturn: 0xFAD5A5,
                uranus: 0x4FD0E7,
                neptune: 0x4B70DD,
                pluto: 0x9CA4AB
            },
            
            // Couleurs par TYPE d'exoplanète (basé sur userData.type)
            exoplanetTypeColors: {
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
                methane: 0x4169E1      // Bleu royal
            }
        };
    }
    
    /**
     * Créer un marqueur circulaire pour une planète
     */
    createPlanetMarker(planetName, planetMesh, displayName = null) {
        return this.createMarker(planetName, planetMesh, displayName, 'planet');
    }
    
    /**
     * Créer un marqueur circulaire pour une lune
     */
    createMoonMarker(moonName, moonMesh, parentPlanet, displayName = null) {
        return this.createMarker(moonName, moonMesh, displayName, 'moon', parentPlanet);
    }
    
    /**
     * Méthode générique pour créer un marqueur (planète ou lune)
     */
    createMarker(objectName, objectMesh, displayName = null, type = 'planet', parentPlanet = null) {
        // 🎨 Choisir la couleur selon le type
        let color;
        
        console.log(`\n🔍 DEBUG createMarker pour "${objectName}":`);
        console.log(`   - objectMesh.userData:`, objectMesh.userData);
        console.log(`   - objectMesh.userData.type:`, objectMesh.userData?.type);
        
        // Vérifier d'abord si c'est une exoplanète avec un type spécifique
        if (objectMesh.userData && objectMesh.userData.type) {
            const exoType = objectMesh.userData.type;
            const foundColor = this.config.exoplanetTypeColors[exoType];
            color = foundColor || this.config.markerColor;
            console.log(`   🎨 Type exoplanète: "${exoType}"`);
            console.log(`   🎨 Couleur trouvée: ${foundColor ? `#${foundColor.toString(16)}` : 'NON TROUVÉE (utilise défaut)'}`);
            console.log(`   🎨 Couleur finale: #${color.toString(16)}`);
        } else {
            // Sinon, utiliser les couleurs des planètes du système solaire
            color = this.config.planetColors[objectName.toLowerCase()] || this.config.markerColor;
            console.log(`   🪐 Planète système solaire: "${objectName.toLowerCase()}"`);
            console.log(`   🎨 Couleur: #${color.toString(16)}`);
        }
        
        const name = displayName || objectName.charAt(0).toUpperCase() + objectName.slice(1);
        
        // Tailles selon le type (planète ou lune)
        const markerSize = type === 'moon' ? this.config.moonMarkerSize : this.config.markerSize;
        const labelSize = type === 'moon' ? this.config.moonLabelSize : this.config.labelSize;
        const labelFontSize = type === 'moon' ? this.config.moonLabelFontSize : this.config.labelFontSize;
        
        // Créer le groupe pour le marqueur
        const markerGroup = new THREE.Group();
        
        // Créer le cercle principal (DISQUE PLEIN pour zone de clic élargie)
        const markerGeometry = new THREE.CircleGeometry(
            markerSize,                     // Rayon adapté au type
            32                              // Segments pour un cercle lisse
        );
        
        // Matériau invisible pour la zone de clic (disque plein)
        const clickMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.001,  // ✅ FIX: Opacité très légère pour être détectable par le raycaster
            side: THREE.DoubleSide,
            fog: false,  // Empêcher la perte d'opacité avec la distance
            alphaTest: 0.01,  // ✅ FIX: Permettre au raycaster de détecter les objets semi-transparents
            depthTest: true,  // ✅ FIX: Tester la profondeur normalement
            depthWrite: false  // ✅ FIX: Ne pas écrire dans le buffer de profondeur (transparence)
        });
        
        // Créer l'anneau visuel (pour l'affichage)
        const ringGeometry = new THREE.RingGeometry(
            markerSize * 0.9,               // Rayon intérieur (anneau fin)
            markerSize,                     // Rayon extérieur
            32                              // Segments pour un cercle lisse
        );
        
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: this.config.markerOpacity,
            side: THREE.DoubleSide,
            fog: false  // ✅ Empêcher la perte d'opacité avec la distance
        });
        
        // Créer les deux meshes
        const clickArea = new THREE.Mesh(markerGeometry, clickMaterial);  // Zone de clic invisible
        const markerRing = new THREE.Mesh(ringGeometry, ringMaterial);    // Anneau visible
        
        // Ajouter les deux au groupe
        markerGroup.add(clickArea);  // Zone de clic (invisible mais détectable)
        markerGroup.add(markerRing); // Anneau visible
        
        // 2. AJOUTER UN CERCLE INTÉRIEUR POUR PLUS DE VISIBILITÉ
        const innerGeometry = new THREE.CircleGeometry(markerSize * 0.2, 16);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1,
            fog: false  // ✅ Empêcher la perte d'opacité avec la distance
            // MeshBasicMaterial ne supporte pas emissive - supprimé
        });
        
        const innerCircle = new THREE.Mesh(innerGeometry, innerMaterial);
        markerGroup.add(innerCircle);
        
        // 3. CRÉER UNE LIGNE DE CONNEXION
        const linePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(markerSize * 1.5, markerSize * 0.5, 0)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: this.config.markerOpacity * 0.7,
            linewidth: this.config.markerLineWidth,
            fog: false  // ✅ Empêcher la perte d'opacité avec la distance
        });
        const connectionLine = new THREE.Line(lineGeometry, lineMaterial);
        markerGroup.add(connectionLine);
        
        // 4. CRÉER LE LABEL
        const labelSprite = this.createLabel(name, color, labelSize, labelFontSize);
        labelSprite.position.set(
            markerSize * 1.5 + this.config.labelOffset,
            markerSize * 0.5,
            0
        );
        markerGroup.add(labelSprite);
        
        // Ajouter à la scène
        this.scene.add(markerGroup);
        
        // Rendre TOUTE la zone cliquable pour la sélection (zone invisible + anneau visible)
        const userData = { 
            planetName: objectName,
            isMarker: true,
            planetMesh: objectMesh,
            type: type,
            parentPlanet: parentPlanet
        };
        
        clickArea.userData = userData;  // Zone de clic élargie (disque plein invisible)
        markerRing.userData = userData; // Anneau visible (pour compatibilité)
        
        // Stocker dans la Map
        this.markers.set(objectName, {
            group: markerGroup,
            ring: markerRing,
            clickArea: clickArea,  // Ajouter la zone de clic
            innerCircle: innerCircle,
            line: connectionLine,
            label: labelSprite,
            planet: objectMesh,
            type: type,
            parentPlanet: parentPlanet,
            screenPosition: new THREE.Vector2(),
            screenRadius: 0
        });
        
        return markerGroup;
    }
    
    /**
     * Créer un label texte en sprite
     */
    createLabel(text, color, labelSize = null, fontSize = null) {
        const finalLabelSize = labelSize || this.config.labelSize;
        const finalFontSize = fontSize || this.config.labelFontSize;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Canvas plus grand pour meilleure qualité
        canvas.width = 1024;
        canvas.height = 256;
        
        // Fond transparent
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configuration du texte avec police plus moderne
        context.font = `${finalFontSize * 1.5}px 'Arial Black', Arial, sans-serif`;
        context.fillStyle = this.config.labelColor;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        // Ajouter un contour noir épais pour meilleure lisibilité
        context.strokeStyle = 'rgba(0, 0, 0, 1)';
        context.lineWidth = 3;
        context.strokeText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
        
        // Ajouter une ombre plus prononcée
        /*context.shadowColor = 'rgba(0, 0, 0, 0.9)';
        context.shadowBlur = 15;
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;*/
        
        // Dessiner le texte principal
        context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);
        
        // Ajouter un effet de glow avec la couleur de la planète
        /*const colorHex = '#' + color.toString(16).padStart(6, '0');
        context.shadowColor = colorHex;
        context.shadowBlur = 20;
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.fillStyle = colorHex;
        context.globalCompositeOperation = 'screen';
        context.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2);*/
        
        // Créer la texture et le sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 1
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(finalLabelSize, finalLabelSize / 4, 1);
        
        return sprite;
    }
    
    /**
     * Créer une orbite visible pour une planète
     */
    createOrbit(planetName, orbitRadius, color = null) {
        let orbitColor;
        
        if (color) {
            // Couleur explicitement fournie
            orbitColor = color;
        } else {
            // Chercher la couleur selon le marqueur associé
            const markerData = this.markers.get(planetName.toLowerCase());
            if (markerData && markerData.planet && markerData.planet.userData && markerData.planet.userData.type) {
                // Exoplanète : utiliser la couleur basée sur le type
                const exoType = markerData.planet.userData.type;
                orbitColor = this.config.exoplanetTypeColors[exoType] || 0xffffff;
                console.log(`🌈 Orbite pour ${planetName} (type: ${exoType}): #${orbitColor.toString(16)}`);
            } else {
                // Planète du système solaire : utiliser planetColors
                orbitColor = this.config.planetColors[planetName.toLowerCase()] || 0xffffff;
            }
        }
        
        // Créer la courbe de l'orbite avec un nombre adaptatif de points
        const curve = new THREE.EllipseCurve(
            0, 0,                           // Centre
            orbitRadius, orbitRadius,       // Rayons x et y
            0, 2 * Math.PI,                 // Angle de début et fin
            false,                          // Sens horaire
            0                               // Rotation
        );
        
        // Utiliser un nombre fixe élevé de segments pour TOUTES les orbites
        // Cela garantit une uniformité parfaite entre toutes les orbites
        const ORBIT_SEGMENTS = 2048; // Même valeur que dans createPlanet
        
        console.log(`🔄 Orbite marqueur pour ${planetName}: rayon = ${orbitRadius}, segments = ${ORBIT_SEGMENTS} (fixe)`);
        
        // Utiliser le nombre fixe de points pour un cercle parfait et uniforme
        const points = curve.getPoints(ORBIT_SEGMENTS);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Rotation pour mettre l'orbite dans le plan XZ
        geometry.rotateX(Math.PI / 2);
        
        const material = new THREE.LineBasicMaterial({
            color: orbitColor,
            transparent: true,
            opacity: this.config.orbitOpacity,
            linewidth: this.config.orbitLineWidth
        });
        
        const orbitLine = new THREE.Line(geometry, material);
        
        // Ajouter un effet de glow (optionnel)
        const glowMaterial = new THREE.LineBasicMaterial({
            color: orbitColor,
            transparent: true,
            opacity: this.config.orbitOpacity * 0.3,
            linewidth: this.config.orbitLineWidth * 3
        });
        
        const orbitGlow = new THREE.Line(geometry.clone(), glowMaterial);
        
        const orbitGroup = new THREE.Group();
        orbitGroup.add(orbitLine);
        orbitGroup.add(orbitGlow);
        
        this.scene.add(orbitGroup);
        
        this.orbits.set(planetName, {
            group: orbitGroup,
            line: orbitLine,
            glow: orbitGlow,
            radius: orbitRadius
        });
        
        return orbitGroup;
    }
    
    /**
     * Mettre à jour les marqueurs selon la position de la caméra
     */
    update() {
        if (!this.enabled) return;
        
        // Première passe : calculer les positions écran et tailles
        this.markers.forEach((markerData, objectName) => {
            if (!markerData.planet) return;
            
            // Obtenir la position de l'objet (planète ou lune)
            const objectPos = new THREE.Vector3();
            markerData.planet.getWorldPosition(objectPos);
            
            // Positionner le marqueur sur l'objet
            markerData.group.position.copy(objectPos);
            
            // Faire face à la caméra (billboard effect)
            markerData.group.lookAt(this.camera.position);
            
            // LOGIQUE DE VISIBILITÉ SPÉCIALE POUR LES LUNES ET SATELLITES
            if (markerData.type === 'moon' && markerData.parentPlanet) {
                const parentPos = new THREE.Vector3();
                markerData.parentPlanet.getWorldPosition(parentPos);
                const distanceToParent = this.camera.position.distanceTo(parentPos);
                const distanceToMoon = this.camera.position.distanceTo(objectPos);
                
                // Traitement spécial pour Kepler (satellite artificiel)
                if (objectName.toLowerCase() === 'kepler') {
                    // Kepler est toujours visible quand on est proche de la Terre
                    // et disparaît seulement quand on est très proche de lui
                    const shouldShowKepler = distanceToParent < this.config.moonVisibilityDistance && 
                                           distanceToMoon > 5; // Seuil très petit pour Kepler
                    
                    markerData.group.visible = shouldShowKepler;
                    
                    // Debug pour Kepler
                    if (Math.random() < 0.02) {
                        console.log(`🛰️ Kepler: parent=${distanceToParent.toFixed(0)} (seuil ${this.config.moonVisibilityDistance}), satellite=${distanceToMoon.toFixed(0)} (seuil 5), visible=${shouldShowKepler}`);
                    }
                    
                    if (!shouldShowKepler) return; // Skip le reste si invisible
                } else {
                    // Logique normale pour les autres lunes
                    const shouldShowMoon = distanceToParent < this.config.moonVisibilityDistance && 
                                         distanceToMoon > this.config.moonProximityThreshold;
                    
                    markerData.group.visible = shouldShowMoon;
                    
                    // Debug plus fréquent pour les lunes
                    if (Math.random() < 0.01) { // 10x plus fréquent pour debug
                        console.log(`🌙 ${objectName}: parent=${distanceToParent.toFixed(0)} (seuil ${this.config.moonVisibilityDistance}), moon=${distanceToMoon.toFixed(0)} (seuil ${this.config.moonProximityThreshold}), visible=${shouldShowMoon}`);
                    }
                    
                    if (!shouldShowMoon) return; // Skip le reste si invisible
                }
            }
            
            // TAILLE ABSOLUMENT FIXE - Même taille que dans votre image de référence
            const distance = this.camera.position.distanceTo(objectPos);
            
            // Calculer l'échelle pour maintenir une taille fixe sur l'écran
            const fov = this.camera.fov * Math.PI / 180;
            const screenHeight = 2 * Math.tan(fov / 2) * distance;
            const pixelsPerUnit = window.innerHeight / screenHeight;
            
            // Taille fixe absolue - adaptée au type d'objet
            let targetPixelSize = 20; // Taille plus grande pour voir les labels
            let baseMarkerSize = markerData.type === 'moon' ? this.config.moonMarkerSize : this.config.markerSize;
            
            // Taille spéciale pour Kepler (plus grand et plus visible)
            if (objectName.toLowerCase() === 'kepler') {
                targetPixelSize = 30; // Taille plus grande pour Kepler
                baseMarkerSize = this.config.markerSize; // Utiliser la taille des planètes
            }
            
            const scaleForFixedSize = targetPixelSize / (baseMarkerSize * pixelsPerUnit);
            
            markerData.group.scale.setScalar(scaleForFixedSize);
            
            // Calculer la position écran du marqueur
            const screenPos = objectPos.clone().project(this.camera);
            markerData.screenPosition.set(
                (screenPos.x + 1) * window.innerWidth / 2,
                (-screenPos.y + 1) * window.innerHeight / 2
            );
            markerData.screenRadius = targetPixelSize / 2;
            
            // Calculer la taille apparente de l'objet en pixels
            const planetRadius = this.getPlanetRadius(objectName);
            const planetSizeInPixels = planetRadius * 2 * pixelsPerUnit;
            
            // GARDER LA ZONE DE CLIC TOUJOURS ACTIVE - Masquer seulement l'affichage visuel
            if (planetSizeInPixels > this.config.planetVisibilityThreshold) {
                // Debug pour planètes éloignées
                if (Math.random() < 0.001) {
                    console.log(`🔍 ${objectName}: objet visible (${planetSizeInPixels.toFixed(1)}px > ${this.config.planetVisibilityThreshold}px) - marqueur masqué mais zone de clic active`);
                }
                
                // Masquer seulement les éléments visuels, PAS la zone de clic
                markerData.ring.visible = false;
                markerData.innerCircle.visible = false;
                markerData.line.visible = false;
                markerData.label.visible = false;
                
                // Pour les lunes : désactiver aussi la clickArea quand on est très proche
                if (markerData.type === 'moon') {
                    const distanceToObject = this.camera.position.distanceTo(objectPos);
                    const veryCloseThreshold = 10; // Distance très proche pour désactiver clickArea
                    markerData.clickArea.visible = distanceToObject > veryCloseThreshold;
                } else {
                    // GARDER clickArea visible pour les planètes (invisible mais cliquable)
                    markerData.clickArea.visible = true;
                }
            } else {
                // Debug pour planètes éloignées
                if (Math.random() < 0.001) {
                    console.log(`🎯 ${objectName}: objet petit (${planetSizeInPixels.toFixed(1)}px < ${this.config.planetVisibilityThreshold}px) - marqueur et zone de clic actifs`);
                }
                
                // Afficher tous les éléments visuels
                markerData.ring.visible = true;
                markerData.innerCircle.visible = true;
                markerData.line.visible = true;
                markerData.label.visible = true;
                markerData.clickArea.visible = true;
                
                // Opacité fixe, pas de variation
                markerData.ring.material.opacity = this.config.markerOpacity;
                markerData.line.material.opacity = this.config.markerOpacity * 0.8;
            }
        });
        
        // Deuxième passe : détecter les chevauchements et masquer si nécessaire
        this.checkOverlaps();
        
        // Mettre à jour l'opacité des orbites - OPACITÉ FIXE pour éviter la transparence
        const cameraDistance = this.camera.position.length();
        // OPACITÉ CONSTANTE - ne plus varier avec la distance
        const orbitOpacityFactor = 1.0; // ✅ TOUJOURS opaque, pas de variation
        
        this.orbits.forEach((orbitData) => {
            orbitData.line.material.opacity = this.config.orbitOpacity * orbitOpacityFactor;
            orbitData.glow.material.opacity = this.config.orbitOpacity * 0.5 * orbitOpacityFactor; // Plus visible
        });
    }
    
    /**
     * Vérifier les chevauchements entre marqueurs et les masquer si nécessaire
     */
    checkOverlaps() {
        const visibleMarkers = [];
        
        // Collecter tous les marqueurs avec éléments visuels visibles
        this.markers.forEach((markerData, planetName) => {
            if (markerData.ring.visible) { // Vérifier si les éléments visuels sont visibles
                visibleMarkers.push({
                    name: planetName,
                    data: markerData,
                    x: markerData.screenPosition.x,
                    y: markerData.screenPosition.y,
                    radius: markerData.screenRadius
                });
            }
        });
        
        // Vérifier les chevauchements
        for (let i = 0; i < visibleMarkers.length; i++) {
            for (let j = i + 1; j < visibleMarkers.length; j++) {
                const marker1 = visibleMarkers[i];
                const marker2 = visibleMarkers[j];
                
                // Calculer la distance entre les centres
                const dx = marker1.x - marker2.x;
                const dy = marker1.y - marker2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Vérifier si les cercles se chevauchent (avec une marge)
                const minDistance = marker1.radius + marker2.radius + 10; // 10px de marge
                
                if (distance < minDistance) {
                    // Masquer seulement les éléments visuels, PAS la zone de clic
                    marker1.data.ring.visible = false;
                    marker1.data.innerCircle.visible = false;
                    marker1.data.line.visible = false;
                    marker1.data.label.visible = false;
                    // GARDER clickArea active
                    
                    marker2.data.ring.visible = false;
                    marker2.data.innerCircle.visible = false;
                    marker2.data.line.visible = false;
                    marker2.data.label.visible = false;
                    // GARDER clickArea active
                }
            }
        }
    }
    
    /**
     * Obtenir le rayon réel d'une planète (en unités du jeu)
     */
    getPlanetRadius(objectName) {
        // Rayons approximatifs des planètes et lunes en unités du jeu
        const objectRadii = {
            // Planètes
            mercury: 2,
            venus: 6,
            earth: 6,
            mars: 3,
            jupiter: 70,
            saturn: 58,
            uranus: 25,
            neptune: 25,
            pluto: 1,
            // Lunes
            moon: 1.75,     // Lune de la Terre
            io: 1.83,       // Lune de Jupiter
            europa: 1.57,   // Lune de Jupiter
            ganymede: 2.64, // Lune de Jupiter
            callisto: 2.42  // Lune de Jupiter
        };
        
        return objectRadii[objectName.toLowerCase()] || 5;
    }
    
    /**
     * Activer/désactiver le système
     */
    toggle(enabled = null) {
        this.enabled = enabled !== null ? enabled : !this.enabled;
        
        this.markers.forEach((markerData) => {
            markerData.group.visible = this.enabled;
        });
        
        this.orbits.forEach((orbitData) => {
            orbitData.group.visible = this.enabled;
        });
    }
    
    /**
     * Supprimer un marqueur spécifique
     */
    removeMarker(planetName) {
        const markerData = this.markers.get(planetName);
        if (markerData) {
            this.scene.remove(markerData.group);
            this.markers.delete(planetName);
        }
    }
    
    /**
     * Supprimer une orbite spécifique
     */
    removeOrbit(planetName) {
        const orbitData = this.orbits.get(planetName);
        if (orbitData) {
            this.scene.remove(orbitData.group);
            this.orbits.delete(planetName);
        }
    }
    
    /**
     * Nettoyer tout le système
     */
    dispose() {
        this.markers.forEach((markerData) => {
            this.scene.remove(markerData.group);
        });
        
        this.orbits.forEach((orbitData) => {
            this.scene.remove(orbitData.group);
        });
        
        this.markers.clear();
        this.orbits.clear();
        this.labels.clear();
    }
}

// Export pour utilisation dans script.js
export default PlanetMarkerSystem;
