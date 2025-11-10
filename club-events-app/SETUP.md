# Club Events App - Complete Setup Guide

This guide will help you set up the complete Club Events application with MongoDB integration and password hashing.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for version control)

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your configuration:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/club-events
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/club-events

   # JWT Secret (generate a strong secret)
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

#### Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will be available at `http://localhost:5000`

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Environment Configuration
1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file:
   ```env
   # Backend API URL
   REACT_APP_API_URL=http://localhost:5000/api
   ```

#### Start Frontend Development Server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🗄️ MongoDB Setup Options

### Option A: Local MongoDB Installation

1. **Install MongoDB Community Edition**:
   - Windows: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Ubuntu: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

2. **Start MongoDB Service**:
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

3. **Verify Installation**:
   ```bash
   mongosh
   ```

### Option B: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**:
   - Choose "Free Tier" (M0)
   - Select your preferred region
   - Create cluster

3. **Configure Access**:
   - Go to "Database Access" → Add New Database User
   - Create username and password
   - Set privileges to "Read and write to any database"

4. **Whitelist IP**:
   - Go to "Network Access" → Add IP Address
   - Add `0.0.0.0/0` for development (allows all IPs)
   - For production, add specific IPs

5. **Get Connection String**:
   - Go to "Clusters" → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in your `.env` file

## 🔐 Security Features

### Password Hashing
- Uses **bcryptjs** with **12 salt rounds**
- Passwords are automatically hashed before saving to database
- Original passwords are never stored

### JWT Authentication
- **7-day token expiration**
- Secure token-based authentication
- Automatic token refresh on valid requests

### Input Validation
- Server-side validation using express-validator
- Client-side form validation
- SQL injection protection through MongoDB

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new club | No |
| POST | `/login` | Login club | No |
| GET | `/me` | Get current profile | Yes |
| PUT | `/profile` | Update profile | Yes |
| PUT | `/change-password` | Change password | Yes |

### Club Routes (`/api/clubs`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all clubs | No |
| GET | `/id` | Get club by ID | No |
| GET | `/slug/:slug` | Get club by slug | No |
| DELETE | `/id` | Deactivate club | Yes |

## 🧪 Testing the Setup

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "message": "Club Events API is running!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Club",
    "email": "test@club.com",
    "password": "password123",
    "category": "Technology",
    "description": "A test club"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@club.com",
    "password": "password123"
  }'
```

### 4. Test Frontend
1. Open `http://localhost:3000`
2. Navigate to `/login`
3. Try registering a new club
4. Test login functionality

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```
Error: MongoDB connection error
```
**Solution**: 
- Check if MongoDB is running
- Verify connection string in `.env`
- Ensure network access is configured (for Atlas)

#### 2. JWT Secret Not Set
```
Error: jwt malformed
```
**Solution**: 
- Set `JWT_SECRET` in your `.env` file
- Use a strong, random secret

#### 3. CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`

#### 4. Frontend Can't Connect to Backend
**Solution**: 
- Verify both servers are running
- Check firewall settings
- Ensure correct API URL configuration

### Logs and Debugging

#### Backend Logs
```bash
cd backend
npm run dev
# Watch console for detailed logs
```

#### Frontend Logs
```bash
cd frontend
npm start
# Check browser console for errors
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use a production MongoDB instance
5. Set up SSL/HTTPS

### Frontend Deployment
1. Update `REACT_APP_API_URL` to production backend URL
2. Run `npm run build`
3. Deploy build folder to hosting service (Netlify, Vercel, etc.)

## 📁 Project Structure

```
club-events-app/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Main server file
│   ├── package.json     # Backend dependencies
│   └── README.md        # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Auth)
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   ├── package.json     # Frontend dependencies
│   └── README.md        # Frontend documentation
└── SETUP.md            # This file
```

## 🎯 Next Steps

1. **Test the complete flow**: Register → Login → View profile
2. **Customize the UI**: Modify colors, fonts, and layout
3. **Add more features**: Events management, member management
4. **Deploy to production**: Use cloud services like Heroku, AWS, or DigitalOcean

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the console logs for detailed error messages
3. Ensure all dependencies are properly installed
4. Verify your environment configuration

---

**Happy coding! 🎉**
