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
            coachInvitationDto.status = "accepted";
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