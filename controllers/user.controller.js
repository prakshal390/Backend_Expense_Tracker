import User from '../models/user.model.js';                                   //import the user model
import bcrypt from "bcryptjs";                                                //import bcrypt to hash the password
import jwt from "jsonwebtoken";                                               //import jsonwebtoken to create the token

// Register user function
export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;                       //get the fullname, email, and password from the request body from the client side request
        if (!fullname || !email || !password) {                               //if the fullname, email, or password is not provided by the user
            return res.status(400).json({
                msg: "All fields are required.",                              //return the error message
                success: false                                                //not registered successfully
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {                                        //validate email format
            return res.status(400).json({
                msg: "Invalid email format.",
                success: false
            });
        }

        if (password.length < 6) {                                            //validate password length
            return res.status(400).json({
                msg: "Password must be at least 6 characters long.",
                success: false
            });
        }

        const user = await User.findOne({ email });                           //find the user by email
        if (user) {                                                           //if the user already exists
            return res.status(400).json({
                msg: "User already exists with this email.",                  //return the error message
                success: false                                                //not registered successfully
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);               //hash the password
        await User.create({                                                   //create the user
            fullname,
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            msg: "Account created successfully.",                             //return the success message 
            success: true                                                     //registered successfully    
        });

    } catch (error) {
        console.error("Error during registration:", error);                   //log the error
        res.status(500).json({
            msg: "Server error.",
            success: false
        });
    }
}    


// Login user function
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;                                         //get the email and password from the request body from the client side request
        if (!email || !password) {                                                  //if the email or password is not provided by the user
            return res.status(400).json({msg: "All fields are required.",           //return the error message
            success: false                                                          //not logged in successfully
        })
    };
        const user = await User.findOne({email});                                   //find the user by email
        if (!user) {                                                                //if the user does not exist
           return res.status(400).json({msg: "Incorrect email or password.",        //return error message bcuz the email is incorrect filled by the user
           success: false                                                           //not logged in successfully
        })
    };  
        const isPasswordMatch = await bcrypt.compare(password, user.password);      //compare the password
        if (!isPasswordMatch) {                                                     //if the password does not match
            return res.status(400).json({msg: "Incorrect email or password",        //return error message bcuz the password is incorrect filled by the user
            success: false                                                          //not logged in successfully
        })
    };
        const tokenData = {                                                         //create the token data which will be stored in the token or cookie in the client side or browser
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn:'1d'});                                           //create the token
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // must be true for cross-site cookies on HTTPS
            sameSite: "none", // must be "none" for cross-site cookies
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });
           return res.status(200).json({
            msg: `welcome back ${user.fullname}`,                                                                              //return the success message
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email
            },
            success: true                                                                                                      //logged in successfully
        })
    
    } catch (error) {
        console.log(error);
    }
}    


// Logout user function
export const logout = async (req, res) => {                                   //logout function
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
           msg: "Logged out successfully.",                                   //return the success message
           success: true
        }) 
    } catch (error) {
        console.log(error);
    }
}


