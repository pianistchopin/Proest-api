import {Position} from "@entity/position"
import {UpdatePositionDto} from "@dtos/updatePosition.dto";

export class PositionService{

    findAll = async () => {
        const positions: Position[] = await Position.find();
        return positions;
    }

    findOne = async (id: number) => {
        const position: Position = await Position.findOne(id);
        return position;
    }

    update = (id: number, updatePositionDto: UpdatePositionDto) => {

    }

    remove = (id: number) => {

    }

}
