import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdateCourseDto  {

    @IsNumber()
    id: number;

    @IsString()
    title: String;

}
