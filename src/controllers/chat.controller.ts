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
            const cur_date = req.params.cur_date;
            const data: UpdateChatDto = JSON.parse(JSON.stringify(req.body));
            const student_id = data.student_id;
            const coach_id = data.student_id;
            
            const file = JSON.parse(JSON.stringify(req.files));
            console.log(file);
            
            
            if(file.previous_file){
                data.previous_file = this.saveFileStorage(file.previous_file[0], "previous_file", student_id);
            }
            
            if(file.today_file){
                data.today_file = this.saveFileStorage(file.today_file[0], "today_file", student_id);
            }

            if(file.coach_file){
                data.coach_file = this.saveFileStorage(file.coach_file[0], "coach_file", coach_id);
            }
            await this.chatService.update(cur_date, data);
            
            res.status(200).json({ data: "aa", message: 'chat history', status: 1});
        }catch (error){
            next(error)
        }
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


        if(file_extension === "mp4" || file_extension === "avi"){
            
            /**
             * generate thumbnail
             */
            const tg = new ThumbnailGenerator({
                sourcePath: file_path,
                thumbnailPath: 'uploads/chat',
            });

            tg.generateOneByPercent(90)
                .then((value) => {
                    console.log(value);
                    fs.rename('uploads/chat/' + value, 'uploads/chat/' + saved_filename +'.jpg', (err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                    })
                }) ;
            
        //    -----------------generate thumbnail
        }
        
        return file_path;
    }
  
}