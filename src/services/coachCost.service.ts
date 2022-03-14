import {CoachCost} from "../entity/coachCost"

export class CoachCostService{

    findAll = async () : Promise<CoachCost[]> => {
        return await CoachCost.find();
    }

    findOne = async (id: number) => {
        return await CoachCost.findOne(id);
    }

    update = (id: number, updatePositionDto) => {

    }

    remove = (id: number) => {

    }

}
