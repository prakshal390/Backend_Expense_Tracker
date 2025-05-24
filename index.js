import express from 'express';                                   //import express
import cookieParser from 'cookie-parser';                        //to parse the cookies
import dotenv from 'dotenv';                                     //to use the .env file
import cors from 'cors';                                         //to enable cross-origin requests
import connectdb from './database/db.js';                        //import the connectdb function from the db.js file
import UserRoute from './routes/user.route.js';                  //import the user routes
import ExpenseRoute from './routes/expense.route.js';            //import the expense routes

dotenv.config({});                                               //to use the .env file
const app = express();                                           //initialize the express app
const PORT = process.env.PORT || 5000;                          //port number

//middlewares
app.use(express.json());                                         //to parse the json data from the frontend request
app.use(express.urlencoded({ extended: true }));                 //to parse the form data from the frontend request
app.use(cookieParser());                                         //to parse the cookies

// Allow both local and deployed frontend origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://frontend-expense-tracker-byi5.vercel.app/", // <-- add your deployed frontend URL here
];
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

// api's
app.use('/api/v3/user', UserRoute);                              //user routes like- http://localhost:8000/api/v3/user/register
app.use('/api/v3/expense', ExpenseRoute);                        //expense routes like- http://localhost:8000/api/v3/expense/add

app.listen(PORT, () => {
    connectdb();                                                 //connect to the database
    console.log(`Server is running on port:- ${PORT} `);         //log the port number
});


