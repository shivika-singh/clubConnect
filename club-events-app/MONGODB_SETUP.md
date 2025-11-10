# 🗄️ MongoDB Atlas Setup Guide

## Current Configuration

Your application is configured to use **MongoDB Atlas** (Cloud Database).

### Connection String
```
mongodb+srv://shivika_singh:Anshiira1234@cluster0.yldjy6x.mongodb.net/clubConnect_db?retryWrites=true&w=majority&appName=Cluster0
```

### Database Name
**`clubConnect_db`**

## 📍 Where Your Data is Stored

All your data is stored in **MongoDB Atlas Cloud** in the following collections:

1. **`clubs`** - All club information (name, email, password, description, etc.)
2. **`events`** - All events (title, description, dates, locations, etc.)
3. **`registrations`** - Event registrations (student details, event links)
4. **`memberships`** - Club membership applications (student details, payment status)
5. **`users`** - (if you add user authentication later)

## 🔍 How to View Your Data

### Option 1: MongoDB Atlas Web Interface
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login with your credentials
3. Click on your cluster: **Cluster0**
4. Click **"Browse Collections"**
5. Select database: **`clubConnect_db`**
6. View all collections and documents

### Option 2: MongoDB Compass (Desktop App)
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect using your connection string:
   ```
   mongodb+srv://shivika_singh:Anshiira1234@cluster0.yldjy6x.mongodb.net/clubConnect_db
   ```
3. Browse all collections and data

### Option 3: MongoDB Shell (mongosh)
```bash
# Install MongoDB Shell
# Then connect:
mongosh "mongodb+srv://shivika_singh:Anshiira1234@cluster0.yldjy6x.mongodb.net/clubConnect_db"

# View collections
show collections

# View clubs
db.clubs.find().pretty()

# View events
db.events.find().pretty()

# View registrations
db.registrations.find().pretty()

# View memberships
db.memberships.find().pretty()
```

## ✅ Verify Your Connection

### Check Backend Connection
1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. You should see: `MongoDB Connected: cluster0-shard-00-00.yldjy6x.mongodb.net`

### Check Database Connection in Code
The connection is established in `backend/server.js`:
```javascript
const conn = await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(`MongoDB Connected: ${conn.connection.host}`);
```

## 🔧 Troubleshooting

### If you get connection errors:

1. **Check your .env file** in the `backend` folder:
   ```env
   MONGODB_URI=mongodb+srv://shivika_singh:Anshiira1234@cluster0.yldjy6x.mongodb.net/clubConnect_db?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **Check MongoDB Atlas Network Access**:
   - Go to MongoDB Atlas → Network Access
   - Make sure your IP is whitelisted (or use `0.0.0.0/0` for development)

3. **Check Database User**:
   - Go to MongoDB Atlas → Database Access
   - Make sure user `shivika_singh` exists and has read/write permissions

4. **Check Cluster Status**:
   - Go to MongoDB Atlas → Clusters
   - Make sure Cluster0 is running (not paused)

## 📊 Database Collections Structure

### Clubs Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  description: String,
  category: String,
  location: String,
  membershipFee: Number,
  membershipDriveOpen: Boolean,
  memberCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  club: ObjectId (reference to Club),
  category: String,
  startDate: Date,
  endDate: Date,
  location: String,
  maxParticipants: Number,
  currentParticipants: Number,
  registrationFee: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Registrations Collection
```javascript
{
  _id: ObjectId,
  event: ObjectId (reference to Event),
  club: ObjectId (reference to Club),
  name: String,
  email: String,
  phone: String,
  year: String,
  branch: String,
  gender: String,
  registrationNumber: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Memberships Collection
```javascript
{
  _id: ObjectId,
  club: ObjectId (reference to Club),
  name: String,
  email: String,
  phone: String,
  year: String,
  branch: String,
  gender: String,
  membershipNumber: String,
  membershipFee: Number,
  paymentStatus: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Quick Access Links

- **MongoDB Atlas Dashboard**: https://cloud.mongodb.com/
- **Your Cluster**: Cluster0 (yldjy6x.mongodb.net)
- **Your Database**: clubConnect_db
- **Connection String**: Already configured in `backend/.env`

## 💡 Tips

1. **Backup Your Data**: MongoDB Atlas automatically backs up your data, but you can also export collections manually
2. **Monitor Usage**: Check your Atlas dashboard for database usage and performance
3. **Indexes**: Indexes are already created in the models for better performance
4. **Security**: Your password is hashed using bcrypt before storage

## 🔐 Security Notes

- ✅ Passwords are hashed (never stored in plain text)
- ✅ Connection uses SSL/TLS (mongodb+srv://)
- ✅ JWT tokens for authentication
- ✅ Input validation on all routes
- ⚠️ Make sure to restrict IP access in production

---

**Your data is safely stored in MongoDB Atlas Cloud! 🎉**
