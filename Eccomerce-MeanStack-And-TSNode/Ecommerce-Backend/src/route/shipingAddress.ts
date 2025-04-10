import express from "express";
import ShipingAddressController from "../controller/shipingAddressController";
import { authMiddleWare } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/shipingadr",authMiddleWare, async (req,res)=>{
    await ShipingAddressController.createShipingAddress(req,res);
});

router.get("/shipingadr/:userId/:shipingAddressId",authMiddleWare, async (req,res)=>{
    await ShipingAddressController.getShippingAddressByUserId(req,res)
});

router.put("/shipingadr/:userId/:shipingAddressId",authMiddleWare, async (req,res)=>{
    await ShipingAddressController.updateShippingAddress(req,res);
});


export default router;