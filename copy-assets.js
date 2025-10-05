/**
 * Script pour copier les assets des exoplanètes vers le dossier public
 * pour que Vite puisse les servir en production
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyDir(src, dest) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        entry.isDirectory() 
            ? await copyDir(srcPath, destPath)
            : await fs.copyFile(srcPath, destPath);
    }
}

async function main() {
    try {
        console.log('🔄 Copying exoplanet textures to public folder...');
        
        const srcDir = path.join(__dirname, 'src', 'images', 'textures_exoplanet');
        const destDir = path.join(__dirname, 'images', 'textures_exoplanet');
        
        // Vérifier que le dossier source existe
        try {
            await fs.access(srcDir);
        } catch (error) {
            console.error('❌ Source directory not found:', srcDir);
            return;
        }
        
        // Supprimer le dossier de destination s'il existe
        try {
            await fs.rm(destDir, { recursive: true, force: true });
        } catch (error) {
            // Ignorer si le dossier n'existe pas
        }
        
        // Copier les textures
        await copyDir(srcDir, destDir);
        
        console.log('✅ Exoplanet textures copied successfully!');
        
        // Afficher les fichiers copiés
        const files = await fs.readdir(destDir);
        console.log(`📁 Copied ${files.length} texture folders:`);
        files.forEach(file => console.log(`   - ${file}`));
        
    } catch (error) {
        console.error('❌ Error copying textures:', error);
        process.exit(1);
    }
}

main();
