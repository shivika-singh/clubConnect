# Club Events Backend

A Node.js/Express backend server for the Club Events application with MongoDB integration and secure authentication.

## Features

- **MongoDB Integration**: Store club data securely
- **Password Hashing**: Uses bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Express-validator for data validation
- **CORS Support**: Configured for frontend integration
- **Error Handling**: Comprehensive error handling middleware

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/club-events
# For MongoDB Atlas (cloud), use: mongodb+srv://username:password@cluster.mongodb.net/club-events

# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Use `mongodb://localhost:27017/club-events` as your MONGODB_URI

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Replace the MONGODB_URI in your `.env` file

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new club
- `POST /login` - Login club
- `GET /me` - Get current club profile (requires auth)
- `PUT /profile` - Update club profile (requires auth)
- `PUT /change-password` - Change password (requires auth)

### Club Routes (`/api/clubs`)

- `GET /` - Get all active clubs
- `GET /:id` - Get club by ID
- `GET /slug/:slug` - Get club by slug
- `DELETE /:id` - Deactivate club (requires auth)

### Example API Usage

#### Register a Club
```javascript
POST /api/auth/register
Content-Type: application/json

{
  "name": "Tech Club",
  "email": "tech@club.com",
  "password": "password123",
  "description": "A technology-focused club",
  "category": "Technology",
  "location": "University Campus",
  "website": "https://techclub.com",
  "contactPhone": "+1234567890"
}
```

#### Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "tech@club.com",
  "password": "password123"
}
```

#### Get Club Profile (with token)
```javascript
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 12
2. **JWT Tokens**: Secure authentication with 7-day expiration
3. **Input Validation**: All inputs are validated using express-validator
4. **CORS Configuration**: Properly configured for frontend integration
5. **Error Handling**: Comprehensive error handling without exposing sensitive information

## Database Schema

### Club Model
- `name`: Club name (unique, required)
- `email`: Club email (unique, required)
- `password`: Hashed password (required)
- `description`: Club description
- `category`: Club category (enum)
- `location`: Club location
- `website`: Club website
- `contactPhone`: Contact phone number
- `foundedYear`: Year founded
- `memberCount`: Number of members
- `isActive`: Active status
- `profileImage`: Profile image URL
- `socialMedia`: Social media links
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Development

### Project Structure
```
backend/
├── models/          # MongoDB models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies
└── README.md        # This file
```

### Adding New Features

1. Create new models in `models/` directory
2. Add routes in `routes/` directory
3. Register routes in `server.js`
4. Test with Postman or similar tool
