import express from 'express';
import { login, logout, register } from '../controllers/user.controller.js';

const router = express.Router(); //initialize the express router

router.route('/register').post(register); //create the register route with the post request
router.route('/login').post(login); //create the login route with the post request
router.route('/logout').get(logout); //create the logout route with the get request

export default router;