import { Router } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../utils/db.js";

const { sign } = jwt;
const userRouter = Router();

//Register route using email, username and password
userRouter.post("/register", (req, res, next) => {
    const { email, username, password } = req.body;

    hash(password, 10, (error, hashedPassword) => {
        if (error) return next(error); // Hashing error

        try {
            pool.query(
                "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *",
                [email, username, hashedPassword],
                (error, result) => {
                    if (error) return next(error); // Database error
                    const user = result.rows[0];
                    return res.status(201).json({
                        id: user.id,
                        email: user.email,
                        username: user.username,
                    });
                }
            );
        } catch (err) {
            return next(err);
        }
    });
});

//Login route using email or username and password
userRouter.post("/login", (req, res, next) => {
    const { identifier, password } = req.body; // identifier can be email or username
    const invalidMessage = "Invalid credentials.";

    try {
        pool.query(
            "SELECT * FROM users WHERE email = $1 OR username = $1",
            [identifier],
            (error, result) => {
                if (error) return next(error); // Database error
                if (result.rowCount === 0) return next(new Error(invalidMessage)); // User not found

                const user = result.rows[0];

                compare(password, user.password_hash, (error, match) => {
                    if (error) return next(error); // Hash comparison error
                    if (!match) return next(new Error(invalidMessage)); // Password mismatch

                    // Generate JWT
                    const token = sign(
                        { userId: user.id, email: user.email, username: user.username },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: "1h" } // Token expiry
                    );

                    return res.status(200).json({
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        token: token,
                    });
                });
            }
        );
    } catch (err) {
        return next(err);
    }
});

export { userRouter };