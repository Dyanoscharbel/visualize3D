/**
 * Données 100% réalistes du système solaire
 * Toutes les valeurs sont à l'échelle réelle
 * Unités: distances en millions de km, diamètres en km
 */

export const ASTRONOMICAL_UNIT = 149.597870; // 1 AU en millions de km
export const SOLAR_RADIUS = 695700; // km

// Facteurs d'échelle pour la visualisation
export const REALISTIC_SCALE_FACTORS = {
  // Mode ultra-réaliste : vraies proportions
  realistic: {
    distance: 1, // Distances réelles
    size: 1,     // Tailles réelles
    description: "Échelle 100% réaliste - Les planètes seront des points!"
  },
  
  // Mode semi-réaliste : distances réelles, tailles agrandies
  semiRealistic: {
    distance: 1,      // Distances réelles
    size: 1000,       // Tailles x1000 pour visibilité
    description: "Distances réelles, tailles agrandies pour visibilité"
  },
  
  // Mode éducatif : compromis pour apprentissage
  educational: {
    distance: 0.1,    // Distances divisées par 10
    size: 50000,      // Tailles très agrandies
    description: "Optimisé pour l'éducation et l'exploration"
  }
};

export const REALISTIC_SOLAR_SYSTEM_DATA = {
  sun: {
    name: "Soleil",
    type: "star",
    diameter: 1392700, // km - RÉEL
    mass: 1.989e30, // kg
    temperature: 5778, // K
    luminosity: 3.828e26, // W
    rotationPeriod: 25.05, // jours (équateur)
    distanceFromSun: 0, // Centre du système
    composition: {
      hydrogen: 73.46,
      helium: 24.85,
      oxygen: 0.77,
      carbon: 0.29,
      iron: 0.16,
      other: 0.47
    },
    description: "Le Soleil contient 99,86% de la masse du système solaire. À l'échelle réelle, il serait 109 fois plus large que la Terre.",
    texture: "/images/sun.jpg",
    facts: [
      "1,3 million de Terres pourraient tenir dans le Soleil",
      "La température au cœur atteint 15 millions de °C",
      "Il convertit 600 millions de tonnes d'hydrogène par seconde",
      "Sa lumière met 8 minutes 20 secondes pour nous atteindre"
    ]
  },

  mercury: {
    name: "Mercure",
    type: "terrestrial",
    diameter: 4879, // km - RÉEL
    mass: 3.3011e23, // kg
    distanceFromSun: 57.91, // millions de km - RÉEL (0.387 AU)
    orbitalPeriod: 87.97, // jours - RÉEL
    rotationPeriod: 58.65, // jours - RÉEL
    axialTilt: 0.034, // degrés - RÉEL
    eccentricity: 0.2056, // RÉEL
    moons: 0,
    orbitalVelocity: 47.36, // km/s - RÉEL
    escapeVelocity: 4.25, // km/s
    surfaceGravity: 3.7, // m/s² (38% de la Terre)
    atmosphere: {
      composition: "Exosphère très ténue (O2, Na, H, He, K)",
      pressure: "< 5 × 10^-15 bar"
    },
    temperature: {
      min: -173, // °C (côté nuit)
      max: 427,  // °C (côté jour)
      average: 167
    },
    description: "Mercure est la planète la plus proche du Soleil. À l'échelle réelle, elle apparaîtrait 2,6 fois plus petite que la Terre.",
    texture: "/images/mercurymap.jpg",
    bumpMap: "/images/mercurybump.jpg",
    facts: [
      "Plus petite planète du système solaire (38% du diamètre terrestre)",
      "Variations de température extrêmes : 600°C d'écart",
      "Pas d'atmosphère pour retenir la chaleur",
      "Cratères préservés depuis des milliards d'années"
    ]
  },

  venus: {
    name: "Vénus",
    type: "terrestrial",
    diameter: 12104, // km - RÉEL
    mass: 4.8675e24, // kg
    distanceFromSun: 108.21, // millions de km - RÉEL (0.723 AU)
    orbitalPeriod: 224.7, // jours - RÉEL
    rotationPeriod: -243.02, // jours - RÉEL (rétrograde)
    axialTilt: 177.36, // degrés - RÉEL
    eccentricity: 0.0067, // RÉEL
    moons: 0,
    orbitalVelocity: 35.02, // km/s - RÉEL
    escapeVelocity: 10.36, // km/s
    surfaceGravity: 8.87, // m/s² (90% de la Terre)
    atmosphere: {
      composition: {
        co2: 96.5,
        nitrogen: 3.5,
        so2: 0.015,
        ar: 0.007,
        h2o: 0.002
      },
      pressure: "92 bar (92 fois la Terre)"
    },
    temperature: {
      surface: 462, // °C - constante
      clouds: -45   // °C dans les nuages
    },
    description: "Vénus fait 95% de la taille de la Terre. Son atmosphère ultra-dense crée un effet de serre extrême.",
    texture: "/images/venusmap.jpg",
    atmosphereTexture: "/images/venus_atmosphere.jpg",
    facts: [
      "Planète la plus chaude du système solaire (462°C constant)",
      "Pression atmosphérique équivalente à 900m sous l'eau",
      "Rotation rétrograde : le Soleil se lève à l'ouest",
      "Nuages d'acide sulfurique concentré"
    ]
  },

  earth: {
    name: "Terre",
    type: "terrestrial",
    diameter: 12756, // km - RÉEL (référence)
    mass: 5.9724e24, // kg - RÉEL (référence)
    distanceFromSun: 149.598, // millions de km - RÉEL (1 AU exacte)
    orbitalPeriod: 365.26, // jours - RÉEL
    rotationPeriod: 0.99726968, // jours - RÉEL (23h 56min 4s)
    axialTilt: 23.44, // degrés - RÉEL
    eccentricity: 0.0167, // RÉEL
    moons: 1,
    orbitalVelocity: 29.78, // km/s - RÉEL
    escapeVelocity: 11.19, // km/s
    surfaceGravity: 9.807, // m/s² (référence)
    atmosphere: {
      composition: {
        nitrogen: 78.08,
        oxygen: 20.95,
        argon: 0.93,
        co2: 0.04
      },
      pressure: "1 bar (référence)"
    },
    temperature: {
      average: 15, // °C
      min: -89,    // °C (Antarctique)
      max: 58      // °C (déserts)
    },
    description: "La Terre sert de référence pour toutes les comparaisons. Seule planète connue à abriter la vie.",
    texture: "/images/earth_daymap.jpg",
    nightTexture: "/images/earth_nightmap.jpg",
    atmosphereTexture: "/images/earth_atmosphere.jpg",
    facts: [
      "Seule planète avec de l'eau liquide en surface",
      "Champ magnétique protecteur contre les radiations",
      "Atmosphère parfaitement équilibrée pour la vie",
      "71% de la surface couverte d'océans"
    ],
    moons: [
      {
        name: "Lune",
        diameter: 3474, // km - RÉEL (27% de la Terre)
        mass: 7.342e22, // kg
        distanceFromPlanet: 384400, // km - RÉEL
        orbitalPeriod: 27.32, // jours - RÉEL
        rotationPeriod: 27.32, // jours - synchrone
        escapeVelocity: 2.38, // km/s
        surfaceGravity: 1.62, // m/s² (16% de la Terre)
        texture: "/images/moonmap.jpg",
        bumpMap: "/images/moonbump.jpg",
        description: "La Lune fait 1/4 de la taille de la Terre - un rapport unique dans le système solaire.",
        facts: [
          "5ème plus grand satellite du système solaire",
          "Responsable des marées terrestres",
          "S'éloigne de 3,8 cm par an",
          "Toujours la même face visible depuis la Terre"
        ]
      }
    ]
  },

  mars: {
    name: "Mars",
    type: "terrestrial",
    diameter: 6792, // km - RÉEL (53% de la Terre)
    mass: 6.4171e23, // kg
    distanceFromSun: 227.92, // millions de km - RÉEL (1.524 AU)
    orbitalPeriod: 686.98, // jours - RÉEL
    rotationPeriod: 1.026, // jours - RÉEL (24h 37min)
    axialTilt: 25.19, // degrés - RÉEL
    eccentricity: 0.0934, // RÉEL
    moons: 2,
    orbitalVelocity: 24.07, // km/s - RÉEL
    escapeVelocity: 5.03, // km/s
    surfaceGravity: 3.71, // m/s² (38% de la Terre)
    atmosphere: {
      composition: {
        co2: 95.32,
        nitrogen: 2.7,
        argon: 1.6,
        oxygen: 0.13
      },
      pressure: "0.006 bar (0,6% de la Terre)"
    },
    temperature: {
      average: -65, // °C
      min: -125,    // °C (pôles en hiver)
      max: 20       // °C (équateur en été)
    },
    description: "Mars fait la moitié de la taille de la Terre. Ses calottes polaires et ses saisons sont visibles depuis la Terre.",
    texture: "/images/marsmap.jpg",
    bumpMap: "/images/marsbump.jpg",
    facts: [
      "Olympus Mons : 21 km de haut (3x l'Everest)",
      "Valles Marineris : canyon de 4000 km de long",
      "Calottes polaires de glace d'eau et CO2",
      "Preuves d'anciens océans et rivières"
    ],
    moons: [
      {
        name: "Phobos",
        diameter: 22.4, // km - RÉEL (forme irrégulière)
        mass: 1.0659e16, // kg
        distanceFromPlanet: 9376, // km - RÉEL
        orbitalPeriod: 0.32, // jours - RÉEL (7h 39min)
        rotationPeriod: 0.32, // synchrone
        escapeVelocity: 0.0114, // km/s
        description: "Phobos est si proche qu'il orbite Mars 3 fois par jour martien. Il s'écrase lentement sur Mars.",
        facts: [
          "Plus proche lune de toute planète du système solaire",
          "Se rapproche de Mars de 1,8 m par siècle",
          "Sera détruit dans 50 millions d'années",
          "Forme de pomme de terre criblée de cratères"
        ]
      },
      {
        name: "Deimos",
        diameter: 12.4, // km - RÉEL (forme irrégulière)
        mass: 1.4762e15, // kg
        distanceFromPlanet: 23463, // km - RÉEL
        orbitalPeriod: 1.26, // jours - RÉEL (30h 18min)
        rotationPeriod: 1.26, // synchrone
        escapeVelocity: 0.0056, // km/s
        description: "Deimos est l'une des plus petites lunes du système solaire. Elle s'éloigne lentement de Mars.",
        facts: [
          "Plus petite lune connue dans le système solaire",
          "S'éloigne de Mars très lentement",
          "Surface couverte de régolithe fin",
          "Probablement un astéroïde capturé"
        ]
      }
    ]
  },

  jupiter: {
    name: "Jupiter",
    type: "gas_giant",
    diameter: 142984, // km - RÉEL (11,2 fois la Terre)
    mass: 1.8982e27, // kg
    distanceFromSun: 778.57, // millions de km - RÉEL (5.204 AU)
    orbitalPeriod: 4332.59, // jours - RÉEL (11,86 ans)
    rotationPeriod: 0.41354, // jours - RÉEL (9h 56min)
    axialTilt: 3.13, // degrés - RÉEL
    eccentricity: 0.0489, // RÉEL
    moons: 95, // confirmées en 2023
    orbitalVelocity: 13.07, // km/s - RÉEL
    escapeVelocity: 59.5, // km/s
    surfaceGravity: 24.79, // m/s² (2,5x la Terre)
    atmosphere: {
      composition: {
        hydrogen: 89.8,
        helium: 10.2,
        methane: 0.3,
        ammonia: 0.026
      }
    },
    temperature: {
      cloudTop: -108, // °C
      core: 20000     // °C (plus chaud que le Soleil)
    },
    description: "Jupiter fait 11 fois la taille de la Terre. C'est une étoile ratée - il lui manque 75 fois sa masse pour devenir une étoile.",
    texture: "/images/jupiter.jpg",
    facts: [
      "Plus massive que toutes les autres planètes combinées",
      "Grande Tache Rouge : tempête de 3 fois la Terre",
      "Protège la Terre en déviant les astéroïdes",
      "Émet plus d'énergie qu'il n'en reçoit du Soleil"
    ],
    majorMoons: [
      {
        name: "Io",
        diameter: 3643, // km - RÉEL
        mass: 8.932e22, // kg
        distanceFromPlanet: 421700, // km - RÉEL
        orbitalPeriod: 1.77, // jours - RÉEL
        rotationPeriod: 1.77, // synchrone
        surfaceGravity: 1.796, // m/s²
        texture: "/images/jupiterIo.jpg",
        description: "Io fait 28% de la Terre. Ses 400 volcans actifs en font l'objet le plus volcaniquement actif du système solaire.",
        facts: [
          "Plus de 400 volcans actifs",
          "Éjecte du soufre à 500 km d'altitude",
          "Surface renouvelée tous les millions d'années",
          "Forces de marée de Jupiter déforment la lune"
        ]
      },
      {
        name: "Europe",
        diameter: 3122, // km - RÉEL
        mass: 4.8e22, // kg
        distanceFromPlanet: 671034, // km - RÉEL
        orbitalPeriod: 3.55, // jours - RÉEL
        rotationPeriod: 3.55, // synchrone
        surfaceGravity: 1.314, // m/s²
        texture: "/images/jupiterEuropa.jpg",
        description: "Europe fait 25% de la Terre. Son océan souterrain contient plus d'eau que tous les océans terrestres.",
        facts: [
          "Océan de 100 km de profondeur sous la glace",
          "Plus d'eau liquide que sur Terre",
          "Surface de glace renouvelée constamment",
          "Candidate principale pour la vie extraterrestre"
        ]
      },
      {
        name: "Ganymède",
        diameter: 5268, // km - RÉEL (plus grande lune du système solaire)
        mass: 1.482e23, // kg
        distanceFromPlanet: 1070412, // km - RÉEL
        orbitalPeriod: 7.15, // jours - RÉEL
        rotationPeriod: 7.15, // synchrone
        surfaceGravity: 1.428, // m/s²
        texture: "/images/jupiterGanymede.jpg",
        description: "Ganymède fait 41% de la Terre. Plus grande que Mercure, elle possède son propre champ magnétique.",
        facts: [
          "Plus grande lune du système solaire",
          "Plus grande que Mercure",
          "Possède son propre champ magnétique",
          "Océan souterrain sous 150 km de glace"
        ]
      },
      {
        name: "Callisto",
        diameter: 4821, // km - RÉEL
        mass: 1.076e23, // kg
        distanceFromPlanet: 1882709, // km - RÉEL
        orbitalPeriod: 16.69, // jours - RÉEL
        rotationPeriod: 16.69, // synchrone
        surfaceGravity: 1.235, // m/s²
        texture: "/images/jupiterCallisto.jpg",
        description: "Callisto fait 38% de la Terre. C'est l'objet le plus criblé de cratères du système solaire.",
        facts: [
          "Surface la plus ancienne et cratérisée",
          "Aucune activité géologique depuis 4 milliards d'années",
          "Océan souterrain possible",
          "Rotation synchrone avec Jupiter"
        ]
      }
    ]
  },

  saturn: {
    name: "Saturne",
    type: "gas_giant",
    diameter: 120536, // km - RÉEL (9,4 fois la Terre)
    mass: 5.6834e26, // kg
    distanceFromSun: 1432.04, // millions de km - RÉEL (9.573 AU)
    orbitalPeriod: 10759.22, // jours - RÉEL (29,46 ans)
    rotationPeriod: 0.44401, // jours - RÉEL (10h 39min)
    axialTilt: 26.73, // degrés - RÉEL
    eccentricity: 0.0565, // RÉEL
    moons: 146, // confirmées
    orbitalVelocity: 9.68, // km/s - RÉEL
    escapeVelocity: 35.5, // km/s
    surfaceGravity: 10.44, // m/s² (proche de la Terre)
    density: 0.687, // g/cm³ (moins dense que l'eau!)
    rings: {
      innerRadius: 7000, // km du centre de Saturne - RÉEL
      outerRadius: 80000, // km - RÉEL
      thickness: 0.02, // km - RÉEL (20 mètres!)
      texture: "/images/saturn_ring.png",
      description: "Les anneaux s'étendent sur 282000 km mais ne font que 20 mètres d'épaisseur"
    },
    atmosphere: {
      composition: {
        hydrogen: 96.3,
        helium: 3.25,
        methane: 0.45,
        ammonia: 0.0125
      }
    },
    temperature: {
      cloudTop: -139, // °C
      core: 11700     // °C
    },
    description: "Saturne fait 9 fois la taille de la Terre mais est moins dense que l'eau. Ses anneaux sont visibles avec de simples jumelles.",
    texture: "/images/saturnmap.jpg",
    facts: [
      "Moins dense que l'eau (flotterait dans un océan géant)",
      "Anneaux composés de milliards de particules de glace",
      "Hexagone parfait au pôle nord (mystère non résolu)",
      "Titan, sa plus grande lune, a une atmosphère plus dense que la Terre"
    ]
  },

  uranus: {
    name: "Uranus",
    type: "ice_giant",
    diameter: 51118, // km - RÉEL (4 fois la Terre)
    mass: 8.6810e25, // kg
    distanceFromSun: 2867.04, // millions de km - RÉEL (19.165 AU)
    orbitalPeriod: 30688.5, // jours - RÉEL (84 ans)
    rotationPeriod: -0.71833, // jours - RÉEL (17h 14min, rétrograde)
    axialTilt: 97.77, // degrés - RÉEL (roule sur le côté!)
    eccentricity: 0.0457, // RÉEL
    moons: 27,
    orbitalVelocity: 6.80, // km/s - RÉEL
    escapeVelocity: 21.3, // km/s
    surfaceGravity: 8.69, // m/s² (87% de la Terre)
    rings: {
      innerRadius: 38000, // km - RÉEL
      outerRadius: 51000, // km - RÉEL
      texture: "/images/uranus_ring.png",
      description: "Anneaux verticaux découverts en 1977"
    },
    atmosphere: {
      composition: {
        hydrogen: 82.5,
        helium: 15.2,
        methane: 2.3
      }
    },
    temperature: {
      cloudTop: -197, // °C (plus froid que Neptune!)
      core: 5000      // °C
    },
    description: "Uranus fait 4 fois la taille de la Terre et roule sur le côté. Ses saisons durent 21 ans terrestres chacune.",
    texture: "/images/uranus.jpg",
    facts: [
      "Roule sur le côté (axe à 98°)",
      "Saisons de 21 ans terrestres",
      "Plus froid que Neptune malgré sa proximité",
      "Anneaux verticaux (perpendiculaires à l'orbite)"
    ]
  },

  neptune: {
    name: "Neptune",
    type: "ice_giant",
    diameter: 49528, // km - RÉEL (3,9 fois la Terre)
    mass: 1.02413e26, // kg
    distanceFromSun: 4515.0, // millions de km - RÉEL (30.178 AU)
    orbitalPeriod: 60182, // jours - RÉEL (165 ans)
    rotationPeriod: 0.6713, // jours - RÉEL (16h 6min)
    axialTilt: 28.32, // degrés - RÉEL
    eccentricity: 0.0113, // RÉEL
    moons: 16,
    orbitalVelocity: 5.43, // km/s - RÉEL
    escapeVelocity: 23.5, // km/s
    surfaceGravity: 11.15, // m/s² (114% de la Terre)
    atmosphere: {
      composition: {
        hydrogen: 80,
        helium: 19,
        methane: 1
      }
    },
    temperature: {
      cloudTop: -201, // °C
      core: 5200      // °C
    },
    description: "Neptune fait 4 fois la taille de la Terre. Ses vents de 2100 km/h sont les plus rapides du système solaire.",
    texture: "/images/neptune.jpg",
    facts: [
      "Vents les plus rapides : 2100 km/h",
      "Découverte par calculs mathématiques (1846)",
      "Émet 2,6 fois plus d'énergie qu'elle n'en reçoit",
      "Une année neptunienne = 165 années terrestres"
    ]
  }
};

// Ceintures d'astéroïdes avec données réelles
export const REALISTIC_ASTEROID_BELTS = {
  main: {
    name: "Ceinture principale",
    innerRadius: 2.2 * ASTRONOMICAL_UNIT, // 329 millions km - RÉEL
    outerRadius: 3.2 * ASTRONOMICAL_UNIT, // 479 millions km - RÉEL
    particleCount: 1000, // Représentation visuelle
    totalMass: 2.39e21, // kg (4% de la masse lunaire)
    largestObject: "Cérès (940 km de diamètre)",
    description: "La ceinture d'astéroïdes entre Mars et Jupiter. Contrairement aux films, elle est très peu dense.",
    facts: [
      "Contient moins de 4% de la masse de la Lune",
      "Distance moyenne entre astéroïdes : 1 million de km",
      "Cérès représente 25% de la masse totale",
      "Formée des restes de la formation du système solaire"
    ]
  },
  
  kuiper: {
    name: "Ceinture de Kuiper",
    innerRadius: 30 * ASTRONOMICAL_UNIT, // 4,5 milliards km - RÉEL
    outerRadius: 50 * ASTRONOMICAL_UNIT, // 7,5 milliards km - RÉEL
    particleCount: 3000, // Représentation visuelle
    totalMass: 1e22, // kg (estimation)
    largestObject: "Pluton (2374 km de diamètre)",
    description: "Région glacée au-delà de Neptune, riche en comètes et objets primitifs.",
    facts: [
      "20 fois plus large que la ceinture d'astéroïdes",
      "100 fois plus massive que la ceinture d'astéroïdes",
      "Contient les restes glacés de la formation du système solaire",
      "Source des comètes à courte période"
    ]
  }
};

// Fonction pour calculer les échelles visuelles optimales
export function calculateOptimalScale(viewMode = 'educational') {
  const scales = REALISTIC_SCALE_FACTORS[viewMode];
  
  return {
    ...scales,
    // Facteurs de conversion pour l'affichage
    distanceUnit: scales.distance, // 1 unité 3D = X millions de km
    sizeUnit: scales.size,         // 1 unité 3D = X km de diamètre
    
    // Limites de la caméra basées sur l'échelle
    cameraLimits: {
      near: 0.1,
      far: viewMode === 'realistic' ? 10000 : 5000,
      minDistance: viewMode === 'realistic' ? 1 : 10,
      maxDistance: viewMode === 'realistic' ? 8000 : 2000
    }
  };
}
