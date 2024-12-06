import { pool } from "../utils/db.js";

// Create a new user
export const createUser = async (email, username, hashedPassword) => {
    const query = `
        INSERT INTO users (email, username, "passwordhash")
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [email, username, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Find a user by email or username
export const findUserByIdentifier = async (identifier) => {
    const query = `
        SELECT * FROM users
        WHERE email = $1 OR username = $1;
    `;
    const values = [identifier];
    const result = await pool.query(query, values);
    return result.rows[0]; 
};

export const findUserByUsername = async (username) => {
    const query = `
      SELECT * FROM users WHERE username = $1;
    `;
    const result = await pool.query(query, [username]);
    return result.rows[0];
  };
  

// Delete a user by ID
export const deleteUserById = async (userId) => {
    return pool.query("DELETE FROM Users WHERE UserID = $1", [userId]);
  };

  export const findUserByEmail = async (email) => {
    const query = `
      SELECT * FROM Users WHERE Email = $1;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  };
  
  // Update reset token for a user
  export const savePasswordResetToken = async (userId, token) => {
    const query = `
      UPDATE Users SET ResetToken = $1, ResetTokenExpiry = $2 WHERE UserID = $3;
    `;
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await pool.query(query, [token, expiry, userId]);
  };
  
  // Update the user's password
  export const updateUserPassword = async (userId, hashedPassword) => {
    const query = `
      UPDATE Users SET PasswordHash = $1, ResetToken = NULL, ResetTokenExpiry = NULL WHERE UserID = $2;
    `;
    await pool.query(query, [hashedPassword, userId]);
  };
  
  // Verify reset token
  export const verifyResetToken = async (token) => {
    const query = `
      SELECT * FROM Users WHERE ResetToken = $1 AND ResetTokenExpiry > NOW();
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0];
  };

  export const checkExistingUser = async (email, username) => {
    // First check email
    const emailCheck = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    
    if (emailCheck.rows.length > 0) {
        throw new Error('Email already exists');
    }
    
    // Then check username
    const usernameCheck = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    
    if (usernameCheck.rows.length > 0) {
        throw new Error('Username already exists');
    }
    
    return true;
};