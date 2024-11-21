-- Users Table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Reviews Table
-- CREATE TABLE Reviews (
--     ReviewID SERIAL PRIMARY KEY,
--     UserID INT NOT NULL,
--     TMDB_MovieID INT NOT NULL, -- TMDB Movie ID
--     Rating SMALLINT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
--     ReviewText TEXT,
--     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_user FOREIGN KEY (UserID) REFERENCES Users (UserID) ON DELETE CASCADE
-- );

-- -- Favorites Table
-- CREATE TABLE Favorites (
--     FavoriteID SERIAL PRIMARY KEY,
--     UserID INT NOT NULL,
--     TMDB_MovieID INT NOT NULL, -- TMDB Movie ID
--     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_user_fav FOREIGN KEY (UserID) REFERENCES Users (UserID) ON DELETE CASCADE,
--     CONSTRAINT unique_favorite UNIQUE (UserID, TMDB_MovieID)
-- );

-- -- Groups Table
-- CREATE TABLE Groups (
--     GroupID SERIAL PRIMARY KEY,
--     GroupName VARCHAR(255) NOT NULL,
--     CreatedBy INT NOT NULL, -- Reference to the user who created the group
--     CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_created_by FOREIGN KEY (CreatedBy) REFERENCES Users (UserID) ON DELETE CASCADE
-- );

-- -- Group Members Table
-- CREATE TABLE GroupMembers (
--     MemberID SERIAL PRIMARY KEY,
--     GroupID INT NOT NULL,
--     UserID INT NOT NULL,
--     AddedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_group FOREIGN KEY (GroupID) REFERENCES Groups (GroupID) ON DELETE CASCADE,
--     CONSTRAINT fk_user_member FOREIGN KEY (UserID) REFERENCES Users (UserID) ON DELETE CASCADE,
--     CONSTRAINT unique_member UNIQUE (GroupID, UserID)
-- );