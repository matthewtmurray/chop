import express from 'express';
import { getDevices, updateDevice, getUpdates, registerDevice, getUnclaimedDevice,claimUnclaimedDevice, getDevice, editDevice, deleteDevice } from '../controllers/device.controller.js';
import {requireSignin} from '../middleware/auth';
import { sendText } from '../services/sms.service.js';
require('dotenv').config();

const router = express.Router();

//web client routes
router.get('/getdevices', requireSignin, getDevices);
router.get('/getdevice/:id', requireSignin, getDevice);
router.patch('/updatedevice', requireSignin, updateDevice);
router.patch('/editdevice', requireSignin, editDevice);
router.delete('/deleteDevice/:id', requireSignin, deleteDevice);
router.get('/getunclaimeddevice/:id', requireSignin,  getUnclaimedDevice);
router.post('/claimunclaimeddevice', requireSignin,  claimUnclaimedDevice);

//IOT routes
router.get('/getupdates/:id',  requireSignin, getUpdates);
router.get('/registerdevice/:id',  registerDevice);
router.post('/doorbellpress/:id', sendText);

module.exports = router;