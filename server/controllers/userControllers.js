import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByIdentifier, findUserByUsername, deleteUserById, checkExistingUser } from '../models/userModels.js';
import { fetchUserFavorites } from "../models/favoriteModel.js";
import { findUserByEmail, savePasswordResetToken, updateUserPassword, verifyResetToken } from "../models/userModels.js";
import nodemailer from "nodemailer";


const { sign } = jwt;

export const register = async (req, res, next) => {
  const { email, username, password } = req.body;

  try {
    if (!email || !username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    try {
      await checkExistingUser(email, username);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const hashedPassword = await hash(password, 10);
    const user = await createUser(email, username, hashedPassword);

    res.status(201).json({
      id: user.userid,
      email: user.email,
      username: user.username,
    });
  } catch (err) {
    console.error('Registration error:', err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { identifier, password } = req.body;
  const invalidMessage = "Invalid credentials.";

  try {
      const user = await findUserByIdentifier(identifier);

      if (!user) {
          return res.status(500).json({ error: invalidMessage });
      }

      const isMatch = await compare(password, user.passwordhash);

      if (!isMatch) {
          return res.status(500).json({ error: invalidMessage });
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
      res.status(500).json({ error: invalidMessage });
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
      const user = await findUserByUsername(username); 
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      const favorites = await fetchUserFavorites(user.userid); 
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

// Generate a reset token
const generateResetToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

// Send a password reset email
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User with this email does not exist." });
    }

    const resetToken = generateResetToken(user.userid);
    await savePasswordResetToken(user.userid, resetToken);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 1 hour.</p>`,
    });

    res.status(200).json({ message: "Password reset link has been sent to your email." });
  } catch (err) {
    console.error("Error sending reset email:", err.message);
    res.status(500).json({ error: "Failed to send password reset email." });
  }
};

// Handle password reset
export const resetPassword = async (req, res) => {
  const { token } = req.params; // Get token from URL params
  const { newPassword } = req.body; // Get new password from the request body

  try {
    const user = await verifyResetToken(token);
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token." });
    }

    const hashedPassword = await hash(newPassword, 10);
    await updateUserPassword(user.userid, hashedPassword);

    res.status(200).json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    res.status(500).json({ error: "Failed to reset password." });
  }
};