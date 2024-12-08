import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRouter } from './routers/userRouter.js';
import reviewRouter from "./routers/reviewRouter.js";
import favoriteRouter from "./routers/favoriteRouter.js";
import groupRouter from "./routers/groupRouter.js";
import groupDetailsRouter from './routers/groupDetailsRouter.js';
import authRouter from "./routers/authRouter.js";
import { pool } from './utils/db.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(cors({
  origin: "https://brave-desert-012735d03.4.azurestaticapps.net",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.json({ success: true, time: result.rows[0].now });
//   } catch (error) {
//     console.error('Database connection error:', error);
//     res.status(500).json({ success: false, error: 'Database connection failed' });
//   }
// });

// app.get('/health', (req, res) => {
//   res.status(200).json({ message: 'Backend is running!' });
// });

app.use('/user', userRouter);
app.use('/reviews', reviewRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/groups", groupRouter);
app.use('/api', groupDetailsRouter);
app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});