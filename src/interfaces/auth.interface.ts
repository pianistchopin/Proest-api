import { Request } from "express";
import {Coach} from "../entity/coach";
import {Student} from "../entity/student";

export interface DataStoredInToken{
    id: number;
}

export interface TokenData{
    token: string;
    expiresIn: number;
}

export interface RequestWithStudent extends Request{
    student: Student;
}

export interface RequestWithCoach extends Request{
    coach: Coach
}