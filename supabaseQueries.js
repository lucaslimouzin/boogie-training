/*
TODO: To fix the delete functionality, you need to:
1. Enable Row Level Security (RLS) on the reels table:
   ALTER TABLE reels ENABLE ROW LEVEL SECURITY;

2. Create a policy to allow delete operations:
   CREATE POLICY "Users can delete their own reels" 
   ON reels
   FOR DELETE 
   TO authenticated
   USING (auth.uid() = user_id);

Run these SQL commands in your Supabase SQL editor or add them to your migrations.
*/

// Fonctions pour les requêtes Supabase
const supabaseQueries = {
    // Récupérer tous les reels
    getAllReels: async () => {
        try {
            const { data, error } = await supabase
                .from('reels')
                .select('*')
                .order('position', { ascending: true });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur getAllReels:', error);
            return { data: null, error };
        }
    },

    // Récupérer les reels en cours de training
    getTrainingReels: async () => {
        try {
            const { data, error } = await supabase
                .from('reels')
                .select('*')
                .eq('status', 'En cours de training')
                .order('position', { ascending: true });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur getTrainingReels:', error);
            return { data: null, error };
        }
    },

    // Ajouter un nouveau reel
    addReel: async (reelData) => {
        try {
            // Récupérer la position maximale actuelle
            const { data: maxPositionData, error: maxPositionError } = await supabase
                .from('reels')
                .select('position')
                .order('position', { ascending: false })
                .limit(1);

            if (maxPositionError) throw maxPositionError;

            // Commencer à 1 si aucun reel n'existe, sinon prendre la position max + 1
            const newPosition = maxPositionData.length > 0 ? (maxPositionData[0].position + 1) : 1;
            const reelWithPosition = { ...reelData, position: newPosition };

            const { data, error } = await supabase
                .from('reels')
                .insert([reelWithPosition])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur addReel:', error);
            return { data: null, error };
        }
    },

    // Mettre à jour le statut d'un reel
    updateReelStatus: async (reelId, newStatus) => {
        try {
            const { error } = await supabase
                .from('reels')
                .update({ status: newStatus })
                .eq('id', reelId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur updateReelStatus:', error);
            return { error };
        }
    },

    // Rechercher des reels
    searchReels: async (searchTerm, status = 'all') => {
        try {
            let query = supabase
                .from('reels')
                .select('*')
                .order('position', { ascending: true });

            if (status !== 'all') {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Filtrer les résultats côté client pour la recherche textuelle
            const filteredData = searchTerm 
                ? data.filter(reel => 
                    reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    reel.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                : data;

            return { data: filteredData, error: null };
        } catch (error) {
            console.error('Erreur searchReels:', error);
            return { data: null, error };
        }
    },

    // Supprimer un reel
    deleteReel: async (reelId) => {
        try {
            const { error } = await supabase
                .from('reels')
                .delete()
                .eq('id', reelId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur deleteReel:', error);
            return { error };
        }
    },

    // Mettre à jour la position d'un reel
    updateReelPosition: async (reelId, newPosition) => {
        try {
            const { error } = await supabase
                .from('reels')
                .update({ position: newPosition })
                .eq('id', reelId);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur updateReelPosition:', error);
            return { error };
        }
    },

    // Mettre à jour les positions de plusieurs reels
    updateReelsPositions: async (updates) => {
        try {
            // Utiliser une transaction pour mettre à jour toutes les positions
            const { error } = await supabase.rpc('update_reel_positions', {
                position_updates: updates.map(update => ({
                    reel_id: update.id,
                    new_position: update.position
                }))
            });

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur updateReelsPositions:', error);
            return { error };
        }
    },

    // Fonctions pour la table motivation
    getAllMotivations: async () => {
        try {
            const { data, error } = await supabase
                .from('motivation')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur getAllMotivations:', error);
            return { data: null, error };
        }
    },

    addMotivation: async (text) => {
        try {
            const { data, error } = await supabase
                .from('motivation')
                .insert([{ text }])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur addMotivation:', error);
            return { data: null, error };
        }
    },

    deleteMotivation: async (id) => {
        try {
            const { error } = await supabase
                .from('motivation')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur deleteMotivation:', error);
            return { error };
        }
    },

    // Fonctions pour la table todolist
    getAllTodos: async () => {
        try {
            const { data, error } = await supabase
                .from('todolist')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur getAllTodos:', error);
            return { data: null, error };
        }
    },

    addTodo: async (text) => {
        try {
            const { data, error } = await supabase
                .from('todolist')
                .insert([{ text }])
                .select()
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Erreur addTodo:', error);
            return { data: null, error };
        }
    },

    deleteTodo: async (id) => {
        try {
            const { error } = await supabase
                .from('todolist')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { error: null };
        } catch (error) {
            console.error('Erreur deleteTodo:', error);
            return { error };
        }
    }
}; 