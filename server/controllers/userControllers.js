import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByIdentifier } from '../Models/userModels.js';

const { sign } = jwt;

// Register a new user
export const register = async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Insert the user into the database using the model
        const user = await createUser(email, username, hashedPassword);

        // Respond with the created user
        res.status(201).json({
            id: user.userid,
            email: user.email,
            username: user.username,
        });
    } catch (err) {
        // Check for unique constraint violation
        if (err.code === "23505") {
            const field = err.constraint.includes("email") ? "Email" : "Username";
            return res.status(400).json({ error: `${field} already exists.` });
        }
        next(err);
    }
};

// Log in an existing user
export const login = async (req, res, next) => {
    const { identifier, password } = req.body;
    const invalidMessage = "Invalid credentials.";

    try {
        // Find the user by email or username
        const user = await findUserByIdentifier(identifier);

        if (!user) {
            return next(new Error(invalidMessage)); // User not found
        }

        // Compare the provided password with the hashed password
        const isMatch = await compare(password, user.passwordhash);

        if (!isMatch) {
            return next(new Error(invalidMessage)); // Password mismatch
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
