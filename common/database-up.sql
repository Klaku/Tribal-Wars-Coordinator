-- ====================
-- TABLE: tribes
-- ====================
CREATE TABLE tribes (
    tribe_id INT PRIMARY KEY,
    tribe_name TEXT NOT NULL,
    tribe_tag TEXT NOT NULL
);

-- ====================
-- TABLE: players
-- ====================
CREATE TABLE players (
    player_id INT PRIMARY KEY,
    player_name TEXT NOT NULL,
    tribe_id INT,
    FOREIGN KEY (tribe_id) REFERENCES tribes(tribe_id) ON DELETE SET NULL
);

-- ====================
-- TABLE: villages
-- ====================
CREATE TABLE villages (
    village_id INT PRIMARY KEY,
    village_name TEXT NOT NULL,
    village_x INT NOT NULL,
    village_y INT NOT NULL,
    player_id INT,
    village_points INT NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE SET NULL
);

-- ====================
-- TABLE: users
-- ====================
CREATE TABLE users (
    user_id TEXT PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL
);

-- ====================
-- TABLE: account_assignments
-- ====================
CREATE TABLE account_assignments (
    account_assignment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id TEXT NOT NULL,
    player_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- ====================
-- TABLE: role_assignments
-- ====================
CREATE TABLE role_assignments (
    role_assignment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_id INT NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ====================
-- TABLE: operations
-- ====================
CREATE TABLE operations (
    operation_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operation_name TEXT NOT NULL,
    operation_created INTEGER NOT NULL,
    operation_created_by INTEGER NOT NULL,
    FOREIGN KEY (operation_created_by) REFERENCES players(player_id) ON DELETE SET NULL
);

-- ====================
-- TABLE: operation_targets
-- ====================
CREATE TABLE operation_targets (
    operation_target_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    village_id INT NOT NULL,
    operation_id INT NOT NULL,
    FOREIGN KEY (village_id) REFERENCES villages(village_id) ON DELETE SET NULL,
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id) ON DELETE CASCADE
);

-- ====================
-- TABLE: operation_principals
-- ====================
CREATE TABLE operation_principals (
    operation_principal_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operation_principal_source INT NOT NULL,
    operation_principal_type INT NOT NULL,
    operation_id INT NOT NULL,
    FOREIGN KEY (operation_principal_source) REFERENCES villages(village_id) ON DELETE SET NULL,
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id) ON DELETE CASCADE
);

-- ====================
-- TABLE: operation_commands
-- ====================
CREATE TABLE operation_commands (
    operation_command_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operation_command_target INT NOT NULL,
    operation_command_source INT NOT NULL,
    operation_command_type VARCHAR(255) NOT NULL,
    operation_command_result INT NOT NULL,
    operation_command_timestamp INT NOT NULL,
    operation_id INT NOT NULL,
    FOREIGN KEY (operation_id) REFERENCES operations(operation_id) ON DELETE CASCADE,
    FOREIGN KEY (operation_command_target) REFERENCES villages(village_id) ON DELETE CASCADE,
    FOREIGN KEY (operation_command_source) REFERENCES villages(village_id) ON DELETE CASCADE
);
