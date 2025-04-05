import {Request, Response} from "express";
import { AppDataSource } from "../config/data-source"
import { User } from "../models/User";
import { ShipingAddress } from "../models/ShipingAddress";


class ShipingAddressController {
    

    static async createShipingAddress(req:Request, res:Response){

        try {

            const { userid, address, city, zipCode, country } = req.body;

            const user = AppDataSource.getRepository(User);

            const userExist = await user.findOne({ where: {id: userid} });
            if (!userExist) return res.status(200).json({message:"User is allready exist"});

            const shippingRepo = AppDataSource.getRepository(ShipingAddress);

            const shipingAddress = shippingRepo.create({
                user:userExist,
                address,
                city,
                zipCode,
                country
            });

            if(!shipingAddress) return res.status(404).json({message:"shipping address is not created"});

            return res.status(201).json(shipingAddress);

            
        } catch (error) {
            console.log("error in shipping address", error);
            throw error;
        }

    }


    static async getShippingAddressByUserId(req:Request, res:Response){

            try {
                const userId = parseInt(req.params.id); // User ID ko integer me convert karo
        
                const userRepo = AppDataSource.getRepository(User);
                const user = await userRepo.findOne({
                    where: { id: userId },
                    relations: ["shipingAddress"] // Shipping address ko bhi load karna hai
                });
        
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
        
                return res.status(200).json(user.shipingAddress);
        
            } catch (error) {
                console.error("Error fetching shipping address:", error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        

    }


    static async updateShippingAddress(req:Request, res:Response){

        try{

            const userId = parseInt(req.params.id); 
            const shipingAddressId = parseInt(req.params.shippingAddressId);

            if(!shipingAddressId || !userId) return res.status(404).json({message:"Shipping id or user id is not provided"})
        
            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOne({
                where: { id: userId },
                relations: ["shipingAddress"] 
            });
    
            if (!user) return res.status(404).json({ message: "User not found" });

            const shippingAddress = user.shipingAddress.find(address => address.id === shipingAddressId);

            if (shippingAddress === null || shippingAddress === undefined || !shipingAddressId) {
                return res.status(404).json({ message: "Shipping address not found for this user" });
            }

            return res.status(200).json(shippingAddress)
    


        } catch (error){

            console.log("error is in shipping address update",error);
            throw error;
        }

    }


}


export default ShipingAddressController