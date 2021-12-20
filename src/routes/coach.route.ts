import {Routes} from "@interfaces/routes.interface";
import {Router} from "express";
import AuthController from "@controllers/coach/auth.controller";
import {CoachController} from "@controllers/coach/coach.controller";
import validationMiddleware from "@middlewares/validation.middleware";
import {SignUpUserDto} from "@dtos/signUpUser.dto";
import {LoginUserDto} from "@dtos/loginUser.dto";
import CoachAuthMiddleware from "@middlewares/coachAuth.middleware";
import {CoachInvitationController} from "@controllers/coachInvitation.controller";
import {StudentController} from "@controllers/student/student.controller";
import {upload} from '@utils/util';
import authMiddleware from "@middlewares/auth.middleware";
import {ChatController} from "@controllers/chat.controller";

class CoachRoute implements Routes{
    path: string = "/coach";
    router: Router = Router();

    authController = new AuthController();
    coachController = new CoachController();
    coachInvitationController = new CoachInvitationController();
    chatController = new ChatController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post(`${this.path}/register`,validationMiddleware(SignUpUserDto, 'body'), this.authController.signUp);
        this.router.post(`${this.path}/login`,validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
        this.router.get(`${this.path}/logout`, this.authController.logOut);
        this.router.put(`${this.path}/update_profile`,[upload.single("file"), CoachAuthMiddleware], this.coachController.update);
        this.router.post(`${this.path}/find_coaches`, this.coachController.findCoachByPosition);
        this.router.get(`${this.path}/get_my_student_and_invite`,CoachAuthMiddleware, this.coachController.getMyStudentAndInvite);
        this.router.post(`${this.path}/accept_invite`,CoachAuthMiddleware, this.coachInvitationController.accpetInvitation);
        this.router.post(`${this.path}/decline_invite`, CoachAuthMiddleware, this.coachInvitationController.declineInvitation);
        this.router.post(`${this.path}/coach_manage_chat`,CoachAuthMiddleware, this.chatController.coachManageChat);
    }
}

export default CoachRoute