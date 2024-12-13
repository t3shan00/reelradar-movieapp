# Reel Radar: Movie Exploration Platform ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Project Overview🎥

We developed Reel Radar as a sophisticated web application for cinema enthusiasts. Throughout its creation, the team focused on robust features, clean code practices, and effective collaboration. This process enhanced our understanding of full-stack development, API integration, and user-centered design principles.

Reel Radar pursues three primary objectives:  
1. Facilitate comprehensive movie discovery through advanced filtering systems  
2. Enable meaningful community engagement via group functionalities  
3. Deliver personalized cinema experiences through user-specific features

Our iterative improvements, informed by continuous testing and user feedback, resulted in a stable and user-friendly application.

## Development Team👩‍💻

Our development team members possess diverse expertise:  
- **Jayathra Chalanidu Mahadurage**: Scrum Master, Project Coordination, Full-Stack Development  
- **Anil Shah**: Full-Stack Development  
- **Chenqi Li**: UI/UX Development, Testing and Support  
- **Md Motiar Rahman**: Testing and Quality Assurance  

## User Interface and User Experience Design📱

We adopted a UI/UX design focusing on:  
- **Responsive Design**: A mobile-first approach ensures compatibility across various devices.  
- **High Performance**: We optimized loading times and ensured smooth transitions.  
- **Intuitive Navigation**: We introduced a user-friendly information architecture.

## Technical Implementation🛠️

### Technology Stack

Our team selected the following technology stack based on reliability, performance, and maintainability:

- **Frontend**: React.js with React Hooks ensures component reusability and efficient rendering.  
- **Backend**: Node.js and Express.js follow a RESTful architecture, offering a robust ecosystem and scalability.  
- **Database**: PostgreSQL with a normalized schema ensures data integrity and effective management of complex relationships.  
- **External APIs**: Integration with TMDB and Finnkino provides comprehensive movie data.  
- **Authentication**: A JWT-based secure authentication system ensures stateless, secure user sessions.  
- **Deployment**: Azure Static Web Apps with a CI/CD pipeline provides reliable hosting and automated deployment.

### Core Features

1. **Movie Discovery System**  
   - Advanced search functionality with multiple filtering options  
   - Comprehensive movie information display  
   - Genre-based categorization

2. **User Engagement**  
   - Secure authentication system  
   - Community group creation and management  
   - Review system implementation  
   - Personal favorites management  
   - Social sharing capabilities

3. **Security Implementation**  
   - Password hashing  
   - Input validation  
   - HTTPS encryption  
   - JWT authentication

## Application Architecture🏗️

### Frontend Structure

We implemented a modular frontend architecture characterized by:  
- Component-based development using React.js  
- Responsive design principles for compatibility across devices  
- State management with React Hooks to maintain predictable data flow  
- CSS Modules for style encapsulation and maintainability

### Backend Organization

Our backend architecture follows RESTful principles:  
- Clearly defined API endpoints for resource management  
- A robust middleware layer handles authentication and request validation  
- Efficient database operations rely on prepared statements  
- Structured error handling and logging mechanisms ensure maintainability

### Database Design💾

Our PostgreSQL database emphasizes scalability and performance:

#### Core Tables Structure

1. **Users Management**  
   - A Users table with secure password hashing and reset capabilities  
   - Profile management with unique constraints on username and email  
   - Timestamps track user activities

2. **Movie Information**  
   - A Movies table centralizes TMDB movie details  
   - Efficient indexing on TMDB_MovieID enables quick lookups  
   - Comprehensive metadata includes ratings and media paths

3. **Social Features**  
   - A Groups system supports member management  
   - Join requests include status tracking  
   - Movie sharing is supported within groups  
   - A user reviews and ratings system allows community feedback

4. **Showtime Management**  
   - Theater and auditorium information are well-structured  
   - Temporal data handling supports multiple time zones  
   - Unique constraints prevent duplicate showtime entries

#### Database Optimizations

- **Indexing Strategy**: Strategic indexes target frequently queried columns.  
- **Relationship Management**: Cascading deletes and many-to-many junction tables preserve referential integrity.  
- **Performance Features**: Connection pooling, prepared statements, and normalization enhance efficiency.

#### Security Measures🔒

- Password reset token management  
- Secure foreign key constraints  
- Input validation through check constraints

## Installation Guide📥

### Prerequisites

Ensure the following are installed and configured:  
- Node.js (version 16.0.0 or higher)  
- PostgreSQL (version 13.0 or higher)  
- TMDB API credentials  
- Finnkino API access credentials  
- Git  
- npm (Node Package Manager)  
- A code editor (e.g., Visual Studio Code)

### Setup Process

1. **Repository Configuration**

   ```bash
   # Clone the repository
   git clone https://github.com/group11-awdp-oamk/reelradar.git

   # Navigate to the project directory
   cd reelradar
   ```

2. **Environment Configuration**

   Create two separate .env files in the respective directories:

   ```bash
   # Create and configure frontend environment file in the root folder where react is installed
   touch .env

   # Create and configure backend environment file
   cd ../server
   touch .env
   ```

   Configure the environment variables:

   ```plaintext
   # Frontend (.env)
   REACT_APP_BASE_URL=http://localhost:3001
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key
   REACT_APP_TMDB_BEARER_TOKEN=

   # Backend (.env)
   PORT = 3001
   DB_USER = YOUR_DB_USERNAME
   DB_HOST= 127.0.0.1
   DB_NAME = YOUR_DB_NAME
   DB_PASSWORD= DB_PASSWORD
   DB_PORT = DB_PORT
   JWT_SECRET_KEY = YOUR_JWT_SECRET_KEY
   TMDB_API_KEY = YOUR_TMDB_API_KEY
   EMAIL_USER = USE_GMAIL_ADDRESS
   EMAIL_PASS = GMAIL_APP_GENERATED_PASSWORD
   WEBSITE_ADDRESS = http://localhost:3000

   DATABASE_URL=postgresql://username:password@localhost:5432/reelradar
   ```

3. **Database Setup**

   ```bash
   # Create PostgreSQL database
   psql -U postgres
   CREATE DATABASE reelradar;
   \q

   # Initialize database schema
   cd server/db
   psql -U postgres -d reelradar -f schema.sql
   ```

4. **Dependencies Installation**

   ```bash
   # Install frontend dependencies
   cd ../../src
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

5. **Application Launch**

   ```bash
   # Terminal 1: Start the backend server
   cd server
   npm run devStart

   # Terminal 2: Start the frontend application
   cd src
   npm start
   ```

6. **Verification Steps**  
   - Confirm the backend server runs at http://localhost:3001  
   - The frontend application opens automatically at http://localhost:3000  
   - Check the backend console logs to verify database connections  
   - Test user registration and authentication functionality

### Common Setup Issues and Solutions⚙️

1. **Database Connection Errors**  
   - Verify that the PostgreSQL service is running  
   - Confirm database credentials in the .env file  
   - Ensure the database name matches the configuration

2. **API Integration Issues**  
   - Validate TMDB API key functionality  
   - Confirm Finnkino API access  
   - Check API endpoint configurations

3. **Port Conflicts**  
   - Ensure ports 3000 and 3001 are available  
   - Modify the PORT value in .env if necessary

For additional assistance, refer to our troubleshooting guide in the documentation or create an issue in our GitHub repository.

## Future Development Plans🚀

We intend to implement the following features in the future:  
1. A push notification system  
2. An AI-powered recommendation engine  
3. Enhanced social features

## Access Information🌐

- **Live Application**: [Reel Radar Web Application](https://brave-desert-012735d03.4.azurestaticapps.net/)  
- **Repository**: [GitHub Repository](https://github.com/group11-awdp-oamk/reelradar)

## Documentation
- [API Documentation](API.md)

## License📜

This project is distributed under the MIT License. Refer to the LICENSE file for detailed information.
```