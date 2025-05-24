import express from 'express';
import { login, logout, register } from '../controllers/user.controller.js';

const router = express.Router();                                                 //initialize the express router
router.route('/register').post(register);                                        //create the register route with the post request
router.route('/login').post(login);                                              //create the login route with the post request
router.route('/logout').get(logout);                                             //create the logout route with the get request

res.cookie("token", token, {
  httpOnly: true,
  secure: true, // must be true for cross-site cookies on HTTPS
  sameSite: "none", // must be "none" for cross-site cookies
  // domain: ".onrender.com", // optional: only if both frontend and backend are on the same parent domain
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
});


export default router;