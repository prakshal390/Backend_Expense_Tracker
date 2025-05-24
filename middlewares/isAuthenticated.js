import jwt from "jsonwebtoken";                                               //import jsonwebtoken to create the token

const isAuthenticated = async (req, res, next) => {
    try {
      const token = req.cookies.token;                                        //get the token from the cookies
      if (!token) {                                                           //if the token is not provided
        return res.status(401).json({
          msg: "User not authenticated",                                      //return the error message
          success: false                                                      //unauthorized access
        })
      };
    const decoded = jwt.verify(token, process.env.JWT_SECRET);             //verify the token
    if(!decoded) {                                                          //if the token is not verified
        return res.status(401).json({
            msg: "Invalid token",                                            //return the error message
            success: false                                                  //unauthorized access
        })
    };
    req.id = decoded.userId;                                               //get the user id from the token
    next();                                                                //move to the next middleware
    } catch (error) {
       console.log(error);
       res.status(500).json({
           msg: "Server error.",
           success: false
       });
    }
}  

export default isAuthenticated;                                             //export the isAuthenticated function