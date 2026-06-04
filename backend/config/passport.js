/**
 * Passport OAuth Configuration
 * Google & Facebook OAuth strategies (loaded only when configured)
 */

const passport = require('passport');
const User = require('../models/User');

// Google OAuth - load strategy only when credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  try {
    const GoogleStrategy = require('passport-google-oauth20').Strategy;
    passport.use(
      new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Must match EXACTLY the URI in Google Console (no trailing slash, use http for localhost)
        callbackURL: `${(process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/auth/google/callback`,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails?.[0]?.value });
          if (user) {
            if (!user.isEmailVerified) {
              user.isEmailVerified = true;
              await user.save({ validateBeforeSave: false });
            }
            return done(null, user);
          }
          user = await User.create({
            name: profile.displayName || profile.name?.givenName || 'User',
            email: profile.emails?.[0]?.value,
            password: require('crypto').randomBytes(32).toString('hex'),
            isEmailVerified: true,
            role: 'user',
          });
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  } catch (err) {
    console.warn('Google OAuth disabled:', err.message);
  }
}

// Facebook OAuth - load strategy only when credentials exist
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  try {
    const FacebookStrategy = require('passport-facebook').Strategy;
    passport.use(
      new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`}/api/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'emails'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Facebook'), null);
          let user = await User.findOne({ email });
          if (user) {
            if (!user.isEmailVerified) {
              user.isEmailVerified = true;
              await user.save({ validateBeforeSave: false });
            }
            return done(null, user);
          }
          user = await User.create({
            name: profile.displayName || 'User',
            email,
            password: require('crypto').randomBytes(32).toString('hex'),
            isEmailVerified: true,
            role: 'user',
          });
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  } catch (err) {
    console.warn('Facebook OAuth disabled:', err.message);
  }
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
