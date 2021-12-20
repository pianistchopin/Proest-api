import {CoachInvitationDto} from "@dtos/coachInvitation.dto";
import {CoachInvitation} from "@entity/coachInvitation";
import {getRepository, createQueryBuilder, getManager} from "typeorm";
import {Student} from "@entity/student";
import {Coach} from "@entity/coach";
import moment from "moment";

export class CoachInvitationService{

    update = (id: number, coachInvitationDto: CoachInvitationDto) => {

    }

    create = async (coachInvitationDto: CoachInvitationDto):Promise<CoachInvitation> => {

        const coachInvitation = CoachInvitation.create(coachInvitationDto);
        
        const result:CoachInvitation = await CoachInvitation.save(coachInvitation);
        return result;
    }

    getMyStudent = async (coach_id: Number) => {
        return await getManager().createQueryBuilder()
            .select("Student.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Student, "Student", "CoachInvitation.student_id = Student.id")
            .where("CoachInvitation.coach_id = :coach_id", {coach_id: coach_id})
            .andWhere("CoachInvitation.status = 'accept'")
            .getRawMany();
    }

    getInvitationStudent = async (coach_id: Number) => {
        return await getManager().createQueryBuilder()
            .select("Student.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Student, "Student", "CoachInvitation.student_id = Student.id")
            .where("CoachInvitation.coach_id = :coach_id", {coach_id: coach_id})
            .andWhere("CoachInvitation.status = 'pending'")
            .getRawMany();
    }

    acceptInvitation = async (coachInvitationDto: CoachInvitationDto, coach_id, student_id) => {
        
        return await CoachInvitation.createQueryBuilder("coachInvitation")
            .update(coachInvitationDto)
            .where("coach_id = :coach_id", { coach_id: coach_id })
            .andWhere("student_id = :student_id", { student_id: student_id })
            .andWhere("status = 'pending'")
            .execute();
    }

    declineInvitation = async (coach_id, student_id) => {
        await CoachInvitation.createQueryBuilder("coachInvitation")
            .delete()
            .where("coach_id = :coach_id", { coach_id: coach_id })
            .andWhere("student_id = :student_id", { student_id: student_id })
            .andWhere("status = 'pending'")
            .execute();
    }

    findMyCoach = async (student_id: Number) => {
        return await getManager().createQueryBuilder()
            .select("Coach.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Coach, "Coach", "CoachInvitation.coach_id = Coach.id")
            .where("CoachInvitation.student_id = :student_id", {student_id: student_id})
            .andWhere("CoachInvitation.status = 'accept'")
            .orderBy("CoachInvitation.start_date")
            .getRawOne();
    }

    findCoachHistory = async (student_id: Number) => {
        return await getManager().createQueryBuilder()
            .select("Coach.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Coach, "Coach", "CoachInvitation.coach_id = Coach.id")
            .where("CoachInvitation.student_id = :student_id", {student_id: student_id})
            .andWhere("CoachInvitation.status = 'completed'")
            .orderBy("CoachInvitation.start_date", 'DESC')
            .getRawOne();
    }
}