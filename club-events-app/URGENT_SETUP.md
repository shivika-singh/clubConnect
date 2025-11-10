# 🚨 URGENT SETUP - DO THIS NOW!

## Step 1: Seed the Database (IMPORTANT!)

```bash
cd backend
npm install
npm run seed
```

This will populate your MongoDB with:
- 8 Clubs (IEEE, ACM, Drama Club, Music Club, Photography Club, Sports Club, Robotics Club, Literary Club)
- 6 Events (Tech Symposium, Hackathon, Photography Workshop, Cultural Fest, Robotics Workshop, Book Reading)

## Step 2: Start Backend

```bash
cd backend
npm run dev
```

Backend runs on: http://localhost:5000

## Step 3: Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on: http://localhost:3000

## ✅ Test Login Credentials

After seeding, you can login with:

- **IEEE**: ieee@muj.edu.in / ieee1234
- **ACM**: acm@muj.edu.in / acm1234
- **Drama Club**: drama@muj.edu.in / drama1234
- **Music Club**: music@muj.edu.in / music1234
- **Photography Club**: photography@muj.edu.in / photo1234
- **Sports Club**: sports@muj.edu.in / sports1234
- **Robotics Club**: robotics@muj.edu.in / robot1234
- **Literary Club**: literary@muj.edu.in / literary1234

## 🎯 What Works Now:

1. ✅ All clubs are showing (IEEE, ACM, etc.)
2. ✅ All events are showing
3. ✅ Students can browse clubs and events
4. ✅ Students can register for events
5. ✅ Club admins can login and see dashboard
6. ✅ Club admins can create/edit/delete events
7. ✅ Club admins can view registrations
8. ✅ Dashboard shows after login
9. ✅ All images are included

## 🔥 Quick Test:

1. Go to http://localhost:3000
2. See clubs and events on home page
3. Click "Club Login" and login with IEEE credentials
4. You'll be redirected to Dashboard
5. Create a new event or view existing ones
6. Logout and register for an event as a student

## ⚠️ IMPORTANT:

Make sure you run `npm run seed` FIRST before starting the servers, otherwise the database will be empty!

## 📝 Environment Files:

**backend/.env**:
```
MONGODB_URI=mongodb+srv://shivika_singh:Anshiira1234@cluster0.yldjy6x.mongodb.net/clubConnect_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=anshiira1234
PORT=5000
NODE_ENV=development
```

**frontend/.env**:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎉 You're Ready!

Everything is set up and working. The database has clubs and events, and all features are functional!
