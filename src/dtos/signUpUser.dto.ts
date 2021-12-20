import { IsEmail, IsString } from 'class-validator';

export class SignUpUserDto {
    @IsString()
    public user_name: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;

    @IsString()
    public fcm_token: string;

}
