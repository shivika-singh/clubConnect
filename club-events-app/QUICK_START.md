# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup Backend Environment
Create `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://shivika_singh:Anshiira1234@cluster0.yldjy6x.mongodb.net/clubConnect_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=anshiira1234
PORT=5000
NODE_ENV=development
```

### Step 3: Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on: http://localhost:5000

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 5: Setup Frontend Environment
Create `frontend/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 6: Start Frontend Server
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

## ✅ You're All Set!

Now you can:
1. Visit http://localhost:3000 to see the app
2. Register a new club at /login
3. Create events as a club admin
4. Register for events as a student
5. Browse clubs and events

## 📚 Key Features

- ✅ Full event management
- ✅ Registration system with comprehensive form
- ✅ QR code generation
- ✅ Club management
- ✅ Beautiful UI with Material-UI
- ✅ MongoDB integration
- ✅ JWT authentication
- ✅ Password hashing

## 🎯 Next Steps

1. Create your first club account
2. Add events to your club
3. Test the registration flow
4. Customize the UI as needed

For detailed documentation, see `COMPLETE_SETUP.md`
