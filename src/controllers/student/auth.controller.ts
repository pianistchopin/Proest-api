import {NextFunction, Request, Response} from "express";
import AuthService from "../../services/student/auth.service";
import {LoginUserDto} from "../../dtos/loginUser.dto";
import {SignUpUserDto} from "../../dtos/signUpUser.dto";
import {Student} from "../../entity/student";
import { SchoolYearService } from "../../services/schoolYear.service";
import {PositionService} from "../../services/position.service";
import {PitchingBattingService} from "../../services/pitchingBatting.service";
import {RequestWithStudent} from "../../interfaces/auth.interface";
import {CreateStudentDto} from "../../dtos/createStudent.dto";
import {callFirebaseApi} from "../../utils/fireBase.util"
import {UpdateStudentDto} from "../../dtos/updateStudent.dto";


class AuthController{

    public authService = new AuthService();
    public schoolYearService = new SchoolYearService();
    public positionService = new PositionService();
    public pitchingBatting = new PitchingBattingService();
    
    constructor() {}
    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: SignUpUserDto  = req.body;
            const signUpUser: Student = await this.authService.signUp(userData);

            const school_years = await this.schoolYearService.findAll();
            const positions = await this.positionService.findAll();
            const pitching_battings = await this.pitchingBatting.findAll();

            
            const resData = {
                user: signUpUser,
                school_year_list: school_years,
                position_list: positions,
                pitching_batting_list: pitching_battings
            }
            
            res.status(201).json({ data: {...resData}, message: 'register', status: 1 });
        } catch (error) {
            next(error);
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: LoginUserDto = req.body;
            const user = await this.authService.logIn(userData);
            
            const school_years = await this.schoolYearService.findAll();
            const positions = await  this.positionService.findAll();
            const pitching_battings = await  this.pitchingBatting.findAll();
            const resData = {
                user: user,
                school_year_list: school_years,
                position_list: positions,
                pitching_batting_list: pitching_battings
            }
            res.status(200).json({ data: {...resData}, message: 'login', status: 1});
        }catch (error){
            next(error);
        }
    }

    logOut = async (req: RequestWithStudent, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = req.student;
            const logOutUserData: Student = await this.authService.logOut(userData);

            res.status(200).json({ message: 'logout', status:1});
        } catch (error){
            next(error);
        }
    };
}

export default AuthController