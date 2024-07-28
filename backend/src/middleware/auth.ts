import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const isCustomAuth = token.length < 500;

        let decodedData;

        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET!);
            req.userId = (decodedData as any).id;
        } else {
            decodedData = jwt.decode(token);
            req.userId = (decodedData as any).sub;
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default auth;
