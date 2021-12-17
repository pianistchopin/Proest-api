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

class CoachRoute implements Routes{
    path: string = "/coach";
    router: Router = Router();

    authController = new AuthController();
    coachController = new CoachController();
    coachInvitationController = new CoachInvitationController();
    studentController = new StudentController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post(`${this.path}/register`,validationMiddleware(SignUpUserDto, 'body'), this.authController.signUp);
        this.router.post(`${this.path}/login`,validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
        this.router.get(`${this.path}/logout`, this.authController.logOut);
        this.router.put(`${this.path}/:id(\\d+)`, this.coachController.update);
        this.router.get(`${this.path}/getMyStudentAndInvite`,CoachAuthMiddleware, this.coachController.getMyStudentAndInvite);
        this.router.post(`${this.path}/accept`,CoachAuthMiddleware, this.coachController.accpetInvitation);
        this.router.post(`${this.path}/find_coaches`, this.coachController.findCoachByPosition);
    }
}

export default CoachRoute