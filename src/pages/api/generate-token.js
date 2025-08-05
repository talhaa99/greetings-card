// pages/api/generate-token.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const { user } = req.body;
  const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;
  const expiresIn = process.env.NEXT_PUBLIC_EXPIREIN;

  let payload = {};

  if (user && user._id) {
    // Authenticated user
    payload = {
      id: user._id,
      email: user.email
    };
  } else {
    // Anonymous/Guest user – create random session ID
    payload = {
      guest: true,
      sessionId: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`
    };
  }

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return res.status(200).json({ token });
}
