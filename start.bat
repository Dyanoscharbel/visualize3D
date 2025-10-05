@echo off
echo 🌌 Solar System Explorer 2.0
echo =============================
echo.

echo 📦 Installation des dépendances...
call npm install

echo.
echo 🚀 Démarrage du serveur de développement...
echo.
echo 🌐 L'application sera disponible sur:
echo    - Local:   http://localhost:3000
echo    - Réseau:  http://[votre-ip]:3000
echo.
echo 💡 Raccourcis utiles:
echo    - Espace: Pause/Play animation
echo    - R: Vue d'ensemble
echo    - Ctrl+F: Recherche
echo    - Échap: Fermer panneau
echo.

call npm run dev

pause
