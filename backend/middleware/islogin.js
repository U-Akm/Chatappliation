import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import User from '../Models/userModels.js';

// Load environment variables
dotenv.config();

const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).send({ success: false, message: "User Unauthorized: No token provided" });
        }

        // Verify the token using the correct key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).send({ success: false, message: "Invalid Token" });
        }

        // Find the user in the database
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        console.error(`Error in isLogin middleware: ${error.message}`);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

export default isLogin;
