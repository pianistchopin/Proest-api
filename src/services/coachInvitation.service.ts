import {CoachInvitationDto} from "@dtos/coachInvitation.dto";
import {CoachInvitation} from "@entity/coachInvitation";
import {getRepository, createQueryBuilder, getManager} from "typeorm";
import {Student} from "@entity/student";

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
            .andWhere("CoachInvitation.status = 'accepted'")
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

    acceptInvitation = async (coach_id, student_id) => {

        const coachInvitation = new CoachInvitation();
        coachInvitation.status = "accepted";
        await CoachInvitation.createQueryBuilder("coachInvitation")
            .update(coachInvitation)
            .where("coach_id = :coach_id", { coach_id: coach_id })
            .andWhere("student_id = :student_id", { student_id: student_id })
            .execute();
        
    }
}