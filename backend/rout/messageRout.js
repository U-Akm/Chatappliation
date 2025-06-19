import express from "express";
import { getMessages, sendMessage } from "../routControlers/messageroutControler.js";
import isLogin from "../middleware/islogin.js";

const router = express.Router();

// Send a message
router.post('/send/:id', isLogin, sendMessage);

// Get all messages for a conversation
router.get('/:id', isLogin, getMessages);

export default router;
