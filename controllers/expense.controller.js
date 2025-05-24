import { Expense } from "../models/expense.model.js"; //import the Expense model


export const addExpense = async (req, res) => {

    try {
        const { description, amount, category } = req.body; //get the description, amount, category, and done from the request body from the client side request
        const userId = req.id; //current logged in user id
        if (!description || !amount || !category) { //if the description, amount, or category is not provided by the user
            return res.status(400).json({
                msg: "All fields are required.", //return the error message
                success: false //not added successfully
            })
        };

        const expense = await Expense.create({ //create the expense
            description,
            amount,
            category,
            userId
        });

        return res.status(201).json({
            msg: "Expense added successfully.", //return the success message
            expense, //return the created expense
            success: true //added successfully
        });
    } catch (error) {
        console.log(error);
    }

}    


export const getAllExpenses = async (req, res) => {
    try {
        // Always get the userId from the authenticated user (e.g., req.user.userId or req.id)
        const userId = req.id; // current logged in user id (should be set by your auth middleware)
        let category = req.query.category || "";
        const done = req.query.done || "";

        // Only fetch expenses for the logged-in user
        const query = { userId };

        if (category.toLowerCase() === "all") {
            // no need to filter the expenses by category
        } else if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        if (done.toLowerCase() === "done") {
            query.done = true;
        } else if (done.toLowerCase() === "undone") {
            query.done = false;
        }

        const expenses = await Expense.find(query);
        if (!expenses || expenses.length === 0) {
            return res.status(404).json({
                msg: "No expenses found.",
                success: false
            });
        }

        return res.status(200).json({
            expenses,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server error.",
            success: false
        });
    }
}



export const marksAsDoneUndone = async (req, res) => {
    try {
        const expenseId = req.params.id; //get the expense id from the request parameter
        const { done } = req.body; //get the done status from the request body

        const expense = await Expense.findByIdAndUpdate(expenseId, { done }, { new: true }); //update the expense by id

        if (!expense) { //if no expense found
            return res.status(404).json({
                msg: "Expense not found.", //return the error message
                success: false //no expense found
            });
        }

        return res.status(200).json({
            msg: `Expense marked as ${expense.done ? 'done' : 'undone'}.`, //return the success message
            success: true //expense updated successfully
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server error.",
            success: false
        });
    }
}




export const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id; //get the expense id from the request parameter
        const expense = await Expense.findByIdAndDelete(expenseId); //find the expense by id and delete it

        if (!expense) { //if no expense found
            return res.status(404).json({
                msg: "Expense not found.", //return the error message
                success: false //no expense found
            });
        }

        return res.status(200).json({
            msg: "Expense deleted.", //return the success message
            success: true //expense deleted successfully
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server error.",
            success: false
        });
    }
}



export const updateExpense = async (req, res) => {
   try {
    const { description, amount, category } = req.body; //get the description, amount, category, and done from the request body from the client side request
   
    const expenseId = req.params.id; //get the expense id from the request parameter
    const updateData = { description, amount, category }; //update the expense data
    
    const expense = await Expense.findByIdAndUpdate(expenseId, updateData, { new: true }); //update the expense by id
    return res.status(200).json({
        msg: "Expense updated successfully.", //return the success message
        expense, //return the updated expense
        success: true //expense updated successfully
    });

   } catch (error) {
    console.log(error);
   }
}
