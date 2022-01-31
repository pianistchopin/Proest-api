import {Study} from "../entity/study"
import {UpdateStudyDto} from "../dtos/updateStudy.dto";

export class StudyService{

    findAll = async () => {
        const studies: Study[] = await Study.find();
        return studies;
    }

    findOne = async (id: number) => {
        const study: Study = await Study.findOne(id);
        return study;
    }

    update = (id: number, updateStudyDto: UpdateStudyDto) => {

    }

    remove = (id: number) => {

    }

}
