import express from "express"
import { registerController, loginController, forgetPasswordController, updateProfileController, getAllOrdersController, getMyOrdersController, createOrderController, getOrdersController, orderStatusController } from "../controller/authController.js"
import { requireSignIn, isAdmin } from "../middleware/authMiddleware.js"

const router= express.Router();

router.post("/register",registerController)
router.post("/login",loginController)
router.post('/forget', forgetPasswordController)
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
})
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
})

router.put('/profile',requireSignIn,updateProfileController)

router.post("/create-order", requireSignIn, createOrderController);
router.get("/auth/orders", requireSignIn, getOrdersController);
router.get("/my-orders", requireSignIn, getMyOrdersController);
router.put("/order/status/:orderId", requireSignIn, isAdmin, orderStatusController);

export default router;