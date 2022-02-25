import {CreateStudentDto} from "../../dtos/createStudent.dto";
import {UpdateStudentDto} from "../../dtos/updateStudent.dto";
import {NextFunction, Request, Response} from "express";
import {StudentService} from "../../services/student/student.service";
import {Student} from "../../entity/student";
import {Coach} from "../../entity/coach";
import {CoachService} from "../../services/coach/coach.service";
import {RequestWithCoach, RequestWithStudent} from "../../interfaces/auth.interface";
import {CoachInvitationService} from "../../services/coachInvitation.service";
import {callFirebaseApi} from "../../utils/fireBase.util";
import {ChatService} from "../../services/chat.service";

export class StudentController {
    
    public studentService = new StudentService();
    public coachInvitationService = new CoachInvitationService();
    public coachService = new CoachService();
    public chatService = new ChatService();

    public Stripe_Key = "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";
    public stripe = require("stripe")(this.Stripe_Key);

    deleteUser = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const id = req.student.id;

            const subscription_id = req.student.subscription_id;
            // const pendingStudent = this.coachInvitationService.findStudentByIdStatus(id, "pending");
            // if(pendingStudent){
            //     res.status(200).json({  message: 'can not delete student. you sent invitation to coach. please verify', status: 0 });
            // }

            // const acceptStudent = this.coachInvitationService.findStudentByIdStatus(id, "accept");
            // if(acceptStudent){
            //     res.status(200).json({  message: 'can not delete student. you accept from coach. please verify', status: 0 });
            // }

            await this.coachInvitationService.removeStudent(id);
            await this.chatService.removeStudent(id);
            await this.studentService.delete(id);

            const deleted = await this.stripe.subscriptions.del(
                subscription_id
            );

            res.status(200).json({  message: 'delete coach', status: 1 });
        }catch (error){
            next(error);
        }
    }

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
            if(req.file){
                console.log("exist");
                userData.avatar = "uploads/student/" + req.file.filename;
            }
            else{
                console.log("no exist");
            }
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

    getMyCoachHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const student_id = req.body.student_id;
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
            const other_coach: any = await this.coachService.findCoachOrderByRate();
            
            const resData = {
                my_coach : my_coach,
                other_coach : other_coach
            }
            res.status(200).json({ data: resData, message: 'my coach and other', status:1 });
        }catch (error){
            next(error);
        }
    }

    getRecommendCoach_position = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student = req.student;
            const position_id = student.position;
            const recommend_coach: any = await this.coachService.findCoachByPosition(position_id);
            res.status(200).json({ data: recommend_coach, message: 'recommend coach by top rating with same position', status:1 });
        }catch (error) {
            next(error);
        }
    }

    getRecommendCoach = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const student = req.student;
            const course_id = student.course;
            const recommend_coach: any = await this.coachService.findCoachByCourse(course_id);
            res.status(200).json({ data: recommend_coach, message: 'recommend coach by top rating with same course', status:1 });
        }catch (error) {
            next(error);
        }
    }

    getCoachByPosition = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const position_id = req.body.position;
            const recommend_coach: any = await this.coachService.findCoachByPosition(position_id);
            res.status(200).json({ data: recommend_coach, message: 'recommend coach by top rating with same position', status:1 });
        }catch (error) {
            next(error);
        }
    }

    getCoachByCourse = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const course_id = req.body.course;
            const all_coach: Coach[] = await this.coachService.findAllCoach();

            let recommend_coach = [];
            all_coach.forEach((coach) => {

                let courseArr = coach.course.split(",");
                let course_flag = courseArr.find(id => id === course_id);
                if(course_flag){
                    recommend_coach.push(coach);
                }
            })

            res.status(200).json({ data: recommend_coach, message: 'recommend coach by top rating with same course', status:1 });
        }catch (error) {
            next(error);
        }
    }

    findStudentById = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const student_id = Number(req.body.student_id );
            const student: Student = await this.studentService.findStudentById(student_id);

            res.status(200).json({data: student, message: "student by id", status:1})
        }catch (error){
            next(error);
        }
    }
    
    remove = (id: number) => {
        
    }
}