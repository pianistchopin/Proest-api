import {IsEmail, IsString, IsNumber} from "class-validator";
import {Column} from "typeorm";

export class UpdateStudentDto {
    @IsString()
    public user_name?: string;

    @IsEmail()
    public email?: string;

    @IsString()
    public password?: string;

    @IsNumber()
    coach_id?: number;

    @IsNumber()
    school_year?: number;

    @IsNumber()
    pitching_batting?: number;

    @IsNumber()
    position?: number;

    @IsNumber()
    course?: string;

    @IsString()
    team?: string;

    @IsString()
    avatar?: string;

    @IsString()
    payment?: string;

    @IsString()
    access_token?: string;

    @IsString()
    expire_date?: string;

    @IsString()
    fcm_token?: string;

    @IsString()
    stripe_connect_id?: string;

    @IsString()
    stripe_customer_id?: string;

    @IsString()
    created_at?: string;

    @IsString()
    subscription_id: string;
}