import {Router} from "express";
import { Routes } from "../interfaces/routes.interface";
import AuthController from "../controllers/student/auth.controller"
import validationMiddleware from "../middlewares/validation.middleware";
import {LoginUserDto} from "../dtos/loginUser.dto";
import {SignUpUserDto} from "../dtos/signUpUser.dto";
import authMiddleware from "../middlewares/auth.middleware";
import {StudentController} from "../controllers/student/student.controller";
import {CoachInvitationController} from "../controllers/coachInvitation.controller"
import multer from "multer";
import {studentUpload} from '../utils/util';
import {ChatController} from "../controllers/chat.controller";
import path from "path";


class StudentRoute implements Routes {
    path: string = "/student";
    router: Router = Router();

    authController = new AuthController();
    studentController = new StudentController();
    coachInvitationController = new CoachInvitationController();
    chatController = new ChatController();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post(`${this.path}/register`,validationMiddleware(SignUpUserDto, 'body'), this.authController.signUp);
        this.router.post(`${this.path}/login`,validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
        this.router.get(`${this.path}/logout`,authMiddleware, this.authController.logOut);
        this.router.put(`${this.path}/update_profile`,[authMiddleware, studentUpload.single("file")], this.studentController.update);
        this.router.post(`${this.path}/get_top_rate_coaches`,authMiddleware, this.studentController.getTopRateCoach);
        this.router.post(`${this.path}/get_recommend_coaches`,authMiddleware, this.studentController.getRecommendCoach);
        this.router.post(`${this.path}/get_coaches_by_position`,authMiddleware, this.studentController.getCoachByPosition);
        this.router.post(`${this.path}/get_my_coach`,authMiddleware, this.studentController.getMyCoach);
        this.router.post(`${this.path}/get_history_coaches`, this.studentController.getMyCoachHistory);
        this.router.post(`${this.path}/invite_coach`,authMiddleware, this.coachInvitationController.inviteCoachFromStudent);
        this.router.post(`${this.path}/pending_coach`,authMiddleware, this.coachInvitationController.pendingCoach);
        this.router.post(`${this.path}/cancel_invite`,authMiddleware, this.coachInvitationController.cancelInvitation);
        this.router.post(`${this.path}/update_month_target`,authMiddleware , this.coachInvitationController.updateMonthTarget);
        this.router.post(`${this.path}/get_month_target`,authMiddleware , this.coachInvitationController.getMonthTarget);
        this.router.post(`${this.path}/get_student_by_id`, this.studentController.findStudentById);
        
        this.router.post(`${this.path}/get_my_coach_and_other`,authMiddleware, this.studentController.getMyCoachAndOther);
        this.router.get(`${this.path}/tos`, function(req, res) {
            res.sendFile(path.join(__dirname, '../tos/student_tos.html'));
        });

        this.router.post(`${this.path}/get_end_coach`,authMiddleware, this.coachInvitationController.getEndCoach);
        this.router.post(`${this.path}/give_review`,authMiddleware, this.coachInvitationController.giveReview);
    }
}

export default StudentRoute;