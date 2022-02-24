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

    @IsString()
    invite_date: string;

    @IsString()
    month_target: string;

    @IsNumber()
    know_easy_rate: number;

    @IsNumber()
    polite_rate: number;

    @IsNumber()
    start_easy_rate: number;

    @IsNumber()
    reply_rate: number;

    @IsNumber()
    sum_rate: number;

    @IsNumber()
    course: number;
}