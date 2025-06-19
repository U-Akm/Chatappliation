import User from "../Models/userModels.js";
import bcryptjs from 'bcryptjs';
import jwtToken from '../utils/jwtToken.js';

export const userRegister = async (req, res) => {
    try {
      const { fullname, username, email, gender, password, profilepic } = req.body;
  
      console.log(req.body);  // Check the incoming data
  
      const user = await User.findOne({ username, email });
      if (user) {
        return res.status(400).send({ success: false, message: "UserName or Email Already Exists" });
      }
  
      const hashPassword = bcryptjs.hashSync(password, 10);
      const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;
  
      const newUser = new User({
        fullname,
        username,
        email,
        password: hashPassword,
        gender,
        profilepic: gender === "male" ? profileBoy : profileGirl
      });
  
      await newUser.save();
  
      // Create and send JWT Token
      jwtToken(newUser._id, res);
  
      res.status(201).send({
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        profilepic: newUser.profilepic,
        email: newUser.email,
      });
  
    } catch (error) {
      console.error("Registration Error:", error);  // Log the error for debugging
      res.status(500).send({
        success: false,
        message: "Server error during registration. Please try again later.",
      });
    }
  };
  

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send({ success: false, message: "Email doesn't exist. Please register." });

        // Compare password
        const comparePass = bcryptjs.compareSync(password, user.password);
        if (!comparePass) return res.status(400).send({ success: false, message: "Email or password doesn't match" });

        // Generate JWT token
        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "Successfully logged in"
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Server error during login"
        });
    }
};

export const userLogOut = async (req, res) => {
    try {
        // Clear the JWT token cookie
        res.cookie("jwt", '', { maxAge: 0 });

        res.status(200).send({ success: true, message: "User logged out successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Server error during logout"
        });
    }
};
