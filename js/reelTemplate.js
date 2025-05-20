// Fonction pour générer le HTML d'un reel
const createReelCard = (reel) => {
    return `
        <div class="reel-card" data-id="${reel.id}" data-position="${reel.position}">
            <div class="reel-header">
                <div class="position-controls">
                    <div class="position-arrows">
                        <button class="arrow-btn move-up" title="Monter" data-reel-id="${reel.id}">↑</button>
                        <button class="arrow-btn move-down" title="Descendre" data-reel-id="${reel.id}">↓</button>
                    </div>
                    <span class="position-number">#${reel.position}</span>
                </div>
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

    // Trier les reels par position
    const sortedReels = [...reels].sort((a, b) => (a.position || 0) - (b.position || 0));
    
    sortedReels.forEach(reel => {
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

    // Désactiver les flèches appropriées
    updateArrowButtons(container);
};

// Fonction pour mettre à jour l'état des boutons flèches
const updateArrowButtons = (container) => {
    const cards = Array.from(container.querySelectorAll('.reel-card'));
    cards.forEach((card, index) => {
        const upButton = card.querySelector('.move-up');
        const downButton = card.querySelector('.move-down');
        
        if (index === 0) upButton.disabled = true;
        if (index === cards.length - 1) downButton.disabled = true;
    });
};

// Fonction pour échanger les positions de deux reels
const swapPositions = async (container, currentId, targetId) => {
    try {
        const currentCard = container.querySelector(`[data-id="${currentId}"]`);
        const targetCard = container.querySelector(`[data-id="${targetId}"]`);
        
        const currentPos = parseInt(currentCard.dataset.position);
        const targetPos = parseInt(targetCard.dataset.position);

        // Mettre à jour les positions dans la base de données
        const updates = [
            { id: parseInt(currentId), position: targetPos },
            { id: parseInt(targetId), position: currentPos }
        ];

        const { error } = await supabaseQueries.updateReelsPositions(updates);
        if (error) throw error;

        // Recharger les reels pour refléter le nouvel ordre
        const { data: reels } = await supabaseQueries.getAllReels();
        displayReels(reels, container);

        // Afficher un message de succès
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Position mise à jour avec succès !';
        container.insertAdjacentElement('beforebegin', successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    } catch (error) {
        console.error('Erreur lors de l\'échange des positions:', error);
        alert('Une erreur est survenue lors de la mise à jour des positions');
    }
};

// Fonction pour configurer les écouteurs d'événements
const setupEventListeners = (container) => {
    // Gestionnaire pour les boutons de déplacement
    container.querySelectorAll('.move-up, .move-down').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const currentCard = e.target.closest('.reel-card');
            const isMovingUp = e.target.classList.contains('move-up');
            const cards = Array.from(container.querySelectorAll('.reel-card'));
            const currentIndex = cards.indexOf(currentCard);
            
            if ((isMovingUp && currentIndex > 0) || (!isMovingUp && currentIndex < cards.length - 1)) {
                const targetCard = cards[isMovingUp ? currentIndex - 1 : currentIndex + 1];
                await swapPositions(container, currentCard.dataset.id, targetCard.dataset.id);
            }
        });
    });

    // Gestionnaire pour les boutons de changement de statut
    container.querySelectorAll('.change-status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const reelId = e.target.dataset.reelId;
            const statusModal = document.getElementById('changeStatusModal');
            window.currentReelId = reelId;
            statusModal.style.display = 'block';
        });
    });

    // Gestionnaire pour les boutons de suppression
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ? Cette action est irréversible et supprimera définitivement la vidéo de votre bibliothèque.')) {
                const reelId = e.target.closest('.delete-btn').dataset.reelId;
                const { error } = await supabaseQueries.deleteReel(reelId);
                
                if (error) {
                    console.error('Erreur lors de la suppression:', error);
                    alert('Erreur lors de la suppression de la vidéo');
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