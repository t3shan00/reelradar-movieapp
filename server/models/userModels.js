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