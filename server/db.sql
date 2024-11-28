-- Users Table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Reviews Table
CREATE TABLE Reviews (
    ReviewID SERIAL PRIMARY KEY,
    MovieID INT NOT NULL,
    UserID INT NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    ReviewText TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites Table
CREATE TABLE Favorites (
    FavoriteID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    TMDB_MovieID INT NOT NULL, -- TMDB Movie ID
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_fav FOREIGN KEY (UserID) REFERENCES Users (UserID) ON DELETE CASCADE,
    CONSTRAINT unique_favorite UNIQUE (UserID, TMDB_MovieID)
);

-- Create groups table
CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(UserID),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create group_members table
CREATE TABLE group_members (
    member_id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(UserID) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- Create join_requests table
CREATE TABLE join_requests (
    request_id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(UserID) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    UNIQUE(group_id, user_id)
);

-- Create indexes
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_groups_created_by ON groups(created_by);

--Alterations
ALTER TABLE groups ADD CONSTRAINT unique_group_creator UNIQUE (group_id, created_by);

