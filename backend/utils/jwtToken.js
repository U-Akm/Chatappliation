import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const jwtToken = (userId, res) => {
  // Ensure the secret key is retrieved correctly from .env
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

  // Send the token as an HTTP-only cookie with a 1-hour expiry
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure it's secure in production
    maxAge: 3600000 // 1 hour expiry
  });
};

export default jwtToken;
