import {IsEmail, IsString, IsNumber} from "class-validator";

export class CoachInvitationDto{

    @IsNumber()
    student_id: number;

    @IsNumber()
    coach_id: number;

    @IsString()
    status: string;

    @IsString()
    start_date: string;

    @IsString()
    expire_date: string;
}