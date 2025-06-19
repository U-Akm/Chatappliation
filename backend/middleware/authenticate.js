import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticate = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1]; // Check for token in cookies or headers

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided. Access denied." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
        req.user = { userId: decoded.userId }; // Attach userId to req.user
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

export default authenticate;
