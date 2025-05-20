import { displayReels } from './js/reelTemplateAll.js';
import { cleanInstagramUrl } from './js/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('addReelModal');
    const statusModal = document.getElementById('changeStatusModal');
    const addBtn = document.getElementById('addReelBtn');
    const closeBtn = document.querySelector('.close');
    const closeStatusBtn = document.querySelector('.close-status');
    const addReelForm = document.getElementById('addReelForm');
    const reelsContainer = document.getElementById('reelsContainer');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    
    // Définir currentReelId comme une propriété de window pour le rendre accessible globalement
    window.currentReelId = null;

    let allReels = [];

    // Afficher le modal d'ajout
    addBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Fermer les modals
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    closeStatusBtn.addEventListener('click', () => {
        statusModal.style.display = 'none';
    });

    // Fermer les modals en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === statusModal) {
            statusModal.style.display = 'none';
        }
    });

    // Gérer le changement de statut
    document.querySelectorAll('.status-option').forEach(button => {
        button.addEventListener('click', async () => {
            const newStatus = button.dataset.status;
            
            try {
                // Vérifier que l'ID est bien défini
                if (!window.currentReelId) {
                    throw new Error('ID du reel non défini');
                }

                console.log('Tentative de mise à jour du statut');
                console.log('ID:', window.currentReelId);
                console.log('Nouveau statut:', newStatus);

                const { error } = await supabaseQueries.updateReelStatus(window.currentReelId, newStatus);

                if (error) throw error;

                // Fermer le modal
                statusModal.style.display = 'none';
                
                // Recharger les reels
                await loadReels();

                // Afficher le message de succès
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Statut mis à jour avec succès !';
                reelsContainer.insertAdjacentElement('afterbegin', successMessage);
                
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);

            } catch (error) {
                console.error('Erreur complète:', error);
                console.error('Stack trace:', error.stack);
                alert(`Erreur lors de la mise à jour du statut: ${error.message}`);
            }
        });
    });

    // Gérer l'ajout d'un reel
    addReelForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const reelData = {
                url: cleanInstagramUrl(document.getElementById('reelUrl').value),
                title: document.getElementById('reelTitle').value,
                tags: document.getElementById('reelTags').value.split(',').map(tag => tag.trim()),
                status: document.getElementById('reelStatus').value
            };

            const { error } = await supabaseQueries.addReel(reelData);

            if (error) throw error;

            // Recharger les reels
            await loadReels();
            
            // Réinitialiser et fermer le formulaire
            addReelForm.reset();
            modal.style.display = 'none';
        } catch (error) {
            console.error('Erreur lors de l\'ajout du reel:', error);
            alert('Une erreur est survenue lors de l\'ajout du reel : ' + error.message);
        }
    });

    // Fonction pour charger les reels
    async function loadReels() {
        try {
            reelsContainer.innerHTML = '<div class="loading">Chargement des reels...</div>';

            const searchTerm = searchInput.value.toLowerCase();
            const selectedStatus = statusFilter.value;

            const { data: reels, error } = await supabaseQueries.searchReels(searchTerm, selectedStatus);

            if (error) throw error;

            if (!reels || reels.length === 0) {
                reelsContainer.innerHTML = '<div class="error-message">Aucun reel trouvé</div>';
                return;
            }

            allReels = reels;
            displayReels(reels, reelsContainer);
        } catch (error) {
            console.error('Erreur lors du chargement des reels:', error);
            reelsContainer.innerHTML = `
                <div class="error-message">
                    Une erreur est survenue lors du chargement des reels.<br>
                    Erreur: ${error.message}
                </div>
            `;
        }
    }

    // Exposer la fonction loadReels pour le rechargement après suppression
    window.reloadReels = loadReels;

    // Événements pour la recherche et le filtrage
    searchInput.addEventListener('input', loadReels);
    statusFilter.addEventListener('change', loadReels);

    // Charger les reels au chargement de la page
    loadReels();
}); 