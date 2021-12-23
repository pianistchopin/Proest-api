import {RequestWithCoach, RequestWithStudent} from "@interfaces/auth.interface";
import {NextFunction, Request, Response} from "express";
import {UpdateChatDto} from "@dtos/updateChat.dto";
import {CoachService} from "@services/coach/coach.service";
import {ChatService} from "@services/chat.service";
import {StudentService} from "@services/student/student.service";
import {Chat} from "@entity/chat";

export class ChatController{
    
    public coachService = new CoachService();
    public studentService = new StudentService();
    public chatService = new ChatService();
    
    manageChat = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: UpdateChatDto = req.body;
            
            const filename = req.files
            
            const file = JSON.parse(JSON.stringify(filename));
            console.log(file.video);
            
            
            res.status(200).json({ data: "aa", message: 'chat history', status: 1});
        }catch (error){
            next(error)
        }
    }
  
}