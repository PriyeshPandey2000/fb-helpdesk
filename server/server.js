const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const webhookRouter = require('./webhook'); // Import the webhook router

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongoose.connect('mongodb+srv://priyeshpandey2000:9zmEym4imGkdriNq@cluster0.sbnvhb0.mongodb.net/helpdesk');

app.use(cors());

// Middleware for parsing JSON requests
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Facebook Strategy for Passport
passport.use(new FacebookStrategy({
  clientID: '1466308294235050',
  clientSecret: 'e614686f380202dad212ff43ca23e4fb',
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'picture.type(large)'],
},
(accessToken, refreshToken, profile, done) => {
  // Handle the Facebook login callback, save user to the database, etc.
  // You can access user details in the 'profile' parameter.
  return done(null, profile);
}));

// Facebook Login route
app.get('/api/auth/facebook',
  passport.authenticate('facebook', { scope: ['manage_pages', 'pages_manage_engagement', 'pages_read_user_content'] })
);

app.get('/api/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the React app or send a token.
    res.redirect('http://localhost:3000/success');
  }
);

// Local Login route
app.post('/api/auth/local',
  passport.authenticate('local', { failureFlash: true }),
  (req, res) => {
    // Successful local authentication, redirect to the Facebook connect page
    res.redirect('http://localhost:3000/connect-facebook');
  }
);

// Mount the webhook router at the /webhook path
app.use('/webhook', webhookRouter);

// Routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
