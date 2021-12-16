import config from "config";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { HttpException } from "@exceptions/HttpException";
import { DataStoredInToken, RequestWithCoach } from "@interfaces/auth.interface";
import {Coach} from "@entity/coach";

const CoachAuthMiddleware = async (req: RequestWithCoach, res: Response, next: NextFunction ) => {
    try {
        const Authorization = req.header('Authorization').split('Bearer ')[1] || null;

        if(Authorization){
            const verificationResponse = (await jwt.verify(Authorization, 'secretKey')) as DataStoredInToken;
            const userId = verificationResponse.id;
            const findUser: Coach = await Coach.findOne(userId);

            if(findUser){
                req.coach = findUser;
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

export default CoachAuthMiddleware;