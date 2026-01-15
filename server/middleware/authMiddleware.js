import JWT from "jsonwebtoken";
import usermodel from "../models/usermodel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    // Extract only the token (remove "Bearer ")
    const token = authHeader.split(" ")[1];

    const decode = JWT.verify(token, process.env.JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    console.log("Auth Error:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


export const isAdmin= async(req,res,next)=>{
    try{
        const user= await usermodel.findById(req.user._id);
        if(user.role !==1){
            return res.status(401).send({
                success:false,
                message:"Unauthorized Access"
            });
        }
        next();
    }catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            message:"Error in admin middleware",
            error,
        });
    }
}