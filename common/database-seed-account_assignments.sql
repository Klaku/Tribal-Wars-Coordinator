INSERT INTO users (user_id, user_name, user_email)
SELECT 
    p.player_id::text,
    p.player_name,
    p.player_id::text || '@gmail.com'
FROM players p
LEFT JOIN users u ON u.user_id = p.player_id::text
WHERE u.user_id IS NULL;

INSERT INTO account_assignments (user_id, player_id)
SELECT 
    p.player_id::text,
    p.player_id
from players p
LEFT JOIN account_assignments aa ON aa.player_id = p.player_id
WHERE aa.player_id IS NULL;
