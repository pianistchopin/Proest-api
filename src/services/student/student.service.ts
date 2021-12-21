import {CreateStudentDto} from "@dtos/createStudent.dto";
import {UpdateStudentDto} from "@dtos/updateStudent.dto";
import {isEmpty} from "@utils/util";
import {HttpException} from "@exceptions/HttpException";
import {Student} from "@entity/student";
import {Coach} from "@entity/coach";

export class StudentService{
    create = (createStudentDto: CreateStudentDto) => {

    }

    findAll = () => {

    }

    findOne = (id: number) => {

    }

    update = async (id: number, updateStudentDto: UpdateStudentDto) => {
        if (isEmpty(updateStudentDto)) throw new HttpException(200, "You're not userData");
        
        const findStudent: Student = await Student.findOne(id);
        if(!findStudent) throw new HttpException(200, "You're not user");

        await Student.update(id, updateStudentDto);
        
        return await Student.findOne(id);
    }

    findStudentById = async (id: number) => {
        return await Student.findOne(id);
    }

    remove = (id: number) => {

    }
}