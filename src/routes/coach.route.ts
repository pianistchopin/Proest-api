import {Routes} from "../interfaces/routes.interface";
import {Router} from "express";
import AuthController from "../controllers/coach/auth.controller";
import {CoachController} from "../controllers/coach/coach.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import {SignUpUserDto} from "../dtos/signUpUser.dto";
import {LoginUserDto} from "../dtos/loginUser.dto";
import CoachAuthMiddleware from "../middlewares/coachAuth.middleware";
import {CoachInvitationController} from "../controllers/coachInvitation.controller";
import {StudentController} from "../controllers/student/student.controller";
import {coachUpload} from '../utils/util';
import authMiddleware from "../middlewares/auth.middleware";
import {ChatController} from "../controllers/chat.controller";
import path from "path";

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
        this.router.get(`${this.path}/logout`,CoachAuthMiddleware, this.authController.logOut); 
        this.router.put(`${this.path}/update_profile`,[CoachAuthMiddleware, coachUpload.fields([{name: 'file'}, {name: 'profile_video'}])], this.coachController.update);
        this.router.post(`${this.path}/get_my_students`,CoachAuthMiddleware, this.coachController.getMyStudents);
        this.router.post(`${this.path}/get_pending_students`,CoachAuthMiddleware, this.coachController.getPendingStudents);
        
        this.router.post(`${this.path}/accept_invite`,CoachAuthMiddleware, this.coachInvitationController.acceptInvitation);
        this.router.post(`${this.path}/decline_invite`, CoachAuthMiddleware, this.coachInvitationController.declineInvitation);
        this.router.post(`${this.path}/get_coach_by_id`, this.coachController.findCoachById);
        this.router.post(`${this.path}/generate_invite_code`, CoachAuthMiddleware, this.coachController.generateInvitationCode);
        this.router.post(`${this.path}/compare_invite_code`, this.coachController.compareInvitationCode);
        this.router.get(`${this.path}/tos`, function(req, res) {
            res.sendFile(path.join(__dirname, '../tos/coach_tos.html'));
        });
        this.router.post(`${this.path}/get_coach_videos`, CoachAuthMiddleware, this.coachController.getCoachVideos);
        this.router.post(`${this.path}/get_month_target`,CoachAuthMiddleware , this.coachInvitationController.getMonthTargetFromCoach);
    }
}

export default CoachRoute