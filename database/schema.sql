-- Oblique Strategies Database Schema for Turso (SQLite)

-- Users table to store Firebase auth users
CREATE TABLE users (
    id TEXT PRIMARY KEY,                    -- Firebase UID
    email TEXT,                             -- User email (nullable for anonymous)
    display_name TEXT,                      -- User's display name
    is_anonymous BOOLEAN NOT NULL DEFAULT 0, -- Is anonymous user
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced strategies table (moved from JSON to database)
CREATE TABLE strategies (
    id INTEGER PRIMARY KEY,
    text TEXT NOT NULL,
    category TEXT,                          -- For future categorization
    tags TEXT,                             -- JSON array of tags
    view_count INTEGER DEFAULT 0,          -- Global popularity tracking
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User favorites
CREATE TABLE user_favorites (
    user_id TEXT NOT NULL,
    strategy_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, strategy_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE CASCADE
);

-- User viewing history
CREATE TABLE user_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    strategy_id INTEGER NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    source TEXT,                           -- 'random', 'search', 'daily', 'favorites'
    session_id TEXT,                       -- Optional: group views by session
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE CASCADE
);

-- User preferences/settings
CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY,
    theme TEXT DEFAULT 'light',            -- 'light', 'dark', 'system'
    daily_reminders BOOLEAN DEFAULT 0,     -- Enable daily notifications
    timezone TEXT DEFAULT 'UTC',           -- User's timezone
    preferences_json TEXT,                 -- Additional JSON preferences
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_user_history_viewed_at ON user_history(viewed_at);
CREATE INDEX idx_strategies_view_count ON strategies(view_count);

-- Triggers to update timestamps
CREATE TRIGGER update_users_timestamp 
    AFTER UPDATE ON users 
    BEGIN 
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_user_preferences_timestamp 
    AFTER UPDATE ON user_preferences 
    BEGIN 
        UPDATE user_preferences SET updated_at = CURRENT_TIMESTAMP WHERE user_id = NEW.user_id;
    END;

-- Insert the existing strategies from JSON (you'll need to migrate this data)
-- This will be done programmatically when setting up Turso