import {UpdateCoachDto} from "@dtos/updateCoach.dto";
import {isEmpty} from "@utils/util";
import {HttpException} from "@exceptions/HttpException";
import {Coach} from "@entity/coach";
import {getManager, getRepository} from "typeorm";


export class CoachService{
    update = async (id: number, updateCoachDto: UpdateCoachDto) => {
        if (isEmpty(updateCoachDto)) throw new HttpException(400, "You're not userData");

        const findCoach: Coach = await Coach.findOne(id);
        if(!findCoach) throw new HttpException(409, "You're not user");

        await Coach.update(id, updateCoachDto);

        return await Coach.findOne(id);
    }

    findCoachByPsition = async (posigionId: number) => {
        const coaches: Coach[] = await getRepository(Coach).createQueryBuilder().where("position = :position", {position: posigionId }).getMany();
        
        return coaches;
    }
    
}