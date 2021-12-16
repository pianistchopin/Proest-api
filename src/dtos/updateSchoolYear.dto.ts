import { IsEmail, IsString } from 'class-validator';

export class UpdateSchoolYearDto {
    @IsString()
    public user_name: string;

    @IsEmail()
    public email: string;

    @IsString()
    public password: string;
}
