import express from 'express';
require('dotenv').config();
import { login, register, forgotPassword, resetPassword } from '../controllers/auth.controller.js'

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetPassword);

module.exports = router;