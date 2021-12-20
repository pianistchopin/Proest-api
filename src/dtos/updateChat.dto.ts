import {IsEmail, IsNumber, IsString} from "class-validator";

export class UpdateChatDto {


    @IsNumber()
    id: number;

    @IsNumber()
    room_id: number;

    @IsNumber()
    student_id: number;

    @IsNumber()
    coach_id: number;

    @IsNumber()
    last_message: string;

    @IsString()
    last_message_date: string;

    @IsString()
    read_status: string;

    @IsNumber()
    student_sender: number;
    
}