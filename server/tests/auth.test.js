import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { userRouter } from '../routers/userRouter.js';
import reviewRouter from '../routers/reviewRouter.js';
import { pool } from '../utils/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use('/reviews', reviewRouter);

const testUser = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'Test123!'
};

describe('User Authentication Tests', () => {
  // Clean up test data
  after(async () => {
    try {
      await pool.query('DELETE FROM users WHERE email = $1', [testUser.email]);
      await pool.end();
    } catch (error) {
      console.error('Failed to clean up test data:', error);
    }
  });

  // 1. Sign up tests
  describe('Registration Tests', () => {
    // Positive case
    it('should successfully register a new user', async () => {
      const response = await request(app)
        .post('/user/register')
        .send(testUser);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.email).to.equal(testUser.email);
      expect(response.body.username).to.equal(testUser.username);
    });

    // Negative case
    it('should not allow duplicate email registration', async () => {
      const response = await request(app)
        .post('/user/register')
        .send(testUser);

      expect(response.status).to.equal(400);
      expect(response.body.error).to.include('Email already exists');
    });
  });

  // 2. Sign in tests
  describe('Login Tests', () => {
    // Positive case - login with email
    it('should successfully login with email', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          identifier: testUser.email,
          password: testUser.password
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('id');
      expect(response.body.email).to.equal(testUser.email);
      expect(response.body.username).to.equal(testUser.username);
    });

    // Positive case - login with username
    it('should successfully login with username', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          identifier: testUser.username,
          password: testUser.password
        });

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property('token');
      expect(response.body.username).to.equal(testUser.username);
    });

    // Negative case - wrong password
    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          identifier: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('Invalid credentials.');
    });

    // Negative case - non-existent user
    it('should fail with non-existent user', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          identifier: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).to.equal(500);
      expect(response.body.error).to.equal('Invalid credentials.');
    });
  });
});
