# Script PowerShell pour tester le système d'éclairage
# Projet NASA Space App - Test d'éclairage et ombres

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "   🌟 TEST SYSTÈME D'ÉCLAIRAGE - NASA SPACE APP 🌟" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier le répertoire actuel
$currentDir = Get-Location
Write-Host "📂 Répertoire actuel: $currentDir" -ForegroundColor Green

# Naviguer vers le dossier Space si nécessaire
if (-not (Test-Path "package.json")) {
    if (Test-Path "Front_interface\Space") {
        Set-Location "Front_interface\Space"
        Write-Host "✅ Navigation vers Front_interface\Space" -ForegroundColor Green
    } elseif (Test-Path "..\Space") {
        Set-Location "..\Space"
        Write-Host "✅ Navigation vers Space" -ForegroundColor Green
    } else {
        Write-Host "❌ Impossible de trouver le dossier Space" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "   VÉRIFICATION DES FICHIERS MODIFIÉS" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

$filesToCheck = @(
    "src\script.js",
    "src\js\objects\Sun.js",
    "src\js\objects\Planet.js",
    "src\js\core\SolarSystemEngine.js",
    "src\js\core\RealisticSolarSystemEngine.js",
    "SYSTEME_ECLAIRAGE_OMBRES.md",
    "GUIDE_TEST_ECLAIRAGE.md",
    "test-lighting-system.html"
)

$allFilesExist = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (MANQUANT)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

if (-not $allFilesExist) {
    Write-Host "⚠️  Certains fichiers sont manquants!" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "   RÉSUMÉ DES CORRECTIONS" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 Corrections appliquées:" -ForegroundColor White
Write-Host "   ✅ Lumière ambiante réduite (2.5 → 0.08)" -ForegroundColor Green
Write-Host "   ✅ Intensité PointLight optimisée (25 → 4)" -ForegroundColor Green
Write-Host "   ✅ Decay physiquement réaliste (1.8 → 2)" -ForegroundColor Green
Write-Host "   ✅ Suppression DirectionalLight redondante" -ForegroundColor Green
Write-Host "   ✅ Shadow maps haute résolution (4096x4096)" -ForegroundColor Green
Write-Host "   ✅ Matériaux optimisés (MeshPhongMaterial)" -ForegroundColor Green
Write-Host "   ✅ Anneaux réactifs à la lumière" -ForegroundColor Green
Write-Host "   ✅ Configuration ombres complète" -ForegroundColor Green
Write-Host ""

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host "   OPTIONS DE TEST" -ForegroundColor Yellow
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choisissez une option:" -ForegroundColor White
Write-Host ""
Write-Host "  [1] Démarrer le serveur de développement" -ForegroundColor Cyan
Write-Host "  [2] Ouvrir la documentation (SYSTEME_ECLAIRAGE_OMBRES.md)" -ForegroundColor Cyan
Write-Host "  [3] Ouvrir le guide de test (GUIDE_TEST_ECLAIRAGE.md)" -ForegroundColor Cyan
Write-Host "  [4] Ouvrir l'outil de test automatique (test-lighting-system.html)" -ForegroundColor Cyan
Write-Host "  [5] Afficher les commandes de test" -ForegroundColor Cyan
Write-Host "  [6] Vérifier les dépendances npm" -ForegroundColor Cyan
Write-Host "  [0] Quitter" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host "Votre choix"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Démarrage du serveur de développement..." -ForegroundColor Green
        Write-Host ""
        Write-Host "📌 Une fois le serveur démarré:" -ForegroundColor Yellow
        Write-Host "   1. Ouvrez http://localhost:5173" -ForegroundColor White
        Write-Host "   2. Observez les planètes (côté jour vs côté nuit)" -ForegroundColor White
        Write-Host "   3. Vérifiez les ombres des lunes sur les planètes" -ForegroundColor White
        Write-Host "   4. Testez un système Kepler" -ForegroundColor White
        Write-Host ""
        Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
        Write-Host ""
        
        npm run dev
    }
    
    "2" {
        Write-Host ""
        Write-Host "📖 Ouverture de la documentation..." -ForegroundColor Green
        if (Test-Path "SYSTEME_ECLAIRAGE_OMBRES.md") {
            Start-Process "SYSTEME_ECLAIRAGE_OMBRES.md"
            Write-Host "✅ Fichier ouvert" -ForegroundColor Green
        } else {
            Write-Host "❌ Fichier non trouvé" -ForegroundColor Red
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "📖 Ouverture du guide de test..." -ForegroundColor Green
        if (Test-Path "GUIDE_TEST_ECLAIRAGE.md") {
            Start-Process "GUIDE_TEST_ECLAIRAGE.md"
            Write-Host "✅ Fichier ouvert" -ForegroundColor Green
        } else {
            Write-Host "❌ Fichier non trouvé" -ForegroundColor Red
        }
    }
    
    "4" {
        Write-Host ""
        Write-Host "🔬 Ouverture de l'outil de test automatique..." -ForegroundColor Green
        if (Test-Path "test-lighting-system.html") {
            Start-Process "test-lighting-system.html"
            Write-Host "✅ Fichier ouvert dans le navigateur" -ForegroundColor Green
            Write-Host ""
            Write-Host "⚠️  IMPORTANT: Chargez d'abord l'application principale," -ForegroundColor Yellow
            Write-Host "   puis rafraîchissez la page de test." -ForegroundColor Yellow
        } else {
            Write-Host "❌ Fichier non trouvé" -ForegroundColor Red
        }
    }
    
    "5" {
        Write-Host ""
        Write-Host "==============================================================" -ForegroundColor Cyan
        Write-Host "   COMMANDES DE TEST DANS LA CONSOLE DU NAVIGATEUR" -ForegroundColor Yellow
        Write-Host "==============================================================" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "📊 Vérifier l'éclairage:" -ForegroundColor White
        Write-Host "   console.log('PointLight:', pointLight);" -ForegroundColor Gray
        Write-Host "   console.log('Intensité:', pointLight.intensity);" -ForegroundColor Gray
        Write-Host "   console.log('Decay:', pointLight.decay);" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "🌑 Vérifier les ombres:" -ForegroundColor White
        Write-Host "   console.log('Ombres:', pointLight.castShadow);" -ForegroundColor Gray
        Write-Host "   console.log('Shadow Map:', pointLight.shadow.mapSize);" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "💡 Modifier l'intensité (test):" -ForegroundColor White
        Write-Host "   pointLight.intensity = 4;  // Recommandé" -ForegroundColor Gray
        Write-Host "   lightAmbient.intensity = 0.08;  // Recommandé" -ForegroundColor Gray
        Write-Host ""
        
        Write-Host "🔍 Compter les objets avec ombres:" -ForegroundColor White
        Write-Host "   let count = 0;" -ForegroundColor Gray
        Write-Host "   scene.traverse(obj => { if (obj.castShadow) count++; });" -ForegroundColor Gray
        Write-Host "   console.log('Objets avec ombres:', count);" -ForegroundColor Gray
        Write-Host ""
    }
    
    "6" {
        Write-Host ""
        Write-Host "📦 Vérification des dépendances npm..." -ForegroundColor Green
        Write-Host ""
        
        if (Test-Path "package.json") {
            Write-Host "✅ package.json trouvé" -ForegroundColor Green
            
            if (Test-Path "node_modules") {
                Write-Host "✅ node_modules existe" -ForegroundColor Green
                Write-Host ""
                Write-Host "Voulez-vous mettre à jour les dépendances? (y/N)" -ForegroundColor Yellow
                $update = Read-Host
                if ($update -eq "y" -or $update -eq "Y") {
                    npm install
                }
            } else {
                Write-Host "⚠️  node_modules absent" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "Installation des dépendances..." -ForegroundColor Green
                npm install
            }
        } else {
            Write-Host "❌ package.json non trouvé" -ForegroundColor Red
        }
    }
    
    "0" {
        Write-Host ""
        Write-Host "👋 Au revoir!" -ForegroundColor Green
        Write-Host ""
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Option invalide" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 Documentation disponible:" -ForegroundColor White
Write-Host "   • SYSTEME_ECLAIRAGE_OMBRES.md - Documentation technique complète" -ForegroundColor Gray
Write-Host "   • GUIDE_TEST_ECLAIRAGE.md - Guide de test détaillé" -ForegroundColor Gray
Write-Host "   • CORRECTIONS_ECLAIRAGE.md - Récapitulatif des corrections" -ForegroundColor Gray
Write-Host "   • test-lighting-system.html - Outil de test automatique" -ForegroundColor Gray
Write-Host ""
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

# Attendre avant de fermer
Write-Host "Appuyez sur une touche pour fermer..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
