import {IsEmail, IsString, IsNumber} from "class-validator";

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

    @IsString()
    team?: string;

    @IsString()
    avatar?: string;

    @IsString()
    payment?: string;

    @IsString()
    access_token?: string;
}