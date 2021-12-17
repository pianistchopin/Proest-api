import {CreateStudentDto} from "@dtos/createStudent.dto";
import {UpdateStudentDto} from "@dtos/updateStudent.dto";
import {NextFunction, Request, Response} from "express";
import {StudentService} from "@services/student/student.service";
import {Student} from "@entity/student";
import {Coach} from "@entity/coach";
import {CoachService} from "@services/coach/coach.service";

export class StudentController {
    
    public studentService = new StudentService();
    public coachService = new CoachService();
    create = (createStudentDto: CreateStudentDto) => {
        
    }
    
    findAll = () => {
        
    }
    
    findOne = (id: number) => {
        
    }
    
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);
            const userData: UpdateStudentDto = JSON.parse(JSON.stringify(req.body));
            // const data = req.file;
            // console.log(data);
            const updateUserData: Student = await this.studentService.update(id, userData);

            res.status(200).json({ data: updateUserData, message: 'updated', status:1 });
        }catch (error){
            next(error);
        }
    }
    

    
    remove = (id: number) => {
        
    }
}