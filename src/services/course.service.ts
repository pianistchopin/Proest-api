import {Course} from "../entity/course"
import {UpdateCourseDto} from "../dtos/updateCourse.dto";
import {CoachInvitation} from "@entity/coachInvitation";

export class CourseService {

    findAll = async () => {
        return await Course.find();
    }

    findOne = async (id: number) => {
        return await Course.findOne(id);
    }

    update = async (id: number, updateCourseDto: UpdateCourseDto) => {
        await Course.update(id, updateCourseDto);
    }

    remove = async (id: number) => {
        await Course.createQueryBuilder("Course")
            .delete()
            .where("id = :id", { id: id })
            .execute();
    }

    save = async (updateData: UpdateCourseDto): Promise<Course> => {
        const data = Course.create(updateData)
        return await Course.save(data);
    }

}
