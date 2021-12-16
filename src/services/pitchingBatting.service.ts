import {PitchingBatting} from "@entity/pitchingBatting"
import {UpdatePitchingBattingDto} from "@dtos/updatePitchingBatting.dto";

export class PitchingBattingService{

    findAll = async () => {
        const pitchingBattings: PitchingBatting[] = await PitchingBatting.find();
        return pitchingBattings;
    }

    findOne = async (id: number) => {
        const pitchingBatting: PitchingBatting = await PitchingBatting.findOne(id);
        return pitchingBatting;
    }

    update = (id: number, updatePositionDto: UpdatePitchingBattingDto) => {

    }

    remove = (id: number) => {

    }

}
