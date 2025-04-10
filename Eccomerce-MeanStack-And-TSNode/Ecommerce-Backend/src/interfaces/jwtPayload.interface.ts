
import { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadWithUser extends JwtPayload {

    id:number;
    email:string;
    role:string;
}