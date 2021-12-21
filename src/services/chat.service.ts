import {Chat} from "@entity/chat";
import {getRepository} from "typeorm";
import {UpdateChatDto} from "@dtos/updateChat.dto";
import {Student} from "@entity/student";

export class ChatService{

    /**
     * message history by student and coach
     * @param student_id
     * @param coach_id
     */
    checkMessageHistory = async (student_id: number, coach_id: number) => {
        return await getRepository(Chat)
            .createQueryBuilder()
            .where("student_id = :student_id", {student_id: student_id })
            .where("coach_id = :coach_id", {coach_id: coach_id })
            .getOne();
    }

    getStudentChatHistory = async (student_id: number) => {
        return await getRepository(Chat)
            .createQueryBuilder()
            .where("student_id = :student_id", {student_id: student_id })
            .getRawMany();
    }
    
    update = async (chat_id: number, updateChatData: UpdateChatDto) => {
        await Chat.update(chat_id, updateChatData);
    }
    
    save = async (updateData: UpdateChatDto): Promise<Chat> => {
        const data = Chat.create(updateData)
        return await Chat.save(data);
    }

    findChatById = async (id: number) => {
        return await Chat.findOne(id);
    }
    
}