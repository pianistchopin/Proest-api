import {RequestWithCoach, RequestWithStudent} from "@interfaces/auth.interface";
import {NextFunction, Response} from "express";
import {UpdateChatDto} from "@dtos/updateChat.dto";
import {CoachService} from "@services/coach/coach.service";
import {ChatService} from "@services/chat.service";
import {StudentService} from "@services/student/student.service";
import {Chat} from "@entity/chat";

export class ChatController{
    
    public coachService = new CoachService();
    public studentService = new StudentService();
    public chatService = new ChatService();
    
    studentManageChat = async (req: RequestWithStudent, res: Response, next: NextFunction) => {
        try {
            const data: UpdateChatDto = req.body;
            const student_id = req.student.id;
            const coach_id = data.coach_id;
            data.student_id = student_id;
            
            const resData = await this.manageChat(data, student_id, coach_id);
            console.log(resData);
            res.status(200).json({ data: {...resData}, message: 'chat history', status: 1});
        }catch (error){
            next(error)
        }
    }
    
    coachManageChat = async (req: RequestWithCoach, res: Response, next: NextFunction) => {
        try {
            const data: UpdateChatDto = req.body;
            const coach_id = req.coach.id;
            const student_id = data.student_id;
            data.coach_id = coach_id;
            const resData = await this.manageChat(data, student_id, coach_id);

            res.status(200).json({ data: {...resData}, message: 'chat history', status: 1});
        }catch (error) {
            next(error);
        }
    }
    
    manageChat = async (data: UpdateChatDto, student_id, coach_id) => {
       
        
        const message_history_flag = await this.chatService.checkMessageHistory(student_id, coach_id);
        let chat_id ;

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
        
        return resData;
    }
}