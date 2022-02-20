import {NextFunction, Request, Response} from "express";
import AuthService from "../../services/coach/auth.service";
import {LoginUserDto} from "../../dtos/loginUser.dto";
import {SignUpUserDto} from "../../dtos/signUpUser.dto";
import {Coach} from "../../entity/coach";
import {SchoolYearService} from "../../services/schoolYear.service";
import {PositionService} from "../../services/position.service";
import {StudyService} from "../../services/study.service";
import {PitchingBattingService} from "../../services/pitchingBatting.service";
import {RequestWithCoach} from "../../interfaces/auth.interface";
import {callFirebaseApi} from "../../utils/fireBase.util";
import moment from "moment";
class AuthController{
    public authService = new AuthService();
    public schoolYearService = new SchoolYearService();
    public positionService = new PositionService();
    public studyService = new StudyService();
    public pitchingBatting = new PitchingBattingService();

    constructor() {}

    /**
     * after register, login with same account and set access token
     * @param req
     * @param res
     * @param next
     */
    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: SignUpUserDto  = req.body;
            userData.created_at = moment().format('YYYY-MM-DD h:mm:ss');
            const signUpUser: Coach = await this.authService.signUp(userData);

            const school_years = await this.schoolYearService.findAll();
            const positions = await this.positionService.findAll();
            const studies = await this.studyService.findAll();
            const pitching_battings = await this.pitchingBatting.findAll();
            const resData = {
                user: signUpUser,
                school_year_list: school_years,
                position_list: positions,
                study_list: studies,
                pitching_batting_list: pitching_battings
            }
            res.status(201).json({ data: {...resData}, message: 'register', status: 1 });
        } catch (error) {
            next(error);
        }
    }

    /**
     * when login, set access token
     * @param req
     * @param res
     * @param next
     */
    logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: LoginUserDto = req.body;
            const user = await this.authService.logIn(userData);

            const schoolYears = await this.schoolYearService.findAll();
            const positions = await this.positionService.findAll();
            const studies = await this.studyService.findAll();
            const pitchingBattings = await this.pitchingBatting.findAll();
            const resData = {
                user: user,
                school_year_list: schoolYears,
                position_list: positions,
                study_list: studies,
                pitching_batting_list: pitchingBattings
            }
            res.status(200).json({ data: {...resData}, message: 'login', status:1});
        }catch (error){
            next(error);
        }
    }

    /**
     * when log out , reset access_token
     * @param req
     * @param res
     * @param next
     */
    logOut = async (req: RequestWithCoach, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = req.coach;
            const logOutUserData: Coach = await this.authService.logOut(userData);

            res.status(200).json({data: logOutUserData, message: 'logout', status:1});
        } catch (error){
            next(error);
        }
    };
    
}

export default AuthController;