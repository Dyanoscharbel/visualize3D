# 🎨 Textures des Exoplanètes - Structure Réelle

## ✅ Structure Actuelle (Vérifiée)

Les textures sont organisées dans des **sous-dossiers** avec plusieurs variantes :

```
textures_exoplanet/
├── Arid/
│   └── Arid01.png
├── Barren/
│   └── Barren01.png
├── Dusty/
│   └── Dusty01.png
├── Gaseous/
│   ├── Gaseous01.png
│   ├── Gaseous02.png
│   ├── Gaseous06.png
│   └── Gaseous_07-20-1024x512.png (17 variantes)
├── Grassland/
│   └── Grassland01.png
├── Jungle/
│   └── Jungle01.png
├── Marshy/
│   └── Marshy01.png
├── Martian/
│   └── Martian01.png
├── Methane/
│   └── Methane01.png
├── Sandy/
│   └── Sandy01.png
├── Snowy/
│   └── Snowy01.png
└── Tundra/
    └── Tundra01.png
```

## 📋 Chemins Utilisés par le Système

```javascript
// Exemples de chemins corrects
'/images/textures_exoplanet/Grassland/Grassland01.png'
'/images/textures_exoplanet/Barren/Barren01.png'
'/images/textures_exoplanet/Gaseous/Gaseous01.png'
```

## 🔧 Utilisation Automatique

Les textures sont chargées automatiquement par `ExoplanetSceneManager.js` :

1. **Classification** → `ExoplanetGenerator` détermine le type
2. **Attribution** → Chemin texture assigné (ex: `Grassland/Grassland01.png`)
3. **Chargement** → `THREE.TextureLoader()` charge le PNG
4. **Application** → Texture appliquée sur le mesh de la planète

Si une texture est manquante → **Fallback automatique vers une couleur**

## 📦 Format des Fichiers

- **Format** : PNG
- **Dimensions** : 1024x512 ou 2048x1024
- **Mapping** : Equirectangular (projection sphérique)
- **Nommage** : `{Type}01.png` (ex: `Grassland01.png`)

## 🎨 Ajouter de Nouvelles Textures

Pour ajouter une texture :

1. Placez le fichier dans le bon sous-dossier
2. Respectez le format : `{Type}{Numéro}.png`
3. Rechargez le système

**Exemple :**
```
Arid/
├── Arid01.png    ← Utilisé actuellement
├── Arid02.png    ← Nouvelle variante (future fonctionnalité)
```

## ⚠️ Fallback Couleurs

Si texture introuvable → Couleur automatique :

| Type | Couleur |
|------|---------|
| Grassland | #7CFC00 |
| Jungle | #228B22 |
| Snowy | #FFFFFF |
| Tundra | #87CEEB |
| Arid | #D2691E |
| Sandy | #F4A460 |
| Dusty | #C0C0C0 |
| Martian | #FF4500 |
| Barren | #696969 |
| Marshy | #556B2F |
| Gaseous | #FFA500 |
| Methane | #4169E1 |

## 🚀 Variantes Multiples (Gaseous)

Le dossier `Gaseous/` contient 17 textures différentes !

**Future amélioration possible :**
Sélection aléatoire parmi les variantes pour plus de diversité visuelle.

---

**✅ Toutes les textures sont présentes et fonctionnelles !**

Testez maintenant : `solarSystemScript.routeHandler.navigateToKeplerSystem('Kepler-11')`
