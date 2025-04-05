import express from "express";
import ShipingAddressController from "../controller/shipingAddressController";

const router = express.Router();

router.post("/shipingadr", async (req,res)=>{
    await ShipingAddressController.createShipingAddress(req,res);
});

router.get("/shipingadr/:userId/:shipingAddressId", async (req,res)=>{
    await ShipingAddressController.getShippingAddressByUserId(req,res)
});

router.put("/shipingadr/:userId/:shipingAddressId", async (req,res)=>{
    await ShipingAddressController.updateShippingAddress(req,res);
});


export default router;