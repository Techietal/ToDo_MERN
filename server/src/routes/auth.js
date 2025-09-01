import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ... keep your existing /register, /login, /me

// POST /api/auth/google  { credential: "<Google ID token>" }
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body; // also called "id_token" in some libs
    if (!credential) return res.status(400).json({ message: 'Missing credential' });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload(); // { sub, email, email_verified, name, picture, ... }

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: 'Google email not verified' });
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        provider: 'google',
        googleId,
        name,
        avatar
      });
    } else if (user.provider === 'local' && !user.googleId) {
      // Link existing local account to Google
      user.googleId = googleId;
      user.provider = 'google';
      if (!user.name) user.name = name;
      if (!user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { id: user._id, email: user.email, name: user.name, avatar: user.avatar } });
  } catch (e) {
    console.error('Google login error:', e);
    return res.status(401).json({ message: 'Invalid Google credential' });
  }
});

export default router;
