import {SchoolYear} from "../entity/schoolYear"
import {UpdateSchoolYearDto} from "../dtos/updateSchoolYear.dto";

export class SchoolYearService{

     findAll = async () => {
        const schoolYears: SchoolYear[] = await SchoolYear.find();
        return schoolYears;
    }
    
    findOne = async (id: number) => {
        const schoolYear: SchoolYear = await SchoolYear.findOne(id);
        return schoolYear;
    }
    
    update = (id: number, updateSchoolYearDto: UpdateSchoolYearDto) => {
        
    }
    
    remove = (id: number) => {
        
    }
    
}
