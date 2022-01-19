import {UpdateStudentDto} from "../../dtos/updateStudent.dto";
import {NextFunction, Request, Response} from "express";
import {CoachService} from "../../services/coach/coach.service";
import {CoachInvitationService} from "../../services/coachInvitation.service";
import {Coach} from "../../entity/coach";
import {RequestWithCoach} from "../../interfaces/auth.interface";
import {CoachInvitation} from "../../entity/coachInvitation";
import moment from "moment";
import {CoachInvitationDto} from "../../dtos/coachInvitation.dto";
import {StudentService} from "../../services/student/student.service";
import {callFirebaseApi} from "../../utils/fireBase.util";
import {isEmpty} from "../../utils/util";
import {HttpException} from "../../exceptions/HttpException";
import {UpdateCoachDto} from "../../dtos/updateCoach.dto";
import fs from "fs";
import ThumbnailGenerator from 'video-thumbnail-generator';
import {ChatService} from "../../services/chat.service";

export class CoachController {

    public coachService = new CoachService();
    public studentService = new StudentService();
    public coachInvitationService = new CoachInvitationService();
    public chatService = new ChatService();

    update = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const id = req.coach.id;
            const userData: UpdateCoachDto = JSON.parse(JSON.stringify(req.body));

            const file = JSON.parse(JSON.stringify(req.files));
            if(file.file){
                console.log("exist");
                userData.avatar = this.saveFileStorage(file.file[0], "coach", id, ".jpg").file_path;
            }
            else{
                console.log("no exist");
            }

            /**
             * upload video file 
             */
            if(file.profile_video){
                const file_origin =  this.saveFileStorage(file.profile_video[0], "profile_video", id, ".mp4");
                userData.profile_video = file_origin.file_path;
                userData.profile_video_thumb = file_origin.file_thumb;
            }

            const updateUserData: Coach = await this.coachService.update(id, userData);
            res.status(200).json({ data: updateUserData, message: 'updated', status: 1 });
        }catch (error){
            next(error);
        }
    }

    getMyStudents = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const myStudents: any = await this.coachInvitationService.getMyStudent(coach_id);
            res.status(200).json({ data: myStudents, message: 'updated', status: 1 });
        }catch (error){
            next(error);
        }
    }

    getPendingStudents = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const coach_id = req.coach.id;
            const now_date = moment().format('YYYY-MM-DD');
            const expire_pending_date = moment(now_date).subtract(5, 'days').format("YYYY-MM-DD");
            const pendingStudents: any = await this.coachInvitationService.getPendingStudent(coach_id, expire_pending_date);
            res.status(200).json({ data: pendingStudents, message: 'pending students', status: 1 });
        }catch (error){
            next(error);
        }
    }

    generateInvitationCode = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            
            const coach_id = req.coach.id;
            const coachData: Coach = req.coach
            const code = this.createCode(1000, 9999);
            const validate_code = await this.checkCodeValidation(code);
            coachData.invitation_code = validate_code.toString();
            const updateUserData: Coach = await this.coachService.update(coach_id, coachData);

            res.status(200).json({data: validate_code, message: "generate invitation code", status:1})
        } catch (error) {
            next(error);
        }
    }
    
    checkCodeValidation = async (code: number) => {
        const coach_have_code: Coach = await this.coachService.findCoachByInviteCode(code);
        if(coach_have_code){
            let code_double = this.createCode(1000, 9999);
            await this.checkCodeValidation(code_double);
        }
        return code;
    }
    
    createCode = (min: number, max: number) => {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );
    }

    compareInvitationCode = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let success_result;
            const invitation_code = req.body.invitation_code;
            if (isEmpty(invitation_code)) throw new HttpException(200, "input invite code");
            const coach_have_code: Coach = await this.coachService.findCoachByInviteCode(invitation_code);
            if(coach_have_code){
                success_result = true;
                coach_have_code.invitation_code = "";
                await this.coachService.update(coach_have_code.id, coach_have_code);
            }else{
                success_result = false;
            }
            res.status(200).json({data: success_result, message: "compare invite code result is " + success_result, status:1})
        }catch (error) {
            next(error)
        }
    }

    findCoachByPosition = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const positionId = Number(req.body.position);
            const coaches: Coach[] = await this.coachService.findCoachByPosition(positionId);

            res.status(200).json({data: coaches, message: "coach list by position id", status:1})
        }catch (error){
            next(error);
        }
    }

    findCoachById = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const coach_id = Number(req.body.coach_id );
            const coach: Coach = await this.coachService.findCoachById(coach_id);

            res.status(200).json({data: coach, message: "coach by id", status:1})
        }catch (error){
            next(error);
        }
    }

    getFileExtension = (mime_type: string) =>{
        let extArray = mime_type.split("/");
        let extension = extArray[extArray.length - 1];

        return extension;
    }

    getCoachVideos = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        let video_data = [];
        const coach_id = req.coach.id;
        const chat_rows = await this.chatService.getCoachChatHistory(coach_id);
       
        chat_rows.forEach(function(chat) {
            let previous_file;
            
            if(chat.previous_coach_file){
                previous_file = {
                    file: chat.previous_coach_file,
                    file_thumb: chat.previous_coach_file_thumb
                }
                video_data.push(previous_file);
            }
            
            let week_file;
            if(chat.week_coach_file){
                week_file = {
                    file: chat.week_coach_file,
                    file_thumb: chat.week_coach_file_thumb
                }
                video_data.push(week_file);
            }
        });

        res.status(200).json({data: video_data, message: "video files and thumbs", status:1})
    }

    saveFileStorage = (file: any, key_path, user_id, file_extension) => {
        let saved_filename = key_path + "_" + user_id;


        let file_path = 'uploads/coach/' + saved_filename + file_extension;
        fs.rename('uploads/coach/' + file.filename, file_path, (err) => {
            if (err) {console.log(err);return;}});

        var file_thumb = "";
        if(file_extension === ".mp4" || file_extension === ".avi"){
            file_thumb = 'uploads/coach/' + saved_filename +'.jpg';
            
            /**
             * generate thumbnail
             */
            const tg = new ThumbnailGenerator({
                sourcePath: file_path,
                thumbnailPath: 'uploads/coach',
            });

            tg.generateOneByPercent(5)
                .then((value) => {
                    console.log(value);
                    fs.rename('uploads/coach/' + value, 'uploads/coach/' + saved_filename +'.jpg', (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    })
                }) ;

            //    -----------------generate thumbnail
        }
        return {file_path: file_path, file_thumb: file_thumb};
    }
}