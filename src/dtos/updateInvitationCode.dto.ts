import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdateInvitationCodeDto  {

    @IsNumber()
    id: number;

    @IsString()
    invitation_code: String;

}
