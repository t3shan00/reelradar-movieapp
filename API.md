# REST API Documentation

## Base URL
The base URL for all API requests:
```
https://reelradar-backend-c9cmfse2erfghndt.northeurope-01.azurewebsites.net/api
```
---

## **Authentication**
All secured endpoints require an `Authorization` header with a Bearer token:
```
Authorization: Bearer <token>
```

---

## **User Registration**
### Endpoint
```
POST /user/register
```
### Description
Register a new user.

### Request Body
```json
{
  "email": "string",
  "username": "string",
  "password": "string"
}
```
### Response
#### Success (201):
```json
{
  "id": "string",
  "email": "string",
  "username": "string"
}
```
#### Error (400):
```json
{
  "error": "string"
}
```
---

## **User Login**
### Endpoint
```
POST /auth/login
```
### Description
Login with email or username to obtain an authentication token.
### Request Body
```json
{
  "identifier": "string", // email or username
  "password": "string"
}
```
### Response
#### Success (200):
```json
{
  "id": "string",
  "email": "string",
  "username": "string",
  "token": "string"
}
```
#### Error (400 or 401):
```json
{
  "error": "Invalid credentials."
}
```
---

## **Forgot Password**
### Endpoint
```
POST /auth/forgot-password
```
### Description
Request a password reset link to be sent to the user’s email.
### Request Body
```json
{
  "email": "string"
}
```
### Response
#### Success (200):
```json
{
  "message": "Password reset link has been sent to your email."
}
```
#### Error (404):
```json
{
  "error": "User with this email does not exist."
}
```
---

## **Favorites**
### Add to Favorites
#### Endpoint
```
POST /favorites
```
#### Description
Add a movie to the user’s favorites list.
#### Request Body
```json
{
  "movieId": "string",
  "title": "string"
}
```
#### Response
##### Success (201):
```json
{
  "message": "Movie added to favorites."
}
```
##### Error (400):
```json
{
  "error": "string"
}
```

### Get Favorites
#### Endpoint
```
GET /favorites
```
#### Description
Retrieve the list of favorite movies for the logged-in user.
#### Response
##### Success (200):
```json
[
  {
    "movieId": "string",
    "title": "string",
    "addedAt": "string"
  }
]
```
##### Error (401):
```json
{
  "error": "Unauthorized."
}
```
---

## **Reviews**
### Get All Reviews
#### Endpoint
```
GET /reviews
```
#### Description
Fetch all reviews from the database.
#### Response
##### Success (200):
```json
[
  {
    "review_text": "string",
    "rating": "number",
    "created_at": "string",
    "username": "string",
    "movie_title": "string",
    "movie_id": "string"
  }
]
```
##### Error (500):
```json
{
  "error": "Failed to fetch reviews."
}
```

### Get Reviews by Movie ID
#### Endpoint
```
GET /reviews/:movieId
```
#### Description
Fetch reviews for a specific movie.
#### Response
##### Success (200):
```json
[
  {
    "review_text": "string",
    "rating": "number",
    "created_at": "string",
    "username": "string",
    "movie_title": "string",
    "movie_id": "string"
  }
]
```
##### Error (404):
```json
{
  "error": "No reviews found for this movie."
}
```

### Create a Review
#### Endpoint
```
POST /reviews
```
#### Description
Submit a new review for a movie.
#### Request Body
```json
{
  "movieId": "string",
  "reviewText": "string",
  "rating": "number"
}
```
#### Response
##### Success (201):
```json
{
  "reviewId": "string",
  "movieId": "string",
  "reviewText": "string",
  "rating": "number",
  "created_at": "string"
}
```
##### Error (400):
```json
{
  "error": "Invalid input."
}
```
##### Error (401):
```json
{
  "error": "Unauthorized."
}
```
---