import {Router} from "express";
import { Routes } from "@interfaces/routes.interface";
import AuthController from "@controllers/student/auth.controller"
import validationMiddleware from "@middlewares/validation.middleware";
import {LoginUserDto} from "@dtos/loginUser.dto";
import {SignUpUserDto} from "@dtos/signUpUser.dto";
import authMiddleware from "@middlewares/auth.middleware";
import {StudentController} from "@controllers/student/student.controller";
import {CoachInvitationController} from "@controllers/coachInvitation.controller"
import multer from "multer";
import {upload} from '@utils/util';
import {ChatController} from "@controllers/chat.controller";


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
        this.router.put(`${this.path}/update_profile`,[upload.single("file"), authMiddleware], this.studentController.update);
        this.router.post(`${this.path}/get_top_rate_coach`,authMiddleware, this.studentController.getTopRateCoach);
        this.router.post(`${this.path}/get_recommend_coach`,authMiddleware, this.studentController.getRecommendCoach);
        this.router.post(`${this.path}/get_my_coach`,authMiddleware, this.studentController.getMyCoach);
        this.router.post(`${this.path}/get_my_coach_history`,authMiddleware, this.studentController.getMyCoachHistory);
        this.router.post(`${this.path}/invite_coach`,authMiddleware, this.coachInvitationController.inviteCoachFromStudent);
        
        
        this.router.post(`${this.path}/student_mange_chat`,authMiddleware, this.chatController.studentManageChat);
        this.router.post(`${this.path}/get_my_coach_and_other`,authMiddleware, this.studentController.getMyCoachAndOther);
        
    }
}

export default StudentRoute;