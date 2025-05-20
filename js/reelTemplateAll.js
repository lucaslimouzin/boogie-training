// Fonction pour générer le HTML d'un reel
const createReelCard = (reel) => {
    return `
        <div class="reel-card" data-id="${reel.id}">
            <div class="reel-header">
                <div class="reel-title-status">
                    <h3 class="reel-title">${reel.title}</h3>
                    <span class="reel-status ${reel.status.toLowerCase().replace(/ /g, '-')}">${reel.status}</span>
                </div>
                <div class="reel-tags">
                    ${reel.tags.map(tag => `<span class="reel-tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="instagram-embed-container">
                <blockquote 
                    class="instagram-media" 
                    data-instgrm-permalink="${reel.url}"
                    data-instgrm-version="14"
                    style="min-height:500px; background:#FFF; border:0; margin:0; padding:0;">
                </blockquote>
            </div>
            <div class="reel-actions">
                <button class="change-status-btn" data-reel-id="${reel.id}">
                    Changer le statut
                </button>
                <button class="delete-btn" data-reel-id="${reel.id}" title="Supprimer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `;
};

// Fonction pour afficher les reels dans un conteneur
const displayReels = (reels, container) => {
    container.innerHTML = '';
    
    if (!reels || reels.length === 0) {
        container.innerHTML = '<div class="error-message">Aucun reel trouvé</div>';
        return;
    }
    
    reels.forEach(reel => {
        container.innerHTML += createReelCard(reel);
    });

    // Recharger le script Instagram
    if (window.instgrm) {
        window.instgrm.Embeds.process();
    } else {
        const script = document.createElement('script');
        script.src = '//www.instagram.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
    }

    // Ajouter les écouteurs pour les boutons
    setupEventListeners(container);
};

// Fonction pour configurer les écouteurs d'événements
const setupEventListeners = (container) => {
    // Gestionnaire pour les boutons de changement de statut
    container.querySelectorAll('.change-status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const reelId = e.target.dataset.reelId;
            const statusModal = document.getElementById('changeStatusModal');
            
            // S'assurer que l'ID est un nombre
            window.currentReelId = parseInt(reelId, 10);
            
            if (isNaN(window.currentReelId)) {
                console.error('ID invalide:', reelId);
                alert('Erreur: ID du reel invalide');
                return;
            }
            
            statusModal.style.display = 'block';
        });
    });

    // Gestionnaire pour les boutons de suppression
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce reel ?')) {
                const reelId = e.target.closest('.delete-btn').dataset.reelId;
                const { error } = await supabaseQueries.deleteReel(reelId);
                
                if (error) {
                    console.error('Erreur lors de la suppression:', error);
                    alert('Erreur lors de la suppression du reel');
                    return;
                }

                // Recharger les reels après la suppression
                const reloadReels = window.reloadReels || (async () => {
                    const { data } = await supabaseQueries.getAllReels();
                    displayReels(data, container);
                });
                await reloadReels();
            }
        });
    });
};

// Exporter les fonctions pour une utilisation dans d'autres fichiers
export { createReelCard, displayReels, setupEventListeners }; 