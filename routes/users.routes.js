import express from 'express';
import {requireSignin} from '../middleware/auth';
import {getUsers, addUser, deleteUser, updateUser} from '../controllers/users.controller';
require('dotenv').config();

const router = express.Router();

router.post('/adduser', requireSignin, addUser);
router.get('/getusers', requireSignin, getUsers);
router.patch('/updateuser', requireSignin, updateUser);
router.delete('/deleteuser/:id', requireSignin, deleteUser);

module.exports = router;