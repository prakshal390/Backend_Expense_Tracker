import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    description: {   //description of the expense
        type: String,
        required:true
    },
    amount: {  //amount of the expense
        type: Number,
        required: true
    },
    category: { //category of the expense
        type: String,
        required: true
    },
    done: { //if the expense is done or undone
        type: Boolean,
        default: false
    },
    userId:{ //user id of the user who created the expense
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true});

export const Expense = mongoose.model("expense", expenseSchema); //export the Expense model