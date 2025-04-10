import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayloadWithUser } from '../interfaces/jwtPayload.interface';
import { CustomRequest } from '../interfaces/customRequest.interface';

dotenv.config()
const SECRET_KEY:any = process.env.JWT_SECRET;

export const authMiddleWare = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            res.status(401).json({ message: "Access denied. No token provided." })
            return
        }
        const acctualtoken = token.startsWith("Bearer ") ? token.replace("Bearer ", "") : token;

        const decoded = jwt.verify(acctualtoken, SECRET_KEY) as JwtPayloadWithUser;
        (req as CustomRequest).user = decoded;
        next()
    } catch (err: any) {
        res.status(403).json({ message: 'Invalid token' })
    }
}


export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as CustomRequest).user;
        console.log("User role:", user.role);

        if (!user) res.status(401).json({ message: 'Unauthorized' })

        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({ message: "Access denied: Insufficient role" })
        }
        next()
    }
}
