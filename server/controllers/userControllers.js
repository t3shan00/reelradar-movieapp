import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

const { sign } = jwt;

// Register a new user
export const register = async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Insert the user into the database
        const result = await pool.query(
            'INSERT INTO users (email, username, "passwordhash") VALUES ($1, $2, $3) RETURNING *',
            [email, username, hashedPassword] 
        );

        const user = result.rows[0];
        res.status(201).json({
            id: user.userid, 
            email: user.email,
            username: user.username,
        });
    } catch (err) {
        next(err);
    }
};

// Log in an existing user
export const login = async (req, res, next) => {
    const { identifier, password } = req.body; 
    const invalidMessage = "Invalid credentials.";

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $1',
            [identifier]
        );

        if (result.rowCount === 0) {
            return next(new Error(invalidMessage)); // User not found
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password
        const isMatch = await compare(password, user.passwordhash); 

        if (!isMatch) {
            return next(new Error(invalidMessage)); 
        }

        // Generate a JWT
        const token = sign(
            { userId: user.userid, email: user.email, username: user.username }, 
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" } 
        );

        res.status(200).json({
            id: user.userid,
            email: user.email,
            username: user.username,
            token: token,
        });
    } catch (err) {
        next(err);
    }
};