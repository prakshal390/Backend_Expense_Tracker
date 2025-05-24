import express from 'express';
import { addExpense, getAllExpenses, marksAsDoneUndone, deleteExpense, updateExpense } from '../controllers/expense.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js'; // Ensure the file extension is included
import Expense from '../models/expense.model.js';
import { verifyToken } from '../middleware/auth.middleware.js'; // You should have a JWT middleware

const router = express.Router();                                                 //initialize the express router
router.route('/add').post(isAuthenticated, addExpense);                          //create the add route with the post request
router.route('/getall').get(verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // assuming verifyToken sets req.user
    const expenses = await Expense.find({ userId });
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});                    //create the get all expenses route with the get request
router.route('/remove/:id').delete(isAuthenticated, deleteExpense);              //create the remove expense route with the delete request
router.route('/update/:id').put(isAuthenticated, updateExpense);                 //create the update expense route with the put request
router.route('/done/:id').put(isAuthenticated, marksAsDoneUndone);               //create the done/undone route with the put request

export default router;