import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdateStudyDto {

    @IsNumber()
    id: number;

    @IsString()
    title: String;

}
