import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { userRouter } from '../routers/userRouter.js';
import { pool } from '../utils/db.js';
import dotenv from 'dotenv';
import reviewRouter from '../routers/reviewRouter.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);
app.use('/api/reviews', reviewRouter);

const testUser = {
  email: 'test@example.com',
  username: 'testuser',
  password: 'Test123!'
};

const newTestUser = {
  email: 'newtest@example.com',
  username: 'newtestuser',
  password: 'Test123!'
};

describe('User Authentication and Review Tests', () => {
  let authToken;

  before(async () => {
    // Register test user first
    await request(app)
      .post('/user/register')
      .send(testUser);
    
    // Log in and get a token
    const loginResponse = await request(app)
      .post('/user/login')
      .send({
        identifier: testUser.email,
        password: testUser.password
      });
    authToken = loginResponse.body.token;
  });

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
      const newUser = {
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'Test123!'
      };
  
      const response = await request(app)
        .post('/user/register')
        .send(newUser);
  
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('id');
      expect(response.body.email).to.equal(newUser.email);
      expect(response.body.username).to.equal(newUser.username);
  
      // Clean up
      await pool.query('DELETE FROM users WHERE email = $1', [newUser.email]);
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
      authToken = response.body.token;
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

// 3. Sign out tests
  describe('Logout Tests', () => {
    let authToken; 
    before(async () => {
      const loginResponse = await request(app)
        .post('/user/login')
        .send({
          identifier: testUser.email,
          password: testUser.password
        });
      authToken = loginResponse.body.token;
    });
    it('should successfully log out a user', async () => {
      const response = await request(app)
        .post('/user/logout')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Successfully logged out');
    });
    it('should fail to log out with invalid token', async () => {
      const response = await request(app)
        .post('/user/logout')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Invalid credentials');
    });
    it('should fail to log out without token', async () => {
      const response = await request(app)
        .post('/user/logout');
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization required');
    });
  });

  // 3. Sign out tests
  describe('Logout Tests', () => {
    let authToken; 
    before(async () => {
      const loginResponse = await request(app)
        .post('/user/login')
        .send({
          identifier: testUser.email,
          password: testUser.password
        });
      authToken = loginResponse.body.token;
    });
    it('should successfully log out a user', async () => {
      const response = await request(app)
        .post('/user/logout')
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Successfully logged out');
    });
    it('should fail to log out with invalid token', async () => {
      const response = await request(app)
        .post('/user/logout')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Invalid credentials');
    });
    it('should fail to log out without token', async () => {
      const response = await request(app)
        .post('/user/logout');
      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization required');
    });
  });

  // 5. Review Browsing Tests
  describe('Review Browsing Tests', () => {
    // Positive case: Successfully get all reviews
    describe('GET /api/reviews', () => {
      it('should successfully retrieve all reviews', async () => {
        const response = await request(app)
          .get('/api/reviews');
        
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        
        // If there are reviews, validate the review object structure
        if (response.body.length > 0) {
          const review = response.body[0];
          expect(review).to.have.property('review_text');
          expect(review).to.have.property('rating');
          expect(review).to.have.property('created_at');
          expect(review).to.have.property('username');
          expect(review).to.have.property('movie_title');
          expect(review).to.have.property('movie_id');
        }
      });
    });

    // Negative case: Try to get reviews for a non-existent movie
    describe('GET /api/reviews/:movieId', () => {
      it('should handle non-existent movie ID gracefully', async () => {
        const nonExistentMovieId = '999999999';
        
        const response = await request(app)
          .get(`/api/reviews/${nonExistentMovieId}`);
        
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.lengthOf(0);
      });
    });

    // Additional test: Create a review (requires authentication)
    describe('POST /api/reviews', () => {
      it('should create a new review when authenticated', async () => {
        const reviewData = {
          movieId: "123", // Use a valid movie ID
          reviewText: "Test review",
          rating: 4
        };

        const response = await request(app)
          .post('/api/reviews')
          .set('Authorization', `Bearer ${authToken}`)
          .send(reviewData);

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('reviewtext');
        expect(response.body.reviewtext).to.equal(reviewData.reviewText);
      });

      describe('POST /api/reviews - Invalid Input', () => {
        it('should return an error for missing review text', async () => {
          const reviewData = {
            movieId: "123",
            rating: 4
          };
      
          const response = await request(app)
            .post('/api/reviews')
            .set('Authorization', `Bearer ${authToken}`)
            .send(reviewData);
      
          expect(response.status).to.equal(400);
          expect(response.body.error).to.equal('Both Star Rating and Rating Text are required.');
        });
      });

      it('should fail to create review without authentication', async () => {
        const reviewData = {
          movieId: "123",
          reviewText: "Test review",
          rating: 4
        };

        const response = await request(app)
          .post('/api/reviews')
          .send(reviewData);

        expect(response.status).to.equal(401);
      });
    });
  });

  // 5. Account Deletion Testing
  describe('Account Deletion Tests', () => {
    // Positive Case - Successful Account Deletion
    it('should successfully delete user account with valid token', async () => {
      expect(authToken).to.exist;
      
      const response = await request(app)
        .delete('/user/delete')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Account deleted successfully.');

      // Verify that the user has been deleted
      const checkUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [testUser.email]
      );
      expect(checkUser.rows.length).to.equal(0);
    });

    // Negative Test Case - Invalid Token
    it('should fail to delete account with invalid token', async () => {
      const response = await request(app)
        .delete('/user/delete')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).to.equal(403);
      expect(response.body.message).to.equal('Invalid credentials');
    });

    // Negative Test Case - No Token
    it('should fail to delete account without token', async () => {
      const response = await request(app)
        .delete('/user/delete');

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Authorization required');
    });


  });
});
