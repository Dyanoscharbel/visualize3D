# 🌌 Solar System Explorer

**An immersive 3D experience of the solar system and exoplanets built with Three.js**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-4.5.0-646CFF)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.160.0-000000)](https://threejs.org/)


## 📖 Description

Solar System Explorer is an interactive 3D web application that allows you to explore the solar system as well as exoplanet systems discovered by the Kepler mission. The application provides scientifically accurate visualization of planets, their orbits, and physical characteristics.

## ✨ Key Features

### 🪐 Solar System Exploration

- **Complete 3D visualization** of all solar system objects
- **Photorealistic planets** with high-definition textures
- **Natural satellites** (Moon, Jupiter's moons, Saturn's moons, etc.)
- **Asteroid belt** with dynamic animation
- **Intuitive camera controls** for free navigation

### 🌟 Kepler Exoplanet Systems

- **19+ predefined Kepler systems** (Kepler-11, Kepler-90, Kepler-186, etc.)
- **Real scientific data** from exoplanets
- **Automatic classification** of planets by type
- **Procedural textures** based on planet type
- **Backend API** for data retrieval

### 🎮 Advanced User Interface

- **Quick search** (Ctrl+K) for navigation between systems
- **Control panel** with animation settings
- **Informative tooltips** on object hover
- **Gaming-style HUD** with scientific information
- **Fullscreen mode** for complete immersion

### 🔧 Technical Features

- **Optimized 3D engine** based on Three.js
- **Post-processing** with bloom and outline effects
- **Routing system** for direct URLs to systems
- **Loading management** with progress indicators
- **Extensible modular architecture**

## 🚀 Installation and Setup

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** or **yarn**

### Quick Installation

1. **Clone the project**

```bash
git clone [REPO_URL]
cd visualize3D
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

*Or use the Windows startup script:*

```bash
./start.bat
```

4. **Open the application**
   - The application will automatically launch in your browser
   - Default URL: `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `./start.bat` - Windows script with user-friendly interface
- `./test-eclairage.ps1` - Lighting system test script

## 🎯 Usage

### Basic Navigation

- **Click + Drag**: Camera rotation
- **Mouse Wheel**: Zoom in/out
- **Right Click + Drag**: Camera movement

### Keyboard Shortcuts

- **Ctrl + K**: Quick system search
- **Escape**: Close popups/menus
- **F11**: Fullscreen mode (browser)

### System Navigation

1. **Solar System**: Default home page
2. **Kepler Systems**: Accessible via search or direct URL
   - URL format: `/Kepler-11`
   - Example: `http://localhost:5173/Kepler-186`

### Control Panel

- **Orbit Speed**: Adjust orbital velocity
- **Rotation Speed**: Adjust planet rotation
- **Scale**: Toggle between realistic and visual scale
- **Information**: Display scientific data

## 🏗️ Architecture du Projet

```
Space-HUGUES_face_de_pet/
├── src/
│   ├── index.html              # Page principale
│   ├── style.css               # Styles de base
│   ├── js/
│   │   ├── main.js             # Point d'entrée principal
│   │   ├── core/               # Moteurs principaux
│   │   │   ├── SolarSystemEngine.js        # Moteur 3D principal
│   │   │   ├── RealisticSolarSystemEngine.js # Version réaliste
│   │   │   └── ExoplanetSystemEngine.js     # Moteur exoplanètes
│   │   ├── objects/            # Objets 3D
│   │   │   ├── Planet.js       # Classe planète
│   │   │   ├── Sun.js          # Classe soleil/étoile
│   │   │   └── AsteroidBelt.js # Ceinture d'astéroïdes
│   │   ├── services/           # Services API
│   │   │   └── ExoplanetAPIService.js # Communication backend
│   │   ├── ui/                 # Interface utilisateur
│   │   │   ├── UIManager.js    # Gestionnaire UI principal
│   │   │   └── components/     # Composants UI
│   │   ├── utils/              # Utilitaires
│   │   │   ├── RouteHandler.js # Gestion des routes
│   │   │   └── LoadingManager.js # Gestion du chargement
│   │   └── data/               # Données scientifiques
│   │       ├── solarSystemData.js # Données système solaire
│   │       └── planetClassification.js # Classification planètes
│   ├── images/                 # Textures et images
│   │   ├── textures_exoplanet/ # Textures des exoplanètes
│   │   └── satellites/         # Modèles 3D satellites
│   └── styles/                 # Feuilles de style
├── static/                     # Fichiers statiques
├── package.json               # Dépendances et scripts
├── vite.config.js            # Configuration Vite
└── README.md                 # Documentation
```

## 🔧 Technologies Used

### Frontend

- **Three.js 0.160.0** - 3D rendering and WebGL
- **Vite 4.5.0** - Bundler and development server
- **dat.GUI 0.7.9** - Control interface
- **PostProcessing 7.0.0** - Advanced visual effects

### 3D Features

- **OrbitControls** - Camera controls
- **EffectComposer** - Post-processing pipeline
- **UnrealBloomPass** - Bloom effects
- **OutlinePass** - Selection outlines
- **GLTFLoader** - 3D model loading

### Architecture

- **ES6 Modules** - Modern modular architecture
- **Event System** - Component communication
- **Route Handler** - SPA navigation
- **API Service** - Backend communication

## 🎨 Customization

### Adding New Exoplanet Systems

1. **Add to kepler-search.js**:

```javascript
this.keplerSystems = [
    // ... existing systems
    'Kepler-XXX'  // New system
];
```

2. **Configure the backend API** to provide system data

### Texture Modification

Exoplanet textures are organized by type in `src/images/textures_exoplanet/`:

- **Grassland/** - Temperate terrestrial planets
- **Gaseous/** - Gas giants
- **Martian/** - Arid/rocky planets
- **Snowy/** - Ice planets
- etc.

### Physical Parameter Adjustment

Modify `src/js/data/solarSystemData.js` for:

- Relative planet sizes
- Orbital distances
- Rotation speeds
- Scale factors

## 🐛 Troubleshooting

### Common Issues

**Application doesn't load:**

- Check that Node.js is installed
- Run `npm install` to install dependencies
- Verify that port 5173 is not in use

**Missing textures:**

- Exoplanet textures are organized in subfolders
- The system uses fallback colors if textures are missing
- Check `src/images/textures_exoplanet/README.md` for structure

**Slow performance:**

- Reduce post-processing effects quality
- Decrease number of objects in asteroid belt
- Use "visual" scale instead of "realistic"

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA** - For scientific data and images
- **Three.js Community** - For the excellent 3D framework
- **Kepler Mission** - For exoplanet discoveries
- **ESA/Hubble** - For textures and space images

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Check technical documentation in the code
- Review included test files

---

**🌌 Explore the universe from your browser! 🚀**
