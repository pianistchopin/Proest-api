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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },

    filename: function (req: any, file: any, cb: any) {
        console.log(file);
        cb(null, Date.now() + ".jpg")
    }
});
const fileFilter = (req: any,file: any,cb: any) => {
    if(file.mimetype === "image/jpg"  ||
        file.mimetype ==="image/jpeg"  ||
        file.mimetype ===  "image/png"){

        cb(null, true);
    }else{
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
    }
}
const upload = multer({storage: storage, fileFilter : fileFilter});

class StudentRoute implements Routes {
    path: string = "/student";
    router: Router = Router();

    authController = new AuthController();
    studentController = new StudentController();
    coachInvitationController = new CoachInvitationController();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post(`${this.path}/register`,validationMiddleware(SignUpUserDto, 'body'), this.authController.signUp);
        this.router.post(`${this.path}/login`,validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
        this.router.get(`${this.path}/logout`,authMiddleware, this.authController.logOut);
        this.router.put(`${this.path}/:id(\\d+)`,[upload.single("file"), authMiddleware], this.studentController.update);
        this.router.post(`${this.path}/invite`,authMiddleware, this.coachInvitationController.inviteCoachFromStudent);
    }
}

export default StudentRoute;