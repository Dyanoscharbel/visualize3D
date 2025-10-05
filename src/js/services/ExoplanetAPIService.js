/**
 * Service pour communiquer avec l'API backend des exoplanètes
 */
export class ExoplanetAPIService {
    
    constructor(baseURL = 'https://backend-space.onrender.com') {
        this.baseURL = baseURL;
    }
    
    /**
     * Récupérer un système d'exoplanètes
     * @param {string} keplerName - Nom du système Kepler (ex: "Kepler-257")
     * @returns {Promise<Object>} Données du système
     */
    async getKeplerSystem(keplerName) {
        try {
            console.log(`🌌 Récupération du système ${keplerName}...`);
            
            const response = await fetch(`${this.baseURL}/exoplanets/system/${keplerName}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Système ${keplerName} récupéré:`, data);
            
            return data;
            
        } catch (error) {
            console.error(`❌ Erreur lors de la récupération de ${keplerName}:`, error);
            
            // Retourner un système fictif pour les tests si l'API échoue
            return this.createMockSystem(keplerName);
        }
    }
    
    /**
     * Rechercher des systèmes disponibles
     * @param {string} searchTerm - Terme de recherche
     * @param {number} limit - Limite de résultats
     * @returns {Promise<Array>} Liste des systèmes
     */
    async searchSystems(searchTerm = '', limit = 50) {
        try {
            const response = await fetch(`${this.baseURL}/exoplanets/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            return data.systems || [];
            
        } catch (error) {
            console.error('❌ Erreur lors de la recherche:', error);
            return [];
        }
    }
    
    /**
     * Créer un système fictif pour les tests
     * @param {string} keplerName - Nom du système
     * @returns {Object} Système fictif
     */
    createMockSystem(keplerName) {
        console.log(`🧪 Création d'un système fictif pour ${keplerName}`);
        
        // Générer des exoplanètes fictives basées sur le nom
        const planetCount = Math.floor(Math.random() * 6) + 2; // 2-7 planètes
        const exoplanets = [];
        
        for (let i = 0; i < planetCount; i++) {
            const planetName = `${keplerName}.${String(i + 1).padStart(2, '0')}`;
            
            // Génération aléatoire mais cohérente
            const distance = 0.1 + (i * 0.3) + (Math.random() * 0.2); // UA
            const radius = 0.5 + (Math.random() * 4); // R⊕
            const temperature = 50 + (Math.random() * 800); // K
            
            // Classification basée sur les propriétés générées
            const classification = this.classifyMockPlanet(radius, temperature, distance);
            
            exoplanets.push({
                name: planetName,
                kepoi_name: `KOI-${Math.floor(Math.random() * 9999)}`,
                radius,
                temperature,
                distance,
                starMass: 1.0 + (Math.random() * 0.5), // M☉
                starRadius: 0.8 + (Math.random() * 0.7), // R☉
                classification: classification.type,
                planetType: classification.category,
                texture: classification.texture,
                description: classification.description,
                confidence: 0.8,
                originalData: {
                    koi_prad: radius,
                    koi_teq: temperature,
                    koi_sma: distance
                }
            });
        }
        
        return {
            success: true,
            systemName: keplerName,
            exoplanets,
            star: {
                name: keplerName.replace('-', ' '),
                mass: 1.0 + (Math.random() * 0.5),
                radius: 0.8 + (Math.random() * 0.7),
                temperature: 5000 + (Math.random() * 2000),
                type: 'G-type'
            },
            totalPlanets: exoplanets.length,
            message: `Système fictif ${keplerName} généré pour les tests`,
            isMock: true
        };
    }
    
    /**
     * Classification simple pour les planètes fictives
     * @param {number} radius - Rayon en R⊕
     * @param {number} temperature - Température en K
     * @param {number} distance - Distance en UA
     * @returns {Object} Classification
     */
    classifyMockPlanet(radius, temperature, distance) {
        // Géantes gazeuses
        if (radius > 3) {
            if (temperature < 150) return { type: 'methane', category: 'gas_giant', texture: 'Methane', description: 'Géante froide riche en méthane' };
            return { type: 'gaseous', category: 'gas_giant', texture: 'Gaseous', description: 'Géante gazeuse' };
        }
        
        // Planètes terrestres
        if (temperature > 350) return { type: 'arid', category: 'arid', texture: 'Arid', description: 'Monde désertique chaud' };
        if (temperature < 200) return { type: 'snowy', category: 'terrestrial', texture: 'Snowy', description: 'Monde glacé' };
        if (temperature > 280 && distance < 1.2) return { type: 'jungle', category: 'terrestrial', texture: 'Jungle', description: 'Monde tropical' };
        if (distance > 1.5) return { type: 'tundra', category: 'terrestrial', texture: 'Tundra', description: 'Monde froid' };
        
        // Par défaut
        return { type: 'grassland', category: 'terrestrial', texture: 'Grassland', description: 'Monde tempéré' };
    }
}
