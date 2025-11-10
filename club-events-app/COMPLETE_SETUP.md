# Club Events App - Complete Full-Stack Setup Guide

This is a comprehensive full-stack club events management application with MongoDB, React frontend, and Node.js backend.

## 🚀 Features

### Backend Features
- ✅ MongoDB integration with Mongoose
- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Event management (CRUD operations)
- ✅ Registration management
- ✅ QR code generation for events and registrations
- ✅ Club management
- ✅ Event statistics and analytics
- ✅ Input validation and error handling
- ✅ CORS configuration

### Frontend Features
- ✅ Beautiful Material-UI design
- ✅ Responsive layout
- ✅ Event browsing with search and filters
- ✅ Event details page
- ✅ Comprehensive registration form (name, year, gender, branch, email, phone, etc.)
- ✅ Club browsing and details
- ✅ Authentication (login/register)
- ✅ Real-time data from backend
- ✅ Image support for events and clubs
- ✅ QR code display for registrations

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🔧 Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://shivika_singh:Anshiira1234@cluster0.yldjy6x.mongodb.net/clubConnect_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=anshiira1234
PORT=5000
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
club-events-app/
├── backend/
│   ├── models/
│   │   ├── Club.js          # Club model
│   │   ├── Event.js         # Event model
│   │   └── Registration.js  # Registration model
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── clubs.js         # Club routes
│   │   ├── events.js        # Event routes
│   │   └── registrations.js # Registration routes
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   ├── server.js            # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   │   ├── Home.js
│   │   │   ├── Clubs.js
│   │   │   ├── ClubDetail.js
│   │   │   ├── Events.js
│   │   │   ├── EventDetail.js
│   │   │   ├── EventRegistration.js
│   │   │   └── Login.js
│   │   ├── context/         # React context
│   │   │   └── AuthContext.js
│   │   ├── services/        # API services
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
└── SETUP.md
```

## 🎯 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new club
- `POST /login` - Login club
- `GET /me` - Get current profile
- `PUT /profile` - Update profile
- `PUT /change-password` - Change password

### Clubs (`/api/clubs`)
- `GET /` - Get all clubs
- `GET /:id` - Get club by ID
- `GET /slug/:slug` - Get club by slug
- `DELETE /:id` - Deactivate club

### Events (`/api/events`)
- `GET /` - Get all events (with filters)
- `GET /:id` - Get event by ID
- `POST /` - Create event (auth required)
- `PUT /:id` - Update event (auth required)
- `DELETE /:id` - Delete event (auth required)
- `GET /:id/registrations` - Get event registrations (auth required)
- `GET /:id/stats` - Get event statistics (auth required)

### Registrations (`/api/registrations`)
- `POST /` - Register for an event
- `GET /:id` - Get registration by ID
- `GET /number/:registrationNumber` - Get registration by number
- `PUT /:id/checkin` - Check in attendee (auth required)
- `PUT /:id/checkout` - Check out attendee (auth required)
- `DELETE /:id` - Cancel registration
- `GET /event/:eventId` - Get all registrations for an event

## 🎨 Registration Form Fields

The registration form includes:
- Full Name (required)
- Email Address (required)
- Phone Number (required, 10 digits)
- Year (required: 1st Year, 2nd Year, 3rd Year, 4th Year, 5th Year, Graduate, Other)
- Gender (required: Male, Female, Other, Prefer not to say)
- Branch (required: CSE, ECE, Mechanical, Civil, etc.)
- Student ID (optional)
- College/University (default: Manipal University Jaipur)
- Additional Information (optional)

## 🖼️ Images

- Events support multiple images and a poster image
- Clubs support profile images
- Default images are fetched from Unsplash if no image is provided
- Images are stored as URLs (you can integrate with cloud storage like AWS S3, Cloudinary, etc.)

## 🔐 Security Features

- Password hashing with bcryptjs (12 salt rounds)
- JWT authentication with 7-day expiration
- Input validation on both client and server
- CORS protection
- SQL injection protection (MongoDB)
- Error handling without exposing sensitive information

## 📱 Usage

### For Students:
1. Browse events on the Events page
2. View event details
3. Register for events with comprehensive form
4. Receive registration number and QR code
5. Browse clubs and view their events

### For Club Admins:
1. Register/Login as a club
2. Create events with all details
3. View event registrations
4. Check in/out attendees using QR codes
5. View event statistics
6. Manage club profile

## 🧪 Testing

### Test Backend:
```bash
cd backend
npm run dev
```

### Test Frontend:
```bash
cd frontend
npm start
```

### Test API Endpoints:
You can use Postman or curl to test API endpoints:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test get events
curl http://localhost:5000/api/events

# Test get clubs
curl http://localhost:5000/api/clubs
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI in `.env` file
- Check if MongoDB Atlas IP whitelist includes your IP (0.0.0.0/0 for development)
- Verify database user credentials

### CORS Errors
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify CORS configuration in `backend/server.js`

### Authentication Issues
- Verify JWT_SECRET is set in backend `.env`
- Check if token is being sent in request headers
- Clear localStorage and login again

### Image Loading Issues
- Check image URLs are valid
- Verify CORS settings for external image sources
- Use absolute URLs for images

## 🚀 Deployment

### Backend Deployment:
1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure production MongoDB URI
4. Set up SSL/HTTPS
5. Deploy to Heroku, AWS, DigitalOcean, etc.

### Frontend Deployment:
1. Update `REACT_APP_API_URL` to production backend URL
2. Run `npm run build`
3. Deploy build folder to Netlify, Vercel, etc.

## 📝 Notes

- All dates are stored in ISO 8601 format
- QR codes are generated as data URLs
- Registration numbers are auto-generated
- Event status can be: draft, published, cancelled, completed
- Registration status can be: pending, confirmed, cancelled, attended

## 🎉 Next Steps

1. Add email notifications for registrations
2. Integrate payment gateway for paid events
3. Add event reviews and ratings
4. Implement advanced analytics dashboard
5. Add file upload for event images
6. Implement real-time notifications
7. Add event calendar view
8. Implement event search with filters

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review console logs
3. Verify environment variables
4. Check MongoDB connection
5. Verify all dependencies are installed

---

**Happy coding! 🎉**
