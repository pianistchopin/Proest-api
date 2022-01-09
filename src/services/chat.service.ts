import {Chat} from "@entity/chat";
import {getRepository} from "typeorm";
import {UpdateChatDto} from "@dtos/updateChat.dto";
import {Student} from "@entity/student";
import {CoachInvitation} from "@entity/coachInvitation";

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

    updateChatByCurDate = async (cur_date: string, student_id, coach_id, updateChatData: UpdateChatDto) => {
        return await Chat.createQueryBuilder("Chat")
            .update(updateChatData)
            .where("coach_id = :coach_id", { coach_id: coach_id })
            .andWhere("student_id = :student_id", { student_id: student_id })
            .andWhere("week_start_date <= :cur_date", { cur_date: cur_date })
            .andWhere("week_end_date >= :cur_date", { cur_date: cur_date })
            .execute();
    }

    getUpdatedCurDateRow = async (cur_date: string, student_id, coach_id) => {
        return await getRepository(Chat)
            .createQueryBuilder()
            .where("student_id = :student_id", {student_id: student_id })
            .where("coach_id = :coach_id", {coach_id: coach_id })
            .andWhere("week_start_date <= :cur_date", { cur_date: cur_date })
            .andWhere("week_end_date >= :cur_date", { cur_date: cur_date })
            .getOne();
    }
    
    save = async (updateData: UpdateChatDto): Promise<Chat> => {
        const data = Chat.create(updateData)
        return await Chat.save(data);
    }

    findChatById = async (id: number) => {
        return await Chat.findOne(id);
    }
    
}