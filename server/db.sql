-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    ReviewID SERIAL PRIMARY KEY,
    MovieID INT NOT NULL,
    UserID INT NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    ReviewText TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add Rating Column to the Review Table
ALTER TABLE Reviews
ADD COLUMN Rating INT CHECK (Rating BETWEEN 1 AND 5);

-- Favorites Table
CREATE TABLE IF NOT EXISTS Favorites (
    FavoriteID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    TMDB_MovieID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_fav FOREIGN KEY (UserID) REFERENCES Users (UserID) ON DELETE CASCADE,
    CONSTRAINT unique_favorite UNIQUE (UserID, TMDB_MovieID)
);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(UserID),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group Members Table
CREATE TABLE IF NOT EXISTS group_members (
    member_id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(UserID) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- Join Requests Table
CREATE TABLE IF NOT EXISTS join_requests (
    request_id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(group_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(UserID) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    UNIQUE(group_id, user_id)
);

-- Movies Table
CREATE TABLE IF NOT EXISTS Movies (
    MovieID SERIAL PRIMARY KEY,
    TMDB_MovieID INT UNIQUE NOT NULL,
    Title VARCHAR(255) NOT NULL,
    ReleaseDate DATE,
    Runtime INT,
    Overview TEXT,
    PosterPath VARCHAR(255),
    BackdropPath VARCHAR(255),
    VoteAverage DECIMAL(3, 1),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Showtimes Table
CREATE TABLE IF NOT EXISTS Showtimes (
    ShowtimeID SERIAL PRIMARY KEY,
    MovieID INT REFERENCES Movies(MovieID) ON DELETE CASCADE,
    Theatre VARCHAR(255) NOT NULL,
    Auditorium VARCHAR(100),
    StartTime TIMESTAMP WITH TIME ZONE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (MovieID, StartTime, Theatre, Auditorium)
);

-- GroupMovies Table
CREATE TABLE IF NOT EXISTS GroupMovies (
    GroupMovieID SERIAL PRIMARY KEY,
    GroupID INT REFERENCES groups(group_id) ON DELETE CASCADE,
    MovieID INT REFERENCES Movies(MovieID) ON DELETE CASCADE,
    SharedByUserID INT REFERENCES Users(UserID),
    SharedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (GroupID, MovieID)
);

-- Create indexes if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_group_members_user_id') THEN
        CREATE INDEX idx_group_members_user_id ON group_members(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_group_members_group_id') THEN
        CREATE INDEX idx_group_members_group_id ON group_members(group_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_groups_created_by') THEN
        CREATE INDEX idx_groups_created_by ON groups(created_by);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_showtimes_movie_id') THEN
        CREATE INDEX idx_showtimes_movie_id ON Showtimes(MovieID);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_movies_tmdb_id') THEN
        CREATE INDEX idx_movies_tmdb_id ON Movies(TMDB_MovieID);
    END IF;
END $$;

-- Alterations if not exists
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'groups' AND constraint_name = 'unique_group_creator'
    ) THEN
        ALTER TABLE groups ADD CONSTRAINT unique_group_creator UNIQUE (group_id, created_by);
    END IF;
END $$;
