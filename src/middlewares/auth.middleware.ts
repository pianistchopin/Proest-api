import config from "config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithStudent } from "@interfaces/auth.interface";
import {Student} from "@entity/student";

const authMiddleware = async (req: RequestWithStudent, res: Response, next: NextFunction ) => {
    try {
        const Authorization = req.header('Authorization').split('Bearer ')[1] || null;
        
        if(Authorization){
            const verificationResponse = (await jwt.verify(Authorization, 'secretKey')) as DataStoredInToken;
            const userId = verificationResponse.id;
            const users: Student[] = await Student.find();
            const findUser = users.find(user => user.id === userId);
            
            if(findUser){
                req.student = findUser;
                next();
            }else {
                next(new HttpException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpException(401, 'Wrong authentication token'));
    }
};

export default authMiddleware;