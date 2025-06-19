import express from 'express';
import isLogin from '../middleware/islogin.js';
import { getCorrentChatters, getUserBySearch } from '../routControlers/userhandlerControler.js';

const router = express.Router();

// Ensure user is logged in before accessing these routes
router.get('/search', isLogin, getUserBySearch);
router.get('/currentchatters', isLogin, getCorrentChatters);

export default router;
