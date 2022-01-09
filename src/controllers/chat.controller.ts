import {RequestWithCoach, RequestWithStudent} from "@interfaces/auth.interface";
import {NextFunction, Request, Response} from "express";
import {UpdateChatDto} from "@dtos/updateChat.dto";
import {CoachService} from "@services/coach/coach.service";
import {ChatService} from "@services/chat.service";
import {StudentService} from "@services/student/student.service";
import ThumbnailGenerator from 'video-thumbnail-generator';
import fs from "fs";
import {Chat} from "@entity/chat";

export class ChatController{
    
    public coachService = new CoachService();
    public studentService = new StudentService();
    public chatService = new ChatService();
    
    manageChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const cur_date = req.params.date;
            const data: UpdateChatDto = JSON.parse(JSON.stringify(req.body));
            const student_id = data.student_id;
            const coach_id = data.student_id;
            
            const file = JSON.parse(JSON.stringify(req.files));
            
            if(file.previous_student_file){
                let save_file = this.saveFileStorage(file.previous_student_file[0], "previous_student_file", student_id);
                data.previous_student_file = save_file.file_path;
                data.previous_student_file_thumb = save_file.file_thumb;
            }
            
            if(file.previous_coach_file){
                let save_file = this.saveFileStorage(file.previous_coach_file[0], "previous_coach_file", coach_id);
                data.previous_coach_file = save_file.file_path;
                data.previous_coach_file_thumb = save_file.file_thumb;
            }

            if(file.week_student_file){
                let save_file = this.saveFileStorage(file.week_student_file[0], "week_student_file", student_id);
                data.week_student_file = save_file.file_path;
                data.week_student_file_thumb = save_file.file_thumb;
            }

            if(file.week_coach_file){
                let save_file = this.saveFileStorage(file.week_coach_file[0], "week_coach_file", coach_id);
                data.week_coach_file = save_file.file_path;
                data.week_coach_file_thumb = save_file.file_thumb;
            }

            await this.chatService.updateChatByCurDate(cur_date, student_id, coach_id, data);
            const updatedRow = await this.chatService.getUpdatedCurDateRow(cur_date, student_id, coach_id);
            
            if(updatedRow)
                res.status(200).json({ data: updatedRow, message: 'updated message row', status: 1});
            else
                res.status(200).json({ message: 'No data', status: 0});
            
        }catch (error){
            next(error)
        }
    }

    getMessage = async (req: Request, res: Response, next: NextFunction) => {
        const cur_date = req.body.date;
        const student_id = req.body.student_id;
        const coach_id = req.body.student_id;
        
        
        const updatedRow = await this.chatService.getUpdatedCurDateRow(cur_date, student_id, coach_id);

        if(updatedRow)
            res.status(200).json({ data: updatedRow, message: 'message from student_id, coach_id, date', status: 1});
        else
            res.status(200).json({ message: 'No data', status: 0});
    }
    
    getFileExtension = (mime_type: string) =>{
        let extArray = mime_type.split("/");
        let extension = extArray[extArray.length - 1];
        
        return extension;
    }
    
    saveFileStorage = (file: any, key_path, user_id) => {
        let file_extension = this.getFileExtension(file.mimetype)
        let saved_filename = key_path + "_" + user_id;
        
        
        let file_path = 'uploads/chat/' + saved_filename + "." + file_extension;
        fs.rename('uploads/chat/' + file.filename, file_path, (err) => {
            if (err) {console.log(err);return;}});


        let file_thumb = "";
        if(file_extension === "mp4" || file_extension === "avi"){
            
            /**
             * generate thumbnail
             */
            const tg = new ThumbnailGenerator({
                sourcePath: file_path,
                thumbnailPath: 'uploads/chat',
            });
            
            file_thumb = 'uploads/chat/' + saved_filename +'.jpg';
            tg.generateOneByPercent(90)
                .then((value) => {
                    fs.rename('uploads/chat/' + value, 'uploads/chat/' + saved_filename +'.jpg', (err) => {
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