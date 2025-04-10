import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { JwtPayloadWithUser } from "./jwtPayload.interface";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
    user: JwtPayloadWithUser;
}