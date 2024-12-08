# Reel Radar: Movie Exploration Platform ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Project Overview
Reel Radar represents our team's endeavor to create a sophisticated web application for cinema enthusiasts. Throughout the development process, we have focused on implementing robust features while maintaining clean code practices and effective team collaboration. Our experience in developing this platform has enhanced our understanding of full-stack development, API integration, and user-centered design principles.

The platform serves three primary objectives:
1. Facilitating comprehensive movie discovery through advanced filtering systems
2. Enabling meaningful community engagement via group functionalities
3. Delivering personalized cinema experiences through user-specific features

Our development approach emphasized iterative improvements based on continuous testing and user feedback, resulting in a stable and user-friendly application.

## Development Team
Our development team consists of professionals with diverse expertise:
- **Jayathra**: Scrum Master, Project Coordination, Full-stack Development
- **Anil**: Full-stack Development
- **Chenqi**: UI/UX Development,Testing and Support
- **Motiar**: Testing and Quality Assurance
- **Rubayat Kabir**: Quality Assurance

## Technical Implementation

### Technology Stack
We have carefully selected our technology stack based on reliability, performance, and maintainability:

- **Frontend**: React.js with React Hooks for state management, chosen for its component reusability and efficient rendering
- **Backend**: Node.js and Express.js implementing RESTful architecture, selected for its robust ecosystem and scalability
- **Database**: PostgreSQL with normalized schema design, chosen for its reliability in handling complex relationships and data integrity
- **External APIs**: Strategic integration with TMDB and Finnkino for comprehensive movie data
- **Authentication**: JWT-based secure authentication system ensuring stateless, secure user sessions
- **Deployment**: Azure Static Web Apps with CI/CD pipeline, providing reliable hosting and automated deployment

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

## Installation Guide

### Prerequisites
Before installation, ensure your system meets these requirements:
- Node.js (version 16 or higher) for runtime environment
- PostgreSQL (version 13 or higher) for database management
- TMDB API credentials for movie data access
- Finnkino API access for showtime information

### Setup Process
1. Clone the repository:
   ```bash
   git clone https://github.com/group11-awdp-oamk/reelradar.git
   cd reelradar
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   cd client
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

3. Configure environment variables:
   Create `.env` files in both frontend and backend directories with the following variables:
   ```
   # Frontend .env
   REACT_APP_API_URL=your_backend_url
   REACT_APP_TMDB_KEY=your_tmdb_key

   # Backend .env
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_jwt_secret
   ```

4. Initialize database:
   ```bash
   # Execute database setup script
   psql -U postgres -f server/db/schema.sql
   ```

5. Launch the application:
   ```bash
   # Start backend server
   cd server
   npm start

   # Start frontend application in a new terminal
   cd client
   npm start
   ```

## Application Architecture

### Frontend Structure
We have implemented a modular frontend architecture focusing on:
- Component-based development using React.js
- Responsive design principles ensuring cross-device compatibility
- State management utilizing React Hooks for predictable data flow
- CSS Modules implementation for style encapsulation and maintainability

### Backend Organization
Our backend architecture follows RESTful principles with:
- Clearly defined API endpoints for resource management
- Robust middleware layer handling authentication and request validation
- Efficient database operations through prepared statements
- Structured error handling and logging mechanisms

### Database Design
The database architecture emphasizes:
- Normalized schema design preventing data redundancy
- Optimized query performance through proper indexing
- Structured relationships maintaining data integrity
- Efficient connection pooling for improved performance

## Future Development Plans
1. Dark mode implementation
2. Push notification system
3. AI-powered recommendation engine
4. Enhanced social features

## Access Information
- **Live Application**: [Reel Radar Web Application](https://brave-desert-012735d03.3.azurestaticapps.net)
- **Repository**: [GitHub Repository](https://github.com/group11-awdp-oamk/reelradar)

## License
This project is distributed under the MIT License. Refer to the LICENSE file for detailed information.




