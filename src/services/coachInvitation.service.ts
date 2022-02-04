import {CoachInvitationDto} from "../dtos/coachInvitation.dto";
import {CoachInvitation} from "../entity/coachInvitation";
import {getRepository, createQueryBuilder, getManager} from "typeorm";
import {Student} from "../entity/student";
import {Coach} from "../entity/coach";
import moment from "moment";
import {isEmpty} from "../utils/util";
import {HttpException} from "../exceptions/HttpException";

export class CoachInvitationService{

    update = async (id: number, coachInvitationDto: CoachInvitationDto) => {

        if (isEmpty(coachInvitationDto)) throw new HttpException(200, "You're not userData");

        await CoachInvitation.update(id, coachInvitationDto);
    }

    create = async (coachInvitationDto: CoachInvitationDto):Promise<CoachInvitation> => {

        const coachInvitation = CoachInvitation.create(coachInvitationDto);
        
        const result:CoachInvitation = await CoachInvitation.save(coachInvitation);
        return result;
    }

    updateMonthTarget = async (student_id: number, coachInvitationDto: CoachInvitationDto) => {

        return await CoachInvitation.createQueryBuilder("coachInvitation")
            .update(coachInvitationDto)
            .andWhere("student_id = :student_id", { student_id: student_id })
            .andWhere("status = 'accept'")
            .execute();
    }

    getCurrentAcceptEnable = async (student_id: number, current_date: string) => {
        return await CoachInvitation.createQueryBuilder("coachInvitation")
            .select("*")
            .where("student_id = :student_id", { student_id: student_id })
            .andWhere("status = 'accept'")
            .andWhere("start_date <= :current_date", { current_date: current_date })
            .andWhere("expire_date >= :current_date", { current_date: current_date })
            .getRawOne();
    }

    getCurrentMonthTarge = async (student_id: number, coach_id:number, current_date: string) => {
        return await CoachInvitation.createQueryBuilder("coachInvitation")
            .select("*")
            .where("student_id = :student_id", { student_id: student_id })
            .andWhere("coach_id = :coach_id", { coach_id: coach_id })
            .andWhere("start_date <= :current_date", { current_date: current_date })
            .andWhere("expire_date >= :current_date", { current_date: current_date })
            .getRawOne();
    }
    
    getInvitationByStudent = async (student_id: number, status: string) => {
        return await CoachInvitation.createQueryBuilder("coachInvitation")
            .select("*")
            .where("student_id = :student_id", { student_id: student_id })
            .andWhere("status = :status", {status: status})
            .getRawOne();
    }

    getMyStudent = async (coach_id: number) => {
        return await getManager().createQueryBuilder()
            .select("Student.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Student, "Student", "CoachInvitation.student_id = Student.id")
            .where("CoachInvitation.coach_id = :coach_id", {coach_id: coach_id})
            .andWhere("CoachInvitation.status = 'accept'")
            .getRawMany();
    }

    getPendingStudent = async (coach_id: number, expire_pending_date: string) => {
        return await getManager().createQueryBuilder()
            .select("Student.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Student, "Student", "CoachInvitation.student_id = Student.id")
            .where("CoachInvitation.coach_id = :coach_id", {coach_id: coach_id})
            .andWhere("CoachInvitation.status = 'pending'")
            .andWhere("CoachInvitation.invite_date >= :expire_pending_date", { expire_pending_date: expire_pending_date })
            .getRawMany();
    }

    findPendingCoach = async (student_id: number) => {
        return await getManager().createQueryBuilder()
            .select("Coach.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Coach, "Coach", "CoachInvitation.coach_id = Coach.id")
            .where("CoachInvitation.student_id = :student_id", {student_id: student_id})
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

    getAcceptRow = async (coach_id, student_id): Promise<CoachInvitation> => {
        return await getRepository(CoachInvitation)
            .createQueryBuilder()
            .select("*")
            .where("coach_id = :coach_id", { coach_id: coach_id })
            .andWhere("student_id = :student_id", { student_id: student_id })
            .andWhere("status = 'accept'")
            .getRawOne();
    }

    getEndCoach = async (student_id, current_date): Promise<CoachInvitation> => {
        return await getRepository(CoachInvitation)
            .createQueryBuilder()
            .select("*")
            .where("student_id = :student_id", { student_id: student_id })
            .andWhere("expire_date < :current_date", { current_date: current_date })
            .andWhere("status = 'accept'")
            .getRawOne();
    }

    removeInvitation = async (coach_id, student_id) => {
        await CoachInvitation.createQueryBuilder("coachInvitation")
            .delete()
            .where("coach_id = :coach_id", { coach_id: coach_id })
            .andWhere("student_id = :student_id", { student_id: student_id })
            .andWhere("status = 'pending'")
            .execute();
    }

    findMyCoach = async (student_id: number) => {
        return await getManager().createQueryBuilder()
            .select("Coach.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Coach, "Coach", "CoachInvitation.coach_id = Coach.id")
            .where("CoachInvitation.student_id = :student_id", {student_id: student_id})
            .andWhere("CoachInvitation.status = 'accept'")
            .getRawOne();
    }

    findCoachHistory = async (student_id: number) => {
        return await getManager().createQueryBuilder()
            .select("Coach.*")
            .from(CoachInvitation, "CoachInvitation")
            .innerJoin(Coach, "Coach", "CoachInvitation.coach_id = Coach.id")
            .where("CoachInvitation.student_id = :student_id", {student_id: student_id})
            .andWhere("CoachInvitation.status = 'complete'")
            .orderBy("CoachInvitation.start_date", 'DESC')
            .getRawMany();
    }

    findStudentByIdStatus =async (student_id:number, status: string) => {
        return await getRepository(CoachInvitation)
        .createQueryBuilder()
        .select("*")
        .where("student_id = :student_id", { student_id: student_id })
        .andWhere("status = :status", {status: status})
        .getRawOne();
        
    }

    removeStudent = async (student_id) => {
        await CoachInvitation.createQueryBuilder("coachInvitation")
            .delete()
            .where("student_id = :student_id", { student_id: student_id })
            .execute();
    }
}