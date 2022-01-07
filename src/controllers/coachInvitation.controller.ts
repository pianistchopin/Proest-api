import {CoachInvitationDto} from "@dtos/coachInvitation.dto";
import {NextFunction, Request, Response} from "express";
import {CoachInvitation} from "@entity/coachInvitation";
import {CoachInvitationService} from "@services/coachInvitation.service";
import {RequestWithCoach, RequestWithStudent} from "@interfaces/auth.interface";
import moment from "moment";
import {UpdateStudentDto} from "@dtos/updateStudent.dto";
import {StudentService} from "@services/student/student.service";
import {CoachService} from "@services/coach/coach.service";

export class CoachInvitationController{
    
    public coachInvitationService = new CoachInvitationService();
    public studentService = new StudentService();
    public coachService = new CoachService();
    
    inviteCoachFromStudent = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const data: CoachInvitationDto = new CoachInvitationDto();
            data.status = "pending";
            data.student_id = req.student.id;
            data.coach_id = req.body.coach_id;
            data.invite_date = moment().format('YYYY-MM-DD');
            
            // overwrite invite from student to coach
            const force = req.body.force;

            const accept_data = await this.coachInvitationService.getInvitationByStudent(data.student_id, "accept");
            const pending_data = await this.coachInvitationService.getInvitationByStudent(data.student_id, "pending");
            
            let flag_available_invite = false;
            if(accept_data){
                const start_date = accept_data.start_date;
                const available_invite_date = moment(start_date).add(28, 'days').format("YYYY-MM-DD");
                const today_date = moment().format('YYYY-MM-DD');
                flag_available_invite = moment(today_date).isBefore(available_invite_date)
            }
            
            if(accept_data && flag_available_invite){
                const origin_coach = await this.coachService.findCoachById(accept_data.coach_id)
                res.status(200).json({ data: origin_coach.user_name,  message: 'exist_accept_coach', status:0 });
            }
            else if(pending_data && data.coach_id != pending_data.coach_id && !force){
                const previous_coach = await this.coachService.findCoachById(pending_data.coach_id)
                res.status(200).json({data:previous_coach.user_name,  message: 'exist_pending_coach', status:0 });
            }
            else{
                if(pending_data){
                    await this.coachInvitationService.update(pending_data.id, data);
                    const update_same_coach = await this.coachService.findCoachById(data.coach_id)
                    res.status(200).json({data: update_same_coach.user_name,  message: 'update_same_coach', status:1 });
                }
                else{
                    const createdData =  await this.coachInvitationService.create(data);
                    const new_invite_coach = await this.coachService.findCoachById(data.coach_id)
                    res.status(200).json({data: new_invite_coach.user_name,  message: 'new_invite', status:1 });
                }
            }
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

    acceptInvitation = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
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
             * set expire_date and coach_id of student table
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