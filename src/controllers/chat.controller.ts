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
            const student_id = data.student_id;
            const coach_id = data.coach_id;
            
            const message_history_flag = await this.chatService.checkMessageHistory(student_id, coach_id);
            let chat_id;
            if(message_history_flag){
                await this.chatService.update(message_history_flag.id, data);
                chat_id = message_history_flag.id;
            }else{
                const saved_chat:Chat = await this.chatService.save(data);
                chat_id = saved_chat.id;
            }
            const studentData = await this.studentService.findStudentById(student_id);
            const coachData = await this.coachService.findCoachById(coach_id);
            const chatData = await this.chatService.findChatById(chat_id);

            const resData = {
                ...chatData,
                student: studentData,
                coach: coachData
            }
            
            res.status(200).json({ data: {...resData}, message: 'chat history', status: 1});
        }catch (error){
            next(error)
        }
    }
    
    getChatHistory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const student_id = req.body.student_id;
            const coach_id = req.body.coach_id;

            const message_history = await this.chatService.checkMessageHistory(student_id, coach_id);
            const chat_id = message_history.id;
            
            const studentData = await this.studentService.findStudentById(student_id);
            const coachData = await this.coachService.findCoachById(coach_id);
            const chatData = await this.chatService.findChatById(chat_id);
            
            const resData = {
                ...chatData,
                student: studentData,
                coach: coachData
            }
            res.status(200).json({ data: resData, message: 'message history', status: 1});
        }catch (error){
            next(error);
        }
    }
}