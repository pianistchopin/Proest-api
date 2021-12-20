import {CreateStudentDto} from "@dtos/createStudent.dto";
import {UpdateStudentDto} from "@dtos/updateStudent.dto";
import {NextFunction, Request, Response} from "express";
import {StudentService} from "@services/student/student.service";
import {Student} from "@entity/student";
import {Coach} from "@entity/coach";
import {CoachService} from "@services/coach/coach.service";
import {RequestWithCoach, RequestWithStudent} from "@interfaces/auth.interface";
import {CoachInvitationService} from "@services/coachInvitation.service";
import {callFirebaseApi} from "@utils/fireBase.util"

export class StudentController {
    
    public studentService = new StudentService();
    public coachInvitationService = new CoachInvitationService();
    public coachService = new CoachService();
    create = (createStudentDto: CreateStudentDto) => {
        
    }
    
    findAll = () => {
        
    }
    
    findOne = (id: number) => {
        
    }
    
    update = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const id = req.student.id;
            const userData: UpdateStudentDto = JSON.parse(JSON.stringify(req.body));
            userData.avatar = req.file.filename;
            // callFirebaseApi(userData.fcm_token);
            const updateUserData: Student = await this.studentService.update(id, userData);

            res.status(200).json({ data: updateUserData, message: 'updated', status:1 });
        }catch (error){
            next(error);
        }
    }

    getMyCoach =  async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student_id = req.student.id;
            const my_coach: any = await this.coachInvitationService.findMyCoach(student_id);
            
            res.status(200).json({ data: my_coach, message: 'my coach', status:1 });
        }catch (error){
            next(error);
        }
    }

    getMyCoachHistory = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student_id = req.student.id;
            const coach_history: any = await this.coachInvitationService.findCoachHistory(student_id);

            res.status(200).json({data: coach_history, message: 'my coach history', status: 1});
        } catch (error) {
            next(error);
        }
    }

    getTopRateCoach = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const top_rate_coach = await this.coachService.findCoachOrderByRate();
            res.status(200).json({ data: top_rate_coach, message: 'Top Rate Coach', status:1 });
        }catch (error){
            next(error);
        }
    }

    getMyCoachAndOther =  async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student_id = req.student.id;

            const my_coach: any = await this.coachInvitationService.findMyCoach(student_id);
            const other_cocah: any = await this.coachService.findCoachOrderByRate();
            
            const resData = {
                my_coach : my_coach,
                other_cocah : other_cocah
            }
            res.status(200).json({ data: resData, message: 'my coach and other', status:1 });
        }catch (error){
            next(error);
        }
    }

    getRecommendCoach = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student = req.student;
            const position_id = student.position;
            const recommend_coach: any = await this.coachService.findCoachByPsition(position_id);
            res.status(200).json({ data: recommend_coach, message: 'recommend coach by top rating with same position', status:1 });
        }catch (error) {
            next(error);
        }
    }
    
    remove = (id: number) => {
        
    }
}