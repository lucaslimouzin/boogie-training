/**
 * Nettoie une URL Instagram en retirant les paramètres de requête
 * @param {string} url - L'URL Instagram à nettoyer
 * @returns {string} L'URL nettoyée
 */
export const cleanInstagramUrl = (url) => {
    try {
        // Vérifie si l'URL est valide
        const urlObj = new URL(url);
        
        // Vérifie si c'est une URL Instagram
        if (!urlObj.hostname.includes('instagram.com')) {
            throw new Error('URL non valide : ce n\'est pas une URL Instagram');
        }

        // Vérifie si c'est un reel
        if (!urlObj.pathname.includes('/reel/')) {
            throw new Error('URL non valide : ce n\'est pas un reel Instagram');
        }

        // Extrait le chemin jusqu'au code du reel
        const reelPath = urlObj.pathname.match(/\/reel\/[^\/]+\//);
        if (!reelPath) {
            throw new Error('URL non valide : format de reel incorrect');
        }

        // Reconstruit l'URL propre
        return `https://www.instagram.com${reelPath[0]}`;
    } catch (error) {
        // Si l'URL est invalide, on renvoie l'erreur
        throw new Error(`URL invalide : ${error.message}`);
    }
}; 