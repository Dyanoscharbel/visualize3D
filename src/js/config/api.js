/**
 * Configuration centralisée des APIs
 */

// Détection automatique de l'environnement
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_CONFIG = {
    // Backend principal pour les exoplanètes et le chatbot
    BACKEND_BASE_URL: isProduction 
        ? 'https://backend-space.onrender.com' 
        : 'http://localhost:3001',
    
    // Endpoints spécifiques
    ENDPOINTS: {
        EXOPLANETS: '/api/exoplanets',
        CHAT_SEND: '/api/chat/send',
        CHAT_CONVERSATION: '/api/chat/conversation',
        SYNC: '/api/sync',
        HEALTH: '/health'
    }
};

// Helper pour construire des URLs complètes
export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BACKEND_BASE_URL}${endpoint}`;
};

// Log de la configuration pour debugging
console.log('🔧 API Configuration:', {
    environment: isProduction ? 'production' : 'development',
    backendUrl: API_CONFIG.BACKEND_BASE_URL,
    hostname: window.location.hostname
});