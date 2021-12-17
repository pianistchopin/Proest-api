import {CoachInvitationDto} from "@dtos/coachInvitation.dto";
import {NextFunction, Request, Response} from "express";
import {CoachInvitation} from "@entity/coachInvitation";
import {CoachInvitationService} from "@services/coachInvitation.service";
import {RequestWithStudent} from "@interfaces/auth.interface";

export class CoachInvitationController{
    
    public coachInvitationService = new CoachInvitationService();
    
    inviteCoachFromStudent = async (req: RequestWithStudent, res: Response, next: NextFunction) => {

        try {
            const data: CoachInvitationDto = req.body;
            data.status = "pending";
            data.student_id = req.student.id;
            const createdData =  await this.coachInvitationService.create(data);
            res.status(200).json({  message: 'invite coach', status:1 });
        } catch (error){
            next(error);
        }
    }
}