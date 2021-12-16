import {CoachInvitationDto} from "@dtos/coachInvitation.dto";
import {NextFunction, Request, Response} from "express";
import {CoachInvitation} from "@entity/coachInvitation";
import {CoachInvitationService} from "@services/coachInvitation.service";

export class CoachInvitationController{
    
    public coachInvitationService = new CoachInvitationService();
    
    inviteCoachFromStudent = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const data: CoachInvitationDto = req.body;
            data.status = "pending";
            const createdData =  await this.coachInvitationService.create(data);
            res.status(200).json({  message: 'invite coach' });
        } catch (error){
            next(error);
        }
    }
}