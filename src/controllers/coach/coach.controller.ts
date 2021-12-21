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
import {isEmpty} from "@utils/util";
import {HttpException} from "@exceptions/HttpException";

export class CoachController {

    public coachService = new CoachService();
    public studentService = new StudentService();
    public coachInvitationService = new CoachInvitationService();

    update = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const id = req.coach.id;
            const userData: UpdateStudentDto = JSON.parse(JSON.stringify(req.body));
            
            if(req.file){
                console.log("exist");
                userData.avatar = "uploads/coach/" + req.file.filename;
            }
            else{
                console.log("no exist");
            }
            
            const updateUserData: Coach = await this.coachService.update(id, userData);
            res.status(200).json({ data: updateUserData, message: 'updated', status: 1 });
        }catch (error){
            next(error);
        }
    }

    getMyStudents = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const myStudents: any = await this.coachInvitationService.getMyStudent(coach_id);
            res.status(200).json({ data: myStudents, message: 'updated', status: 1 });
        }catch (error){
            next(error);
        }
    }

    getPendingStudents = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const pendingStudents: any = await this.coachInvitationService.getPendingStudent(coach_id);
            res.status(200).json({ data: pendingStudents, message: 'pending students', status: 1 });
        }catch (error){
            next(error);
        }
    }

    generateInvitationCode = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            
            const coach_id = req.coach.id;
            const coachData: Coach = req.coach
            const code = this.createCode(1000, 9999);
            const validate_code = await this.checkCodeValidation(code);
            coachData.invitation_code = validate_code;
            const updateUserData: Coach = await this.coachService.update(coach_id, coachData);

            res.status(200).json({data: validate_code, message: "generate invitation code", status:1})
        } catch (error) {
            next(error);
        }
    }
    
    checkCodeValidation = async (code: number) => {
        const coach_have_code: Coach = await this.coachService.findCoachByInviteCode(code);
        if(coach_have_code){
            let code_double = this.createCode(1000, 9999);
            await this.checkCodeValidation(code_double);
        }
        return code;
    }
    
    createCode = (min: number, max: number) => {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );
    }

    compareInvitationCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let success_result;
            const invitation_code = req.body.invitation_code;
            if (isEmpty(invitation_code)) throw new HttpException(200, "input invite code");
            const coach_have_code: Coach = await this.coachService.findCoachByInviteCode(invitation_code);
            if(coach_have_code){
                success_result = "success";
                coach_have_code.invitation_code = 0;
                await this.coachService.update(coach_have_code.id, coach_have_code);
            }else{
                success_result = "fail";
            }
            res.status(200).json({data: success_result, message: "compare invite code result is " + success_result, status:1})
        }catch (error) {
            next(error)
        }
    }

    findCoachByPosition = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const positionId = Number(req.body.position);
            const coaches: Coach[] = await this.coachService.findCoachByPosition(positionId);

            res.status(200).json({data: coaches, message: "coach list by position id", status:1})
        }catch (error){
            next(error);
        }
    }

    findCoachById = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const coach_id = Number(req.body.coach_id );
            const coach: Coach = await this.coachService.findCoachById(coach_id);

            res.status(200).json({data: coach, message: "coach by id", status:1})
        }catch (error){
            next(error);
        }
    }
}