/**
 * Sidebar Toggle Functionality - Version Space_v1
 * Gère l'affichage/masquage de la sidebar avec bouton hamburger flottant
 */

// Sidebar toggle - Version simplifiée et robuste
function setupSidebarToggle() {
  console.log('Initialisation sidebar toggle...');
  
  const panel = document.getElementById('settings-panel');
  if (!panel) {
    console.error('Panel settings-panel non trouve');
    return;
  }

  // Supprimer l'ancien bouton s'il existe
  const oldBtn = document.getElementById('settings-toggle-float');
  if (oldBtn) {
    oldBtn.remove();
  }

  // Créer le bouton hamburger
  const hamburgerBtn = document.createElement('button');
  hamburgerBtn.id = 'settings-toggle-float';
  hamburgerBtn.innerHTML = '☰';
  
  // Styles du bouton
  hamburgerBtn.style.cssText = `
    position: fixed;
    left: 15px;
    top: 15px;
    width: 50px;
    height: 50px;
    background: rgba(0, 40, 80, 0.9);
    border: 2px solid #00ffff;
    border-radius: 10px;
    color: #00ffff;
    font-size: 20px;
    cursor: pointer;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    transition: all 0.3s ease;
  `;

  // Ajouter le bouton au body
  document.body.appendChild(hamburgerBtn);

  // État initial : sidebar fermée
  panel.classList.remove('open');
  panel.style.left = '-270px';

  // Fonction toggle
  const toggleSidebar = () => {
    const isOpen = panel.classList.contains('open');
    
    if (isOpen) {
      // Fermer
      panel.classList.remove('open');
      panel.style.left = '-270px';
      hamburgerBtn.style.display = 'flex';
      console.log('Sidebar fermee');
    } else {
      // Ouvrir
      panel.classList.add('open');
      panel.style.left = '0px';
      hamburgerBtn.style.display = 'none';
      console.log('Sidebar ouverte');
    }
  };

  // Event listeners
  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  // Fermer en cliquant à l'extérieur
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target)) {
      toggleSidebar();
    }
  });

  // Empêcher la fermeture en cliquant dans la sidebar
  panel.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Raccourci clavier H
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'h') {
      toggleSidebar();
    }
  });

  console.log('Sidebar toggle initialise avec succes');
}

// Auto-initialisation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupSidebarToggle);
} else {
  setupSidebarToggle();
}

// Export pour utilisation externe
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupSidebarToggle };
}

// Global pour accès depuis la console
window.setupSidebarToggle = setupSidebarToggle;

console.log("✅ Sidebar Toggle (Space_v1 style) initialisé");
