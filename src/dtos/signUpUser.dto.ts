import { IsEmail, IsString } from 'class-validator';

export class SignUpUserDto {
    @IsString()
    public user_name: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;

    public created_at?: string
    
    public fcm_token?: string;

}
