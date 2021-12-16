import {NextFunction, Request, Response} from "express";
import AuthService from "@services/coach/auth.service";
import {LoginUserDto} from "@dtos/loginUser.dto";
import {SignUpUserDto} from "@dtos/signUpUser.dto";
import {Coach} from "@entity/coach";
import {SchoolYearService} from "@services/schoolYear.service";
import {PositionService} from "@services/position.service";
import {PitchingBattingService} from "@services/pitchingBatting.service";
import {RequestWithUser} from "@interfaces/auth.interface";
class AuthController{
    public authService = new AuthService();
    public schoolYearService = new SchoolYearService();
    public positionService = new PositionService();
    public pitchingBatting = new PitchingBattingService();

    constructor() {}

    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: SignUpUserDto  = req.body;
            const signUpUser: Coach = await this.authService.signUp(userData);
            res.status(201).json({ data: signUpUser, message: 'signup' });
        } catch (error) {
            next(error);
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: LoginUserDto = req.body;
            const user = await this.authService.logIn(userData);

            const schoolYears = this.schoolYearService.findAll();
            const positions = this.positionService.findAll();
            const pitchingBattings = this.pitchingBatting.findAll();
            const resData = {
                user: user,
                schoolYear: schoolYears,
                position: positions,
                pitchingBatting: pitchingBattings
            }
            res.status(200).json({ ...resData, message: 'login'});
        }catch (error){
            next(error);
        }
    }

    logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = req.user;
            const logOutUserData: Coach = await this.authService.logOut(userData);

            res.status(200).json({data: logOutUserData, message: 'logout'});
        } catch (error){
            next(error);
        }
    };
    
}

export default AuthController;