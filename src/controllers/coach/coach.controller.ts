import {UpdateStudentDto} from "@dtos/updateStudent.dto";
import {NextFunction, Request, Response} from "express";
import {CoachService} from "@services/coach/coach.service";
import {CoachInvitationService} from "@services/coachInvitation.service";
import {Coach} from "@entity/coach";
import {RequestWithCoach} from "@interfaces/auth.interface";
import {CoachInvitation} from "@entity/coachInvitation";
import moment from "moment";
import {CoachInvitationDto} from "@dtos/coachInvitation.dto";
import {StudentService} from "@services/student/student.service";
import {callFirebaseApi} from "@utils/fireBase.util";

export class CoachController {

    public coachService = new CoachService();
    public studentService = new StudentService();
    public coachInvitationService = new CoachInvitationService();

    update = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const id = req.coach.id;
            const userData: UpdateStudentDto = JSON.parse(JSON.stringify(req.body));
            const updateUserData: Coach = await this.coachService.update(id, userData);
            // const data = req.file;
            // console.log(data);
            
            res.status(200).json({ data: updateUserData, message: 'updated', status: 1 });
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



    findCoachByPosition = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const positionId = Number(req.body.position);
            const coaches: Coach[] = await this.coachService.findCoachByPsition(positionId);

            res.status(200).json({data: coaches, message: "coach list by position id", status:1})
        }catch (error){
            next(error);
        }
    }
}