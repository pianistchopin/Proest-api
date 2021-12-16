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
            const userData: UpdateStudentDto = req.body;
            const updateUserData: Student = await this.studentService.update(id, userData);

            res.status(200).json({ data: updateUserData, message: 'updated' });
        }catch (error){
            next(error);
        }
    }
    
    findCoachByPosition = async (req: Request, res: Response, next: NextFunction) =>{
        try{
            const positionId = Number(req.query.position);
            const coaches: Coach[] = await this.coachService.findCoachByPsition(positionId);
            
            res.status(200).json({data: coaches, message: "coach list by position id"})
            
        }catch (error){
            next(error);
        }
    }
    
    remove = (id: number) => {
        
    }
}