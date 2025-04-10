import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User, Role } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()

class UserController {
    // Factory Method for User Creation
    private static async createUser(name: string, email: string, password: string, role: Role = Role.USER) {
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = await bcrypt.hash(password, 10); // Hashing password
        user.role = role;
        return user;
    }

    // Password Verification Method
    private static async verifyPassword(password: string, hashedPassword: string) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // User Registration
    static async userRegister(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const userRepo = AppDataSource.getRepository(User);
            const existingUser = await userRepo.findOneBy({ email });

            if (existingUser) {
                return res.status(409).json({ message: "User already exists" });
            }

            const newUser = await UserController.createUser(name, email, password);
            await userRepo.save(newUser);

            return res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error) {
            console.error("Error in user register controller:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // User Login
    static async userLogin(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const userRepo = AppDataSource.getRepository(User);
            const user = await userRepo.findOneBy({ email });

            if (!user || !(await UserController.verifyPassword(password, user.password))) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET as string,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            console.error("Error in user login controller:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // Seller Registration
    static async sellerRegister(req: Request, res: Response) {
        try {
            const { name, email, password, shopName } = req.body;

            if (!name || !email || !password || !shopName) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const userRepo = AppDataSource.getRepository(User);
            const existingSeller = await userRepo.findOneBy({ email });

            if (existingSeller) {
                return res.status(409).json({ message: "Email already exists" });
            }

            const seller = await UserController.createUser(name, email, password, Role.SELLER);
            // seller.shopName = shopName; // Assuming a shopName field exists in User

            await userRepo.save(seller);

            return res.status(201).json({ message: "Seller registered successfully", seller });
        } catch (error) {
            console.error("Error in seller register controller:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }



    static async getAllUser(req:Request, res:Response){
        try {

            const userRepo = AppDataSource.getRepository(User);
            const allUser = await userRepo.find();

            if(!allUser){
                return res.status(404).json({message:"No user found"});
            }

            return res.status(200).json(allUser);
            
        } catch (error) {

            console.log(error,"error in get all users");
            throw error;
            
        }
    }


    static async getUserById(req:Request, res:Response){
        try {

            const Id = parseInt(req.params.id);
            console.log(typeof(Id))

            const userRepo = AppDataSource.getRepository(User);

            if(!Id){
                return res.status(400).json({message:"No id found"});
            }

            const userById = await userRepo.findOne({ where: { id:Id }});

            if(!userById){
                res.status(404).json({message:"No user avilable matching these profile"});
            }

            return res.status(200).json(userById);
            
        } catch (error) {
            console.log("error in get user by id",error);
            throw error; 
        }
    }
}

export default UserController;
