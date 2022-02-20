import {IsEmail, IsNumber, IsString, IsBoolean} from "class-validator";

export class UpdateCoachDto{

    @IsString()
    user_name?: string;

    @IsEmail()
    email?: string;

    @IsString()
    password?: string;

    @IsNumber()
    school_year?: number;

    @IsNumber()
    pitching_batting?: number;

    @IsNumber()
    position?: number;

    @IsNumber()
    study?: string;

    @IsString()
    baseball_career?: string;

    @IsString()
    avatar?: string;

    @IsString()
    profile?: string;

    @IsString()
    specialty?: string;

    @IsString()
    profile_video?: string;

    @IsString()
    profile_video_thumb?: string;

    @IsString()
    payment?: string;

    @IsString()
    rating?: number;

    @IsString()
    access_token?: string;

    @IsString()
    invitation_code?: string;

    @IsString()
    fcm_token?: string;

    @IsString()
    stripe_account_id?: string;

    @IsBoolean()
    stripe_settings_complete?: boolean;

}