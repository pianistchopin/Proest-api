import {Study} from "../entity/study"
import {UpdateStudyDto} from "../dtos/updateStudy.dto";
import {CoachInvitation} from "@entity/coachInvitation";

export class StudyService{

    findAll = async () => {
        const studies: Study[] = await Study.find();
        return studies;
    }

    findOne = async (id: number) => {
        const study: Study = await Study.findOne(id);
        return study;
    }

    update = async (id: number, updateStudyDto: UpdateStudyDto) => {
        await Study.update(id, updateStudyDto);
    }

    remove = async (id: number) => {
        await Study.createQueryBuilder("Study")
            .delete()
            .where("id = :id", { id: id })
            .execute();
    }

    save = async (updateData: UpdateStudyDto): Promise<Study> => {
        const data = Study.create(updateData)
        return await Study.save(data);
    }

}
