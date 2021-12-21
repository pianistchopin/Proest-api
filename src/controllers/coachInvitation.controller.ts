import {CoachInvitationDto} from "@dtos/coachInvitation.dto";
import {NextFunction, Request, Response} from "express";
import {CoachInvitation} from "@entity/coachInvitation";
import {CoachInvitationService} from "@services/coachInvitation.service";
import {RequestWithCoach, RequestWithStudent} from "@interfaces/auth.interface";
import moment from "moment";
import {UpdateStudentDto} from "@dtos/updateStudent.dto";
import {StudentService} from "@services/student/student.service";

export class CoachInvitationController{
    
    public coachInvitationService = new CoachInvitationService();
    public studentService = new StudentService();
    
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

    pendingCoach = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student_id = req.student.id;
            const my_coach: any = await this.coachInvitationService.findPendingCoach(student_id);

            res.status(200).json({ data: my_coach, message: 'my coach', status:1 });
            
        } catch (error){
            next(error);
        }
    }

    accpetInvitation = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const student_id = req.body.student_id;

            const start_date = moment().format('YYYY-MM-DD');
            const expire_date = moment(start_date).add(1, 'M').format("YYYY-MM-DD");

            /**
             * update set start_date and expire_date of invitation table
             */
            const coachInvitationDto = new CoachInvitationDto();
            coachInvitationDto.status = "accept";
            coachInvitationDto.start_date = start_date;
            coachInvitationDto.expire_date = expire_date;
            await this.coachInvitationService.acceptInvitation(coachInvitationDto, coach_id, student_id);

            /**
             * set expire_date of student table
             */
            const studentDto = new UpdateStudentDto();
            studentDto.coach_id = coach_id;
            studentDto.expire_date = expire_date;
            await this.studentService.update(student_id, studentDto);

            res.status(200).json({  message: 'accept invitation', status:1 });
        }catch (error){
            next(error);
        }
    }

    declineInvitation = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const student_id = req.body.student_id;

            await this.coachInvitationService.removeInvitation(coach_id, student_id);

            res.status(200).json({  message: 'decline invitation', status:1 });
        }catch (error){
            next(error);
        }
    }

    cancelInvitation = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student_id = req.student.id;
            const coach_id = req.body.coach_id;

            await this.coachInvitationService.removeInvitation(coach_id, student_id);
            res.status(200).json({  message: 'cancel invitation', status:1 });
        }catch (error){
            next(error);
        }
    }
    
}