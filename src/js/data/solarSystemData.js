/**
 * Données réelles du système solaire
 * Distances en millions de km, tailles en km de diamètre
 * Sources: NASA, JPL, IAU
 */

export const ASTRONOMICAL_UNIT = 149.597870; // 1 AU en millions de km

export const SOLAR_SYSTEM_DATA = {
  sun: {
    name: "Soleil",
    type: "star",
    diameter: 1392700, // km
    mass: 1.989e30, // kg
    temperature: 5778, // K
    luminosity: 3.828e26, // W
    rotationPeriod: 25.05, // jours (équateur)
    composition: {
      hydrogen: 73.46,
      helium: 24.85,
      oxygen: 0.77,
      carbon: 0.29,
      iron: 0.16,
      other: 0.47
    },
    description: "Le Soleil est l'étoile au centre de notre système solaire. Il contient 99,86% de la masse du système solaire et génère son énergie par fusion nucléaire.",
    texture: "/images/sun.jpg"
  },

  mercury: {
    name: "Mercure",
    type: "terrestrial",
    diameter: 4879, // km
    mass: 3.3011e23, // kg
    distanceFromSun: 0.387 * ASTRONOMICAL_UNIT, // AU
    orbitalPeriod: 87.97, // jours
    rotationPeriod: 58.65, // jours
    axialTilt: 0.034, // degrés
    eccentricity: 0.2056,
    moons: 0,
    atmosphere: {
      composition: "Exosphère très ténue",
      pressure: "< 5 × 10^-15 bar"
    },
    temperature: {
      min: -173, // °C (côté nuit)
      max: 427   // °C (côté jour)
    },
    description: "Mercure est la planète la plus proche du Soleil et la plus petite du système solaire. Sa surface est criblée de cratères similaires à ceux de la Lune.",
    texture: "/images/mercurymap.jpg",
    bumpMap: "/images/mercurybump.jpg",
    facts: [
      "Une année sur Mercure dure 88 jours terrestres",
      "Un jour sur Mercure dure 176 jours terrestres",
      "Mercure n'a pas d'atmosphère protectrice",
      "La température varie de -173°C à 427°C"
    ]
  },

  venus: {
    name: "Vénus",
    type: "terrestrial",
    diameter: 12104, // km
    mass: 4.8675e24, // kg
    distanceFromSun: 0.723 * ASTRONOMICAL_UNIT,
    orbitalPeriod: 224.7, // jours
    rotationPeriod: -243.02, // jours (rétrograde)
    axialTilt: 177.36, // degrés
    eccentricity: 0.0067,
    moons: 0,
    atmosphere: {
      composition: {
        co2: 96.5,
        nitrogen: 3.5,
        so2: 0.015,
        ar: 0.007,
        h2o: 0.002
      },
      pressure: "92 bar"
    },
    temperature: {
      surface: 462 // °C (constante)
    },
    description: "Vénus est souvent appelée la 'sœur jumelle' de la Terre en raison de sa taille similaire, mais son atmosphère dense crée un effet de serre extrême.",
    texture: "/images/venusmap.jpg",
    atmosphereTexture: "/images/venus_atmosphere.jpg",
    facts: [
      "Vénus est la planète la plus chaude du système solaire",
      "Elle tourne dans le sens inverse des autres planètes",
      "Un jour sur Vénus dure plus longtemps qu'une année",
      "La pression atmosphérique est 92 fois celle de la Terre"
    ]
  },

  earth: {
    name: "Terre",
    type: "terrestrial",
    diameter: 12756, // km
    mass: 5.9724e24, // kg
    distanceFromSun: 1.0 * ASTRONOMICAL_UNIT,
    orbitalPeriod: 365.26, // jours
    rotationPeriod: 0.99726968, // jours
    axialTilt: 23.44, // degrés
    eccentricity: 0.0167,
    moons: 1,
    atmosphere: {
      composition: {
        nitrogen: 78.08,
        oxygen: 20.95,
        argon: 0.93,
        co2: 0.04
      },
      pressure: "1 bar"
    },
    temperature: {
      average: 15 // °C
    },
    description: "La Terre est la seule planète connue à abriter la vie. Elle possède de l'eau liquide en surface et une atmosphère protectrice.",
    texture: "/images/earth_daymap.jpg",
    nightTexture: "/images/earth_nightmap.jpg",
    atmosphereTexture: "/images/earth_atmosphere.jpg",
    facts: [
      "71% de la surface est couverte d'eau",
      "L'atmosphère protège des radiations solaires",
      "Seule planète connue à abriter la vie",
      "Possède un champ magnétique protecteur"
    ],
    moons: [
      {
        name: "Lune",
        diameter: 3474, // km
        distanceFromPlanet: 384400, // km
        orbitalPeriod: 27.32, // jours
        texture: "/images/moonmap.jpg",
        bumpMap: "/images/moonbump.jpg",
        description: "La Lune est le cinquième plus grand satellite naturel du système solaire."
      }
    ]
  },

  mars: {
    name: "Mars",
    type: "terrestrial",
    diameter: 6792, // km
    mass: 6.4171e23, // kg
    distanceFromSun: 1.524 * ASTRONOMICAL_UNIT,
    orbitalPeriod: 686.98, // jours
    rotationPeriod: 1.026, // jours
    axialTilt: 25.19, // degrés
    eccentricity: 0.0934,
    moons: 2,
    atmosphere: {
      composition: {
        co2: 95.32,
        nitrogen: 2.7,
        argon: 1.6,
        oxygen: 0.13
      },
      pressure: "0.006 bar"
    },
    temperature: {
      average: -65 // °C
    },
    description: "Mars, la 'planète rouge', possède les plus grandes montagnes et canyons du système solaire. Elle montre des signes d'ancienne activité d'eau liquide.",
    texture: "/images/marsmap.jpg",
    bumpMap: "/images/marsbump.jpg",
    facts: [
      "Olympus Mons est le plus grand volcan du système solaire",
      "Valles Marineris est un canyon de 4000 km de long",
      "Mars a des calottes polaires de glace d'eau et de CO2",
      "Un jour martien dure 24h 37min"
    ],
    moons: [
      {
        name: "Phobos",
        diameter: 22.4, // km (moyenne)
        distanceFromPlanet: 9376, // km
        orbitalPeriod: 0.32, // jours
        description: "Phobos est le plus grand et le plus proche des deux satellites de Mars."
      },
      {
        name: "Deimos",
        diameter: 12.4, // km (moyenne)
        distanceFromPlanet: 23463, // km
        orbitalPeriod: 1.26, // jours
        description: "Deimos est le plus petit et le plus éloigné des satellites de Mars."
      }
    ]
  },

  jupiter: {
    name: "Jupiter",
    type: "gas_giant",
    diameter: 142984, // km
    mass: 1.8982e27, // kg
    distanceFromSun: 5.204 * ASTRONOMICAL_UNIT,
    orbitalPeriod: 4332.59, // jours
    rotationPeriod: 0.41354, // jours
    axialTilt: 3.13, // degrés
    eccentricity: 0.0489,
    moons: 95, // confirmées
    atmosphere: {
      composition: {
        hydrogen: 89.8,
        helium: 10.2,
        methane: 0.3,
        ammonia: 0.026
      }
    },
    temperature: {
      cloudTop: -108 // °C
    },
    description: "Jupiter est la plus grande planète du système solaire. Sa Grande Tache Rouge est une tempête qui dure depuis des siècles.",
    texture: "/images/jupiter.jpg",
    facts: [
      "Jupiter est plus massive que toutes les autres planètes combinées",
      "La Grande Tache Rouge pourrait contenir 2-3 Terres",
      "Jupiter agit comme un 'aspirateur cosmique' protégeant la Terre",
      "Elle possède un faible système d'anneaux"
    ],
    majorMoons: [
      {
        name: "Io",
        diameter: 3643, // km
        distanceFromPlanet: 421700, // km
        orbitalPeriod: 1.77, // jours
        texture: "/images/jupiterIo.jpg",
        description: "Io est le corps le plus volcaniquement actif du système solaire."
      },
      {
        name: "Europe",
        diameter: 3122, // km
        distanceFromPlanet: 671034, // km
        orbitalPeriod: 3.55, // jours
        texture: "/images/jupiterEuropa.jpg",
        description: "Europe possède un océan souterrain qui pourrait abriter la vie."
      },
      {
        name: "Ganymède",
        diameter: 5268, // km
        distanceFromPlanet: 1070412, // km
        orbitalPeriod: 7.15, // jours
        texture: "/images/jupiterGanymede.jpg",
        description: "Ganymède est le plus grand satellite du système solaire."
      },
      {
        name: "Callisto",
        diameter: 4821, // km
        distanceFromPlanet: 1882709, // km
        orbitalPeriod: 16.69, // jours
        texture: "/images/jupiterCallisto.jpg",
        description: "Callisto est l'objet le plus criblé de cratères du système solaire."
      }
    ]
  },

  saturn: {
    name: "Saturne",
    type: "gas_giant",
    diameter: 120536, // km
    mass: 5.6834e26, // kg
    distanceFromSun: 9.573 * ASTRONOMICAL_UNIT,
    orbitalPeriod: 10759.22, // jours
    rotationPeriod: 0.44401, // jours
    axialTilt: 26.73, // degrés
    eccentricity: 0.0565,
    moons: 146, // confirmées
    rings: {
      innerRadius: 7000, // km from planet center
      outerRadius: 80000, // km from planet center
      texture: "/images/saturn_ring.png"
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
      cloudTop: -139 // °C
    },
    description: "Saturne est célèbre pour son spectaculaire système d'anneaux composé de milliards de particules de glace et de roche.",
    texture: "/images/saturnmap.jpg",
    facts: [
      "Saturne est moins dense que l'eau",
      "Ses anneaux s'étendent sur 282000 km",
      "Titan, sa plus grande lune, a une atmosphère dense",
      "Saturne possède un hexagone au pôle nord"
    ]
  },

  uranus: {
    name: "Uranus",
    type: "ice_giant",
    diameter: 51118, // km
    mass: 8.6810e25, // kg
    distanceFromSun: 19.165 * ASTRONOMICAL_UNIT,
    orbitalPeriod: 30688.5, // jours
    rotationPeriod: -0.71833, // jours (rétrograde)
    axialTilt: 97.77, // degrés
    eccentricity: 0.0457,
    moons: 27,
    rings: {
      innerRadius: 38000, // km from planet center
      outerRadius: 51000, // km from planet center
      texture: "/images/uranus_ring.png"
    },
    atmosphere: {
      composition: {
        hydrogen: 82.5,
        helium: 15.2,
        methane: 2.3
      }
    },
    temperature: {
      cloudTop: -197 // °C
    },
    description: "Uranus est unique car elle tourne sur le côté. Sa couleur bleu-vert provient du méthane dans son atmosphère.",
    texture: "/images/uranus.jpg",
    facts: [
      "Uranus tourne sur le côté avec un axe incliné à 98°",
      "Elle possède des anneaux faibles découverts en 1977",
      "Un jour sur Uranus dure 17 heures terrestres",
      "Ses saisons durent 21 ans terrestres chacune"
    ]
  },

  neptune: {
    name: "Neptune",
    type: "ice_giant",
    diameter: 49528, // km
    mass: 1.02413e26, // kg
    distanceFromSun: 30.178 * ASTRONOMICAL_UNIT,
    orbitalPeriod: 60182, // jours
    rotationPeriod: 0.6713, // jours
    axialTilt: 28.32, // degrés
    eccentricity: 0.0113,
    moons: 16,
    atmosphere: {
      composition: {
        hydrogen: 80,
        helium: 19,
        methane: 1
      }
    },
    temperature: {
      cloudTop: -201 // °C
    },
    description: "Neptune est la planète la plus éloignée du Soleil et possède les vents les plus rapides du système solaire.",
    texture: "/images/neptune.jpg",
    facts: [
      "Neptune a les vents les plus rapides: jusqu'à 2100 km/h",
      "Elle fut découverte par calculs mathématiques",
      "Neptune émet 2,6 fois plus d'énergie qu'elle n'en reçoit",
      "Triton, sa plus grande lune, orbite en sens rétrograde"
    ]
  }
};

// Données des ceintures d'astéroïdes
export const ASTEROID_BELTS = {
  main: {
    name: "Ceinture principale",
    innerRadius: 2.2 * ASTRONOMICAL_UNIT,
    outerRadius: 3.2 * ASTRONOMICAL_UNIT,
    particleCount: 1000,
    description: "La ceinture d'astéroïdes principale entre Mars et Jupiter."
  },
  kuiper: {
    name: "Ceinture de Kuiper",
    innerRadius: 30 * ASTRONOMICAL_UNIT,
    outerRadius: 50 * ASTRONOMICAL_UNIT,
    particleCount: 3000,
    description: "La ceinture de Kuiper au-delà de Neptune, riche en objets glacés."
  }
};

// Facteurs d'échelle pour la visualisation
export const SCALE_FACTORS = {
  realistic: {
    distance: 1,
    size: 1,
    description: "Échelle réaliste (attention: les planètes seront très petites)"
  },
  visual: {
    distance: 0.1,
    size: 100,
    description: "Échelle visuelle optimisée pour l'observation"
  }
};
