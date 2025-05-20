-- Créer un type personnalisé pour les mises à jour de position
CREATE TYPE position_update AS (
    reel_id bigint,
    new_position integer
);

-- Créer la fonction pour mettre à jour les positions
CREATE OR REPLACE FUNCTION update_reel_positions(position_updates position_update[])
RETURNS void AS $$
BEGIN
    -- Mettre à jour chaque position individuellement
    FOR i IN 1..array_length(position_updates, 1) LOOP
        UPDATE reels
        SET position = (position_updates[i]).new_position
        WHERE id = (position_updates[i]).reel_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 