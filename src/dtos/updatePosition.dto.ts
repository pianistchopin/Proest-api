import { IsEmail, IsString } from 'class-validator';

export class UpdatePositionDto {
    @IsString()
    public user_name: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}
