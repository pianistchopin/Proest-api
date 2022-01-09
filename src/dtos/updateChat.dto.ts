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
    previous_student_message: string;

    @IsString()
    previous_student_file: string;

    @IsString()
    previous_student_file_thumb: string;

    @IsString()
    previous_coach_message: string;

    @IsString()
    previous_coach_file: string;

    @IsString()
    previous_coach_file_thumb: string;

    @IsString()
    week_student_message: string;

    @IsString()
    week_student_file: string;

    @IsString()
    week_student_file_thumb: string;

    @IsString()
    week_coach_message: string;

    @IsString()
    week_coach_file: string;

    @IsString()
    week_coach_file_thumb: string;

    @IsString()
    week_target: string;

    @IsNumber()
    invitation_id: number;
}