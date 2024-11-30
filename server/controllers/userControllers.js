import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByIdentifier, findUserByUsername, deleteUserById } from '../Models/userModels.js';
import { fetchUserFavorites } from "../models/favoriteModel.js";

const { sign } = jwt;

export const register = async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
        const hashedPassword = await hash(password, 10);

        const user = await createUser(email, username, hashedPassword);

        res.status(201).json({
            id: user.userid,
            email: user.email,
            username: user.username,
        });
    } catch (err) {
        if (err.code === "23505") {
            const field = err.constraint.includes("email") ? "Email" : "Username";
            return res.status(400).json({ error: `${field} already exists.` });
        }
        next(err);
    }
};

export const login = async (req, res, next) => {
    const { identifier, password } = req.body;
    const invalidMessage = "Invalid credentials.";

    try {
        const user = await findUserByIdentifier(identifier);

        if (!user) {
            return next(new Error(invalidMessage)); 
        }

        const isMatch = await compare(password, user.passwordhash);

        if (!isMatch) {
            return next(new Error(invalidMessage)); 
        }

        const token = sign(
            { userId: user.userid, email: user.email, username: user.username },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            id: user.userid,
            email: user.email,
            username: user.username,
            createdat: user.createdat,
            token: token,
        });
    } catch (err) {
        next(err);
    }
};

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await findUserByUsername(username);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      res.status(200).json({
        userid: user.userid,
        username: user.username,
        email: user.email,
        createdAt: user.createdat,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err.message);
      res.status(500).json({ error: "Failed to fetch user profile." });
    }
};

export const getFavoritesByUsername = async (req, res) => {
    const { username } = req.params;
  
    try {
      const user = await findUserByUsername(username); // Find the user by username
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      const favorites = await fetchUserFavorites(user.userid); // Fetch the user's favorite movies
      res.status(200).json(favorites);
    } catch (err) {
      console.error("Error fetching favorites by username:", err.message);
      res.status(500).json({ error: "Failed to fetch user's favorite movies." });
    }
  };

export const deleteUserHandler = async (req, res) => {
    const userId = req.userId;
  
    try {
      await deleteUserById(userId);
  
      res.status(200).json({ message: "Account deleted successfully." });
    } catch (err) {
      console.error("Error deleting user:", err.message);
      res.status(500).json({ error: "Failed to delete account. Please try again later." });
    }
};