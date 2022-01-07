import {IsEmail, IsNumber, IsString} from "class-validator";
import {Column, PrimaryGeneratedColumn} from "typeorm";

export class UpdateChatDto {


    @IsNumber()
    id: number;

    @IsNumber()
    room_id: number;

    @IsNumber()
    student_id: number;

    @IsNumber()
    coach_id: number;

    @IsString()
    week_start_date: string;

    @IsString()
    week_end_date: string;

    @IsString()
    previous_goal_message: string;

    @IsString()
    previous_file: string;

    @IsString()
    today_goal_message: string;

    @IsString()
    today_file: string;

    @IsString()
    coach_goal_message: string;

    @IsString()
    coach_file: string;

}