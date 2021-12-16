import {UpdateStudentDto} from "@dtos/updateStudent.dto";
import {NextFunction, Request, Response} from "express";
import {CoachService} from "@services/coach/coach.service";
import {CoachInvitationService} from "@services/coachInvitation.service";
import {Coach} from "@entity/coach";
import {RequestWithCoach} from "@interfaces/auth.interface";
import {Student} from "@entity/student";

export class CoachController {

    public coachService = new CoachService();
    public coachInvitationService = new CoachInvitationService();

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const userData: UpdateStudentDto = req.body;
            const updateUserData: Coach = await this.coachService.update(id, userData);

            res.status(200).json({ data: updateUserData, message: 'updated' });
        }catch (error){
            next(error);
        }
    }

    getMyStudentAndInvite = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const myStudents: any = await this.coachInvitationService.getMyStudent(coach_id);
            const invitationStudents: any = await this.coachInvitationService.getInvitationStudent(coach_id);
    
            const myStudentsInvitationStudents = {
                myStudents: myStudents,
                invitationStudents: invitationStudents
            }
            
            res.status(200).json({ data: myStudentsInvitationStudents, message: 'updated' });
        }catch (error){
            next(error);
        }
    }

    accpetInvitation = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const student_id = req.body.student_id;
    
            const myStudents: any = await this.coachInvitationService.acceptInvitation(coach_id, student_id);
        }catch (error){
            next(error);
        }
    }
}