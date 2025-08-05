// pages/api/verify-token.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.body.token;

  if (!token) return res.status(400).json({ success: false, message: "Token is required." });

  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    console.log(":decoded of verufy", decoded);
    return res.status(200).json({ success: true, decoded });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}
