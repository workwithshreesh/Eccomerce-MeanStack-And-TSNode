import express from "express";
import UserController from "../controller/userController";
import { authMiddleWare, authorizeRoles } from "../middlewares/authMiddleware";

const router = express.Router();


router.post("/register",async (req , res)=>{
    await UserController.userRegister(req,res);
});


router.post("/userlogin", async (req,res)=>{
    await UserController.userLogin(req,res);
});


router.post("/sellerRegister", async (req,res)=>{
    await UserController.sellerRegister(req,res)
});


router.get("/user",authMiddleWare,async (req,res)=>{
    await UserController.getAllUser(req,res);
});


router.get("/user/:id",authMiddleWare,authorizeRoles("user","seller"), async (req,res)=>{
    await UserController.getUserById(req,res)
});

export default router;